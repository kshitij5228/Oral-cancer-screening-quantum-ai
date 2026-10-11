import torch
import torch.nn as nn
import torch.nn.functional as F
import torchvision.models as models

class MultiClassFocalLoss(nn.Module):
    """
    Multi-Class Focal Loss with Class-Weighting and Label Smoothing.
    Focuses training on hard, ambiguous examples (e.g. Benign vs OPMD)
    while downweighting easily classified healthy mucosa.
    Supports both hard integer labels and soft one-hot labels (from Mixup/CutMix).
    """
    def __init__(self, alpha=None, gamma=2.0, label_smoothing=0.1):
        super().__init__()
        self.gamma = gamma
        self.alpha = alpha
        self.label_smoothing = label_smoothing

    def forward(self, logits, targets):
        num_classes = logits.size(-1)
        probs = F.softmax(logits, dim=-1)

        # Convert targets to smooth one-hot distribution if integers
        if targets.dim() == 1 or (targets.dim() == 2 and targets.size(1) == 1):
            targets = targets.view(-1)
            one_hot = F.one_hot(targets, num_classes=num_classes).float()
            if self.label_smoothing > 0:
                one_hot = one_hot * (1.0 - self.label_smoothing) + self.label_smoothing / num_classes
        else:
            one_hot = targets

        pt = torch.clamp((probs * one_hot).sum(dim=-1), min=1e-7, max=1.0 - 1e-7)
        log_pt = torch.log(pt)
        focal_weight = torch.pow(1.0 - pt, self.gamma)

        if self.alpha is not None:
            if self.alpha.device != logits.device:
                self.alpha = self.alpha.to(logits.device)
            alpha_factor = (self.alpha * one_hot).sum(dim=-1)
            loss = -alpha_factor * focal_weight * log_pt
        else:
            loss = -focal_weight * log_pt

        return loss.mean()

class OralCancerNet(nn.Module):
    """
    Modular Medical Vision Architecture supporting ConvNeXt-Tiny,
    EfficientNet-B3, and Swin-T with customized LayerNorm & Dropout heads.
    """
    def __init__(self, arch="convnext_tiny", num_classes=4, pretrained=True, dropout=0.35):
        super().__init__()
        self.arch = arch.lower()
        self.num_classes = num_classes

        if self.arch == "convnext_tiny":
            weights = models.ConvNeXt_Tiny_Weights.DEFAULT if pretrained else None
            base = models.convnext_tiny(weights=weights)
            # ConvNeXt features output 768 channels
            in_features = base.classifier[2].in_features
            # Replace classifier with custom medical diagnosis head
            base.classifier[2] = nn.Sequential(
                nn.Linear(in_features, 512),
                nn.LayerNorm(512),
                nn.GELU(),
                nn.Dropout(dropout),
                nn.Linear(512, num_classes)
            )
            self.model = base
            self.backbone = base.features

        elif self.arch == "convnext_small":
            weights = models.ConvNeXt_Small_Weights.DEFAULT if pretrained else None
            base = models.convnext_small(weights=weights)
            in_features = base.classifier[2].in_features  # 768
            base.classifier[2] = nn.Sequential(
                nn.Linear(in_features, 512),
                nn.LayerNorm(512),
                nn.GELU(),
                nn.Dropout(dropout),
                nn.Linear(512, num_classes)
            )
            self.model = base
            self.backbone = base.features

        elif self.arch == "efficientnet_b3":
            weights = models.EfficientNet_B3_Weights.DEFAULT if pretrained else None
            base = models.efficientnet_b3(weights=weights)
            in_features = base.classifier[1].in_features
            base.classifier = nn.Sequential(
                nn.Dropout(dropout),
                nn.Linear(in_features, 512),
                nn.LayerNorm(512),
                nn.GELU(),
                nn.Dropout(dropout * 0.7),
                nn.Linear(512, num_classes)
            )
            self.model = base
            self.backbone = base.features

        elif self.arch == "swin_t":
            weights = models.Swin_T_Weights.DEFAULT if pretrained else None
            base = models.swin_t(weights=weights)
            in_features = base.head.in_features
            base.head = nn.Sequential(
                nn.Linear(in_features, 512),
                nn.LayerNorm(512),
                nn.GELU(),
                nn.Dropout(dropout),
                nn.Linear(512, num_classes)
            )
            self.model = base
            self.backbone = base.features
        else:
            raise ValueError(f"Unsupported architecture: {arch}")

    def forward(self, x):
        return self.model(x)

    def freeze_backbone(self):
        for param in self.backbone.parameters():
            param.requires_grad = False
        print(f"[{self.arch.upper()}] Backbone frozen. Only classifier head is trainable.")

    def unfreeze_backbone(self):
        for param in self.backbone.parameters():
            param.requires_grad = True
        print(f"[{self.arch.upper()}] Backbone un-frozen for deep fine-tuning.")

    def get_parameter_groups(self, backbone_lr=1e-5, head_lr=1e-4, weight_decay=1e-2):
        backbone_params = []
        head_params = []

        if self.arch in ["convnext_tiny", "convnext_small"]:
            head_modules = [self.model.classifier[2]]
        elif self.arch == "efficientnet_b3":
            head_modules = [self.model.classifier]
        elif self.arch == "swin_t":
            head_modules = [self.model.head]
        else:
            head_modules = []

        head_param_ids = set()
        for mod in head_modules:
            for p in mod.parameters():
                head_param_ids.add(id(p))
                head_params.append(p)

        for p in self.model.parameters():
            if id(p) not in head_param_ids and p.requires_grad:
                backbone_params.append(p)

        return [
            {"params": backbone_params, "lr": backbone_lr, "weight_decay": weight_decay},
            {"params": head_params, "lr": head_lr, "weight_decay": weight_decay * 0.1}
        ]

def get_model(arch="convnext_tiny", num_classes=4, pretrained=True, dropout=0.35):
    return OralCancerNet(arch=arch, num_classes=num_classes, pretrained=pretrained, dropout=dropout)

if __name__ == "__main__":
    m = get_model("convnext_tiny", num_classes=4)
    x = torch.randn(2, 3, 384, 384)
    y = m(x)
    print(f"Model test forward success! Output shape: {y.shape}")
