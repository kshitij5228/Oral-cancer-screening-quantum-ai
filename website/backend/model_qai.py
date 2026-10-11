"""
model_qai.py  --  TRINETRA-QAI: Hybrid Quantum-Classical Oral Cancer Classifier
=================================================================================

ARCHITECTURE OVERVIEW
---------------------
Classical Backbone Extraction (FROZEN during Q1):
  ConvNeXt-V2 Tiny  (384px)  -->  768-dim pooled features   [VERIFIED]
  EfficientNet-B3   (300px)  -->  1536-dim pooled features  [VERIFIED]

Feature Projection (NEW, trainable):
  conv_proj  : Linear(768  -> 128, bias=False) + BatchNorm1d(128) + ReLU
  eff_proj   : Linear(1536 -> 128, bias=False) + BatchNorm1d(128) + ReLU
  fused_feat : torch.cat([conv_proj, eff_proj])  -->  256-dim

Quantum Path (NEW, trainable):
  quantum_encoder : Linear(256 -> n_qubits, bias=False) + Tanh()
                    maps features to angles in (-pi, pi)
  VQC             : AngleEmbedding (RY) + StronglyEntanglingLayers
                    n_qubits=8 (primary) / 4 (ablation)
                    n_layers=3
                    output: [expval(Z_i)] for each qubit  -->  n_qubits-dim in (-1,1)

Classical Path (NEW, trainable):
  classical_branch: Linear(256->64) + LayerNorm(64) + ReLU + Dropout(0.3)

Fusion & Classifier (NEW, trainable):
  fusion    : torch.cat([vqc_out, classical_out])  -->  (n_qubits + 64)-dim
  classifier: Linear((n_qubits+64) -> 4)  --  raw logits, no activation

ABLATION MODELS (all share same class, controlled by n_qubits and use_quantum flags):
  Model A: Existing TRINETRA  (separate evaluate_final_system.py -- DO NOT CHANGE)
  Model B: Classical-8D       (n_qubits=8, use_quantum=False)  -- linear bottleneck
  Model C: Classical-8D-MLP   (n_qubits=8, use_quantum=False, mlp_bottleneck=True)
  Model D: QAI-4q             (n_qubits=4, use_quantum=True)
  Model E: QAI-8q PRIMARY     (n_qubits=8, use_quantum=True)   <-- main model
  Model F: QAI-8q-deep        (n_qubits=8, use_quantum=True, n_layers=5)

VQC INITIALIZATION NOTE:
  We do NOT use uniform(-pi, pi).
  Reason: Uniform large angles cause barren plateaus early in training --
  gradient landscape becomes flat when random circuit approaches a 2-design.
  (McClean et al., "Barren plateaus in quantum neural network training", 2018)
  We use: normal(mean=0, std=0.1) -- small random initialization.
  This keeps the initial circuit close to identity-like behaviour,
  ensuring non-vanishing gradients at the start of training.

QPS (Quantum Polarization Score):
  QPS = mean(|<Z_i>|) over all qubits  in [0, 1]
  This is an INTERPRETABILITY metric only.
  It is NOT classification confidence, NOT diagnostic certainty.

EfficientNet-B3 Feature Extraction:
  OralCancerNet (model_advanced.py) wraps the full model including custom head.
  We register a forward hook on classifier[0] (Dropout layer) to capture
  the 1536-dim pooled features BEFORE the custom head, so weights loaded
  from best_efficientnet_b3.pth work correctly without modification.

Verified dims (run verify_feature_dims.py):
  ConvNeXt-V2  backbone(x) --> (B, 768)
  EfficientNet-B3  pre-clf --> (B, 1536)
"""

import sys
import numpy as np
import torch
import torch.nn as nn
import torch.nn.functional as F
import pennylane as qml

import os

_CURR_DIR = os.path.dirname(os.path.abspath(__file__))
if _CURR_DIR not in sys.path:
    sys.path.insert(0, _CURR_DIR)

from model_v2 import OralCancerNetV2
from model_advanced import get_model as get_eff_model

# =========================================================================
# VERIFIED DIMENSIONS (do not change without re-running verify_feature_dims.py)
# =========================================================================
CONV_DIM = 768    # ConvNeXt-V2 Tiny backbone output
EFF_DIM  = 1536   # EfficientNet-B3 pre-classifier pooled features
PROJ_DIM = 128    # each backbone projected to this dim
FUSED_DIM = PROJ_DIM * 2   # 256 -- concat of two projections
CLF_CLASSICAL_DIM = 64     # classical branch output


