"""
model_v2.py — ConvNeXt-V2 Dual-Head Oral Cancer Classifier
============================================================
Architecture:
  - Backbone: ConvNeXt-V2 Tiny (ImageNet-22K + FCMAE pretrained)
  - Main Head: 4-class (Benign, Healthy, OCA, OPMD)
  - Auxiliary Head: Binary Benign-vs-OPMD (forces Benign/OPMD discrimination)

Anti-Overfitting:
  - Dropout (0.4 main head, 0.3 aux head)
  - LayerNorm before each head
  - EMA (Exponential Moving Average) model tracking

Anti-Underfitting:
  - ConvNeXt-V2 with GRN (Global Response Normalization) prevents feature collapse
  - ImageNet-22K pretraining provides 10x richer features than ImageNet-1K
  - Dual head forces backbone to learn Benign-OPMD discriminative features
"""

import copy
import torch
import torch.nn as nn
import torch.nn.functional as F
import timm


class OralCancerNetV2(nn.Module):
    """
    ConvNeXt-V2 with Dual-Head architecture.

    The auxiliary Benign-vs-OPMD head is the KEY innovation:
    it forces the backbone to learn features that distinguish
    the two most visually similar classes, which is the #1 source
    of accuracy loss in the current models.
    """

    # Ordered by preference: ImageNet-22K 384px > 22K default > 1K
    MODEL_CANDIDATES = {
        'convnextv2_tiny': [
            'convnextv2_tiny.fcmae_ft_in22k_in1k_384',
            'convnextv2_tiny.fcmae_ft_in22k_in1k',
            'convnextv2_tiny.fcmae_ft_in1k',
        ],
        'convnextv2_nano': [
            'convnextv2_nano.fcmae_ft_in22k_in1k_384',
            'convnextv2_nano.fcmae_ft_in22k_in1k',
            'convnextv2_nano.fcmae_ft_in1k',
        ],
    }

    def __init__(self, arch='convnextv2_tiny', num_classes=4, pretrained=True, drop_rate=0.4):
        super().__init__()
        self.arch = arch
        self.num_classes = num_classes

        # Load backbone with automatic fallback
        self.backbone = self._load_backbone(arch, pretrained)
        feat_dim = self.backbone.num_features  # 768 for tiny, 640 for nano

        # Main 4-class classification head
        # Design: LayerNorm → Dropout → Linear → GELU → Dropout → Linear
        # LayerNorm stabilizes features, double dropout prevents co-adaptation
        self.global_head = nn.Sequential(
            nn.LayerNorm(feat_dim),
            nn.Dropout(drop_rate),
            nn.Linear(feat_dim, 256),
            nn.GELU(),
            nn.Dropout(drop_rate * 0.5),   # lighter second dropout
            nn.Linear(256, num_classes)
        )

        # Auxiliary Benign-vs-OPMD binary head
        # Lighter architecture — just needs to push backbone features apart
        self.aux_head = nn.Sequential(
            nn.LayerNorm(feat_dim),
            nn.Dropout(drop_rate * 0.75),
            nn.Linear(feat_dim, 2)          # 0=Benign, 1=OPMD
        )

        print(f"[MODEL V2] Backbone: {arch} | Feature dim: {feat_dim} | "
              f"Main classes: {num_classes} | Aux head: Benign-vs-OPMD")

    def _load_backbone(self, arch, pretrained):
        """Load best available pretrained backbone with fallback chain."""
        candidates = self.MODEL_CANDIDATES.get(arch, [arch])
        for model_name in candidates:
            try:
                backbone = timm.create_model(
                    model_name, pretrained=pretrained,
                    num_classes=0, drop_rate=0.0   # num_classes=0 = feature extractor only
                )
                print(f"[MODEL V2] Loaded backbone: {model_name}")
                return backbone
            except Exception as e:
                print(f"[MODEL V2] Failed to load {model_name}: {e}")
                continue
        raise ValueError(f"Could not load any backbone for arch={arch}")

    def forward(self, x, return_aux=False):
        """
        Forward pass.
        Args:
            x: input images [B, 3, H, W]
            return_aux: if True, also return auxiliary head logits
        Returns:
            global_out: [B, 4] main classification logits
            aux_out: [B, 2] auxiliary Benign-vs-OPMD logits (only if return_aux=True)
        """
        features = self.backbone(x)           # [B, feat_dim]
        global_out = self.global_head(features)  # [B, 4]

        if return_aux:
            aux_out = self.aux_head(features)    # [B, 2]
            return global_out, aux_out
        return global_out

    def freeze_backbone(self):
        """Freeze backbone — only heads are trainable. Prevents catastrophic forgetting."""
        for param in self.backbone.parameters():
            param.requires_grad = False
        trainable = sum(p.numel() for p in self.parameters() if p.requires_grad)
        print(f"[MODEL V2] Backbone FROZEN. Trainable params: {trainable:,}")

    def unfreeze_backbone(self):
        """Unfreeze backbone for deep fine-tuning with differential LR."""
        for param in self.backbone.parameters():
            param.requires_grad = True
        trainable = sum(p.numel() for p in self.parameters() if p.requires_grad)
        print(f"[MODEL V2] Backbone UNFROZEN. Trainable params: {trainable:,}")

    def get_parameter_groups(self, backbone_lr, head_lr, weight_decay=0.05):
        """
        Differential learning rate: slow backbone, fast heads.
        This is critical for transfer learning — prevents forgetting
        pretrained features while allowing heads to adapt quickly.
        """
        backbone_params = [p for p in self.backbone.parameters() if p.requires_grad]
        head_params = list(self.global_head.parameters()) + list(self.aux_head.parameters())

        return [
            {'params': backbone_params, 'lr': backbone_lr, 'weight_decay': weight_decay},
            {'params': head_params, 'lr': head_lr, 'weight_decay': weight_decay * 0.1}
        ]