# =========================================================================
# Quantum Circuit Definition
# =========================================================================

def build_qnode(n_qubits: int, n_layers: int):
    """
    Build a PennyLane QNode for the VQC.

    Args:
        n_qubits: number of qubits (4 or 8)
        n_layers: number of StronglyEntanglingLayers (typically 3)

    Returns:
        qnode: a callable QNode compatible with PyTorch autograd (backprop)
        weight_shape: tuple, shape of the VQC parameter tensor
    """
    dev = qml.device("default.qubit", wires=n_qubits)

    @qml.qnode(dev, interface="torch", diff_method="backprop")
    def circuit(inputs, weights):
        # Angle embedding: RY rotations encode classical features as qubit angles
        # inputs are already in (-pi, pi) via Tanh * pi scaling
        qml.AngleEmbedding(inputs, wires=range(n_qubits), rotation="Y")
        # Parameterized entangling layers
        qml.StronglyEntanglingLayers(weights, wires=range(n_qubits))
        # Measure expectation value of PauliZ on each qubit -> n_qubits values in (-1, 1)
        return [qml.expval(qml.PauliZ(i)) for i in range(n_qubits)]

    weight_shape = qml.StronglyEntanglingLayers.shape(
        n_layers=n_layers, n_wires=n_qubits
    )
    return circuit, weight_shape


# =========================================================================
# Main Model Class
# =========================================================================