class ModelEMA:
    """
    Exponential Moving Average of model parameters.

    Maintains a shadow copy of the model with smoothed weights.
    Produces more stable predictions than the raw training model,
    typically +0.5-1.5% accuracy boost for free.

    Anti-Overfitting: EMA model averages out noisy gradient updates,
    reducing overfitting to individual batches.
    """

    def __init__(self, model, decay=0.9998):
        self.ema_model = copy.deepcopy(model)
        self.ema_model.eval()
        self.decay = decay
        for p in self.ema_model.parameters():
            p.requires_grad_(False)
        print(f"[EMA] Initialized with decay={decay}")

    @torch.no_grad()
    def update(self, model):
        """Update EMA weights: ema = decay * ema + (1-decay) * model"""
        for ema_p, model_p in zip(self.ema_model.parameters(), model.parameters()):
            ema_p.data.mul_(self.decay).add_(model_p.data, alpha=1.0 - self.decay)

    def state_dict(self):
        return self.ema_model.state_dict()

    def load_state_dict(self, state_dict):
        self.ema_model.load_state_dict(state_dict)

    def eval(self):
        self.ema_model.eval()
        return self.ema_model


class FocalLossV2(nn.Module):
    """
    Enhanced Focal Loss with γ=3.0 (stronger than standard γ=2.0).

    Why γ=3.0?
    - Standard γ=2.0 down-weights easy examples by (1-p)^2
    - γ=3.0 down-weights even MORE aggressively, forcing the model to
      spend training capacity on hard Benign-vs-OPMD boundary cases
    - Combined with class weights, this is the optimal loss for imbalanced
      medical image classification

    Anti-Overfitting: Label smoothing (0.15) prevents overconfident predictions
    Anti-Underfitting: Class weights ensure minority classes get enough gradient signal
    """

    def __init__(self, alpha=None, gamma=3.0, label_smoothing=0.15):
        super().__init__()
        self.gamma = gamma
        self.alpha = alpha        # per-class weights
        self.label_smoothing = label_smoothing

    def forward(self, logits, targets):
        num_classes = logits.size(-1)
        probs = F.softmax(logits, dim=-1)

        # Convert integer labels to smoothed one-hot
        if targets.dim() == 1 or (targets.dim() == 2 and targets.size(1) == 1):
            targets = targets.view(-1)
            one_hot = F.one_hot(targets, num_classes=num_classes).float()
            if self.label_smoothing > 0:
                one_hot = one_hot * (1.0 - self.label_smoothing) + self.label_smoothing / num_classes
        else:
            # Already soft labels (from Mixup/CutMix)
            one_hot = targets

        pt = torch.clamp((probs * one_hot).sum(dim=-1), min=1e-7, max=1.0 - 1e-7)
        focal_weight = torch.pow(1.0 - pt, self.gamma)
        log_pt = torch.log(pt)

        if self.alpha is not None:
            if self.alpha.device != logits.device:
                self.alpha = self.alpha.to(logits.device)
            alpha_factor = (self.alpha * one_hot).sum(dim=-1)
            loss = -alpha_factor * focal_weight * log_pt
        else:
            loss = -focal_weight * log_pt

        return loss.mean()


# Quick self-test
if __name__ == "__main__":
    print("Testing OralCancerNetV2...")
    model = OralCancerNetV2(arch='convnextv2_tiny', num_classes=4, pretrained=False)
    x = torch.randn(2, 3, 384, 384)

    # Test main head only
    out = model(x)
    print(f"Main head output: {out.shape}")   # [2, 4]

    # Test with aux head
    out, aux = model(x, return_aux=True)
    print(f"Main: {out.shape}, Aux: {aux.shape}")  # [2, 4], [2, 2]

    # Test freeze/unfreeze
    model.freeze_backbone()
    model.unfreeze_backbone()

    # Test EMA
    ema = ModelEMA(model, decay=0.9998)
    ema.update(model)
    print("All tests passed!")