class TRINETRAQAINet(nn.Module):
    """
    TRINETRA-QAI: Hybrid Quantum-Classical Oral Cancer Classifier.

    Controls both quantum (Model D/E/F) and classical ablation (Model B/C)
    via flags. This ensures identical training/eval code paths for fair comparison.

    Args:
        n_qubits     : int, qubits in VQC (4 or 8)
        n_vqc_layers : int, depth of StronglyEntanglingLayers (3 or 5)
        use_quantum  : bool, True = VQC path; False = classical bottleneck (ablation)
        mlp_bottleneck: bool, if use_quantum=False, add 2nd MLP layer in bottleneck
        pretrained_conv_path : str or None, path to best_v2.pth
        pretrained_eff_path  : str or None, path to best_efficientnet_b3.pth
        num_classes  : int, output classes (default 4)
        seed         : int, reproducibility seed
    """

    def __init__(
        self,
        n_qubits: int = 8,
        n_vqc_layers: int = 3,
        use_quantum: bool = True,
        mlp_bottleneck: bool = False,
        pretrained_conv_path: str = None,
        pretrained_eff_path: str = None,
        num_classes: int = 4,
        seed: int = 42,
    ):
        super().__init__()

        self.n_qubits = n_qubits
        self.n_vqc_layers = n_vqc_layers
        self.use_quantum = use_quantum
        self.mlp_bottleneck = mlp_bottleneck
        self.num_classes = num_classes
        self.seed = seed

        # ---- ARCH LABEL for logging ----
        if use_quantum:
            self.arch_label = f"QAI-{n_qubits}q-depth{n_vqc_layers}"
        elif mlp_bottleneck:
            self.arch_label = f"Classical-{n_qubits}D-MLP"
        else:
            self.arch_label = f"Classical-{n_qubits}D"

        # ---- Reproducibility ----
        torch.manual_seed(seed)
        np.random.seed(seed)

        # ================================================================
        # CLASSICAL BACKBONES (loaded from TRINETRA checkpoints)
        # ================================================================

        # ConvNeXt-V2 Tiny (timm, num_classes=0 => feature extractor)
        self.conv_backbone = OralCancerNetV2(
            arch="convnextv2_tiny", num_classes=4, pretrained=False
        ).backbone   # just the backbone, not the head

        # EfficientNet-B3 (full OralCancerNet wrapper)
        self._eff_full = get_eff_model("efficientnet_b3", num_classes=4, pretrained=False)
        # Hook storage for pre-classifier features
        self._eff_features_buf = None
        self._eff_hook = self._eff_full.model.classifier[0].register_forward_hook(
            self._eff_hook_fn
        )

        # Load pretrained weights
        device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        if pretrained_conv_path:
            state = torch.load(pretrained_conv_path, map_location="cpu", weights_only=True)
            # state_dict from best_v2.pth was saved from OralCancerNetV2 (full model)
            # We only need the backbone part
            backbone_state = {
                k.replace("backbone.", ""): v
                for k, v in state.items() if k.startswith("backbone.")
            }
            missing, unexpected = self.conv_backbone.load_state_dict(backbone_state, strict=False)
            print(f"[QAI] ConvNeXt-V2 backbone loaded: missing={len(missing)}, unexpected={len(unexpected)}")
        else:
            print("[QAI] ConvNeXt-V2 backbone: random init (no checkpoint)")

        if pretrained_eff_path:
            state = torch.load(pretrained_eff_path, map_location="cpu", weights_only=True)
            missing, unexpected = self._eff_full.load_state_dict(state, strict=False)
            print(f"[QAI] EfficientNet-B3 loaded: missing={len(missing)}, unexpected={len(unexpected)}")
        else:
            print("[QAI] EfficientNet-B3: random init (no checkpoint)")

        # ================================================================
        # FEATURE PROJECTION (NEW -- clearly separate from TRINETRA baseline)
        # ================================================================
        # Projects each backbone's features to equal-dim representation.
        # This prevents EfficientNet (1536) from dominating ConvNeXt (768).
        # bias=False because BatchNorm handles bias implicitly.

        self.conv_proj = nn.Sequential(
            nn.Linear(CONV_DIM, PROJ_DIM, bias=False),
            nn.BatchNorm1d(PROJ_DIM),
            nn.ReLU(inplace=True),
        )
        self.eff_proj = nn.Sequential(
            nn.Linear(EFF_DIM, PROJ_DIM, bias=False),
            nn.BatchNorm1d(PROJ_DIM),
            nn.ReLU(inplace=True),
        )
        # After concat: FUSED_DIM = 256

        # ================================================================
        # QUANTUM PATH
        # ================================================================
        if use_quantum:
            # Maps 256-dim fused features -> n_qubits angles in (-pi, pi)
            self.quantum_encoder = nn.Sequential(
                nn.Linear(FUSED_DIM, n_qubits, bias=False),
                nn.Tanh(),   # output in (-1, 1); will be scaled by pi in forward()
            )

            # Build VQC
            self.qnode, weight_shape = build_qnode(n_qubits, n_vqc_layers)

            # VQC trainable parameters stored as nn.Parameter
            # INITIALIZATION: Normal(0, 0.1) to avoid barren plateaus.
            # (McClean et al. 2018: large random inits cause exponentially vanishing gradients)
            torch.manual_seed(seed)
            self.vqc_weights = nn.Parameter(
                torch.empty(weight_shape).normal_(mean=0.0, std=0.1)
            )
            vqc_param_count = self.vqc_weights.numel()
            print(f"[QAI] VQC: {n_qubits} qubits, {n_vqc_layers} layers, "
                  f"{vqc_param_count} trainable params "
                  f"(shape {weight_shape})")

        else:
            # ====== ABLATION: Classical Bottleneck (Models B and C) ======
            # Replaces VQC with an equivalent-sized classical linear bottleneck.
            # Fair comparison: same input (256-dim), same bottleneck width (n_qubits),
            # same output fed to fusion. The ONLY difference is quantum vs classical.
            if mlp_bottleneck:
                # Model C: 2-layer MLP bottleneck
                self.classical_bottleneck = nn.Sequential(
                    nn.Linear(FUSED_DIM, n_qubits, bias=False),
                    nn.ReLU(inplace=True),
                    nn.Linear(n_qubits, n_qubits, bias=False),
                    nn.Tanh(),
                )
            else:
                # Model B: simple linear bottleneck
                self.classical_bottleneck = nn.Sequential(
                    nn.Linear(FUSED_DIM, n_qubits, bias=False),
                    nn.ReLU(inplace=True),
                )
            print(f"[QAI] Classical bottleneck ({self.arch_label}): "
                  f"{FUSED_DIM} -> {n_qubits}")

        # ================================================================
        # CLASSICAL BRANCH (parallel to quantum path, always present)
        # ================================================================
        self.classical_branch = nn.Sequential(
            nn.Linear(FUSED_DIM, CLF_CLASSICAL_DIM),
            nn.LayerNorm(CLF_CLASSICAL_DIM),
            nn.ReLU(inplace=True),
            nn.Dropout(0.3),
        )

        # ================================================================
        # FUSION + FINAL CLASSIFIER
        # ================================================================
        # fusion_dim = n_qubits (from VQC or bottleneck) + CLF_CLASSICAL_DIM (64)
        fusion_dim = n_qubits + CLF_CLASSICAL_DIM

        self.classifier = nn.Linear(fusion_dim, num_classes)

        total_params = sum(p.numel() for p in self.parameters())
        trainable_params = sum(p.numel() for p in self.parameters() if p.requires_grad)
        print(f"[QAI] {self.arch_label}: total params={total_params:,}, "
              f"trainable={trainable_params:,}")

    # ------------------------------------------------------------------
    # EfficientNet forward hook
    # ------------------------------------------------------------------
    def _eff_hook_fn(self, module, inp, out):
        """Captures pre-classifier (1536-dim) features from EfficientNet-B3."""
        self._eff_features_buf = inp[0]   # inp is a tuple, [0] is the tensor

    # ------------------------------------------------------------------
    # Feature extraction helpers
    # ------------------------------------------------------------------
    def _extract_conv_features(self, x_384):
        """ConvNeXt-V2: direct backbone call returns pooled (B, 768) features."""
        return self.conv_backbone(x_384)   # (B, CONV_DIM)

    def _extract_eff_features(self, x_300):
        """EfficientNet-B3: run full model, hook captures (B, 1536) pre-clf features."""
        self._eff_features_buf = None
        _ = self._eff_full(x_300)         # triggers hook
        assert self._eff_features_buf is not None, "EfficientNet hook failed to fire"
        return self._eff_features_buf      # (B, EFF_DIM)

    # ------------------------------------------------------------------
    # Freeze / Unfreeze helpers
    # ------------------------------------------------------------------
    def freeze_backbones(self):
        """Stage Q1: freeze both pretrained backbones."""
        for p in self.conv_backbone.parameters():
            p.requires_grad = False
        for p in self._eff_full.parameters():
            p.requires_grad = False
        trainable = sum(p.numel() for p in self.parameters() if p.requires_grad)
        print(f"[QAI] Backbones FROZEN. Trainable params: {trainable:,}")

    def unfreeze_last_stages(self, conv_last_n: int = 2, eff_last_n: int = 2):
        """
        Stage Q2: unfreeze only the last N stages of ConvNeXt-V2
        and last N blocks of EfficientNet-B3.
        """
        # Freeze both backbones first to ensure early stages stay frozen
        for p in self.conv_backbone.parameters():
            p.requires_grad = False
        for p in self._eff_full.parameters():
            p.requires_grad = False

        # ConvNeXt-V2 stages: backbone.stages[0..3]
        stages = list(self.conv_backbone.stages.children())
        for stage in stages[-conv_last_n:]:
            for p in stage.parameters():
                p.requires_grad = True

        # EfficientNet-B3 blocks: _eff_full.model.features[-eff_last_n:]
        features = list(self._eff_full.model.features.children())
        for block in features[-eff_last_n:]:
            for p in block.parameters():
                p.requires_grad = True

        trainable = sum(p.numel() for p in self.parameters() if p.requires_grad)
        print(f"[QAI] Last {conv_last_n} ConvNeXt stages + "
              f"last {eff_last_n} EfficientNet blocks UNFROZEN. "
              f"Trainable params: {trainable:,}")

    def unfreeze_all(self):
        """Stage Q3: unfreeze everything."""
        for p in self.parameters():
            p.requires_grad = True
        trainable = sum(p.numel() for p in self.parameters() if p.requires_grad)
        print(f"[QAI] All params UNFROZEN. Trainable params: {trainable:,}")

    # ------------------------------------------------------------------
    # Device management for VQC
    # ------------------------------------------------------------------
    def to(self, *args, **kwargs):
        """
        Override to() to keep vqc_weights pinned on CPU.

        PennyLane's default.qubit simulator always executes on CPU.
        Moving vqc_weights to CUDA would cause a device mismatch error
        inside the quantum circuit. All other parameters follow normal
        device placement. Gradients still flow correctly: PyTorch autograd
        tracks the .cpu() / .to(device) ops in the forward pass.
        """
        if self.use_quantum:
            vqc_data = self.vqc_weights.data.clone()   # save on CPU
            super().to(*args, **kwargs)
            # Restore vqc_weights to CPU regardless of target device
            with torch.no_grad():
                self.vqc_weights.data = vqc_data.cpu()
        else:
            super().to(*args, **kwargs)
        return self

    def cuda(self, device=None):
        """cuda() also must not move vqc_weights off CPU."""
        return self.to(torch.device('cuda' if device is None else f'cuda:{device}'))

    # ------------------------------------------------------------------
    # Forward pass
    # ------------------------------------------------------------------
    def forward(self, x_384, x_300):
        """
        Args:
            x_384 : (B, 3, 384, 384) -- for ConvNeXt-V2
            x_300 : (B, 3, 300, 300) -- for EfficientNet-B3
        Returns:
            logits : (B, 4) -- raw classification logits
            extras : dict with {
                'vqc_response'  : (B, n_qubits) -- VQC or bottleneck output
                'qps'           : (B,) -- Quantum Polarization Score (interpretability only)
                'fused_feat'    : (B, 256) -- fused projected features
            }
        """
        # ---- Backbone feature extraction ----
        conv_feat = self._extract_conv_features(x_384)   # (B, 768)
        eff_feat  = self._extract_eff_features(x_300)    # (B, 1536)

        # ---- Projection ----
        conv_proj = self.conv_proj(conv_feat)    # (B, 128)
        eff_proj  = self.eff_proj(eff_feat)      # (B, 128)
        fused     = torch.cat([conv_proj, eff_proj], dim=1)  # (B, 256)

        # ---- Quantum or Classical bottleneck path ----
        if self.use_quantum:
            # Encode to angles on GPU, then move to CPU for PennyLane
            angles_gpu = self.quantum_encoder(fused) * torch.pi  # (B, n_qubits)
            angles_cpu = angles_gpu.cpu()   # PennyLane default.qubit requires CPU
            # vqc_weights is always on CPU (enforced by to() override above)
            # VQC: process each sample independently (qnode is not batched natively)
            vqc_out_list = []
            for i in range(angles_cpu.shape[0]):
                exp_vals = self.qnode(angles_cpu[i], self.vqc_weights)  # CPU tensors
                vqc_out_list.append(torch.stack(exp_vals))
            # PennyLane default.qubit returns float64; cast to float32 to match model dtype
            # then move back to original device (GPU if available)
            vqc_response = torch.stack(vqc_out_list).float().to(fused.device)  # (B, n_qubits)
        else:
            vqc_response = self.classical_bottleneck(fused)   # (B, n_qubits)

        # ---- Classical branch ----
        classical_out = self.classical_branch(fused)   # (B, 64)

        # ---- Fusion ----
        fusion = torch.cat([vqc_response, classical_out], dim=1)  # (B, n_qubits+64)

        # ---- Classifier ----
        logits = self.classifier(fusion)   # (B, 4)

        # ---- Extras (for interpretability / demo) ----
        if self.use_quantum:
            # QPS: mean(|<Z_i>|) -- interpretability only, not classification confidence
            qps = vqc_response.abs().mean(dim=1)   # (B,)
        else:
            qps = torch.zeros(vqc_response.shape[0], device=vqc_response.device)

        extras = {
            "vqc_response": vqc_response.detach(),   # (B, n_qubits)
            "qps":          qps.detach(),             # (B,) -- interpretability only
            "fused_feat":   fused.detach(),           # (B, 256)
        }

        return logits, extras

    def __del__(self):
        """Remove hook when model is deleted."""
        try:
            self._eff_hook.remove()
        except Exception:
            pass


# =========================================================================
# Factory functions (for clean instantiation in train/eval scripts)
# =========================================================================

def get_qai_model(variant: str = "QAI-8q", seed: int = 42, **kwargs) -> TRINETRAQAINet:
    """
    Factory function. Variants match ablation study design:
        "Classical-8D"      -> Model B
        "Classical-8D-MLP"  -> Model C
        "QAI-4q"            -> Model D
        "QAI-8q"            -> Model E (primary)
        "QAI-8q-deep"       -> Model F
    """
    configs = {
        "Classical-8D":     dict(n_qubits=8, n_vqc_layers=3, use_quantum=False, mlp_bottleneck=False),
        "Classical-8D-MLP": dict(n_qubits=8, n_vqc_layers=3, use_quantum=False, mlp_bottleneck=True),
        "QAI-4q":           dict(n_qubits=4, n_vqc_layers=3, use_quantum=True),
        "QAI-8q":           dict(n_qubits=8, n_vqc_layers=3, use_quantum=True),
        "QAI-8q-deep":      dict(n_qubits=8, n_vqc_layers=5, use_quantum=True),
    }
    if variant not in configs:
        raise ValueError(f"Unknown variant '{variant}'. Choose from: {list(configs.keys())}")
    cfg = {**configs[variant], **kwargs}
    return TRINETRAQAINet(seed=seed, **cfg)


