# 🏛️ QAI-OLI: Model Checkpoints & Access Policy
**Tri-Stage Quantum-Classical Oral Oncology Cascade (83.77% SOTA | 98.40% Screening Triage)**

---

## 🔐 Model Weights Access Policy

To prevent unauthorized distribution and uphold clinical data governance, the trained PyTorch model checkpoints (`.pth` binary weight files) are **not hosted publicly** in this GitHub repository.

### 📧 How to Request Model Checkpoints:
If you are an academic researcher, clinical practitioner, or institutional collaborator seeking model weights for validation or benchmark reproduction, please contact the primary developer:

- **Contact Person:** Kshitij Nakod
- **Email:** [`nakod.kshitij5228@gmail.com`](mailto:nakod.kshitij5228@gmail.com)
- **Email Subject:** `[QAI-OLI] Model Weights Access Request`
- **Please include:** Your full name, affiliated institution/university, and intended research/clinical use case.

---

## 📁 Required Checkpoint Files

Once access is granted, download and place the three `.pth` checkpoint files directly into this `models/` directory:

| Filename | Architecture | Size | Specialized Clinical Role | Standalone Benchmark |
|---|---|:---:|---|:---:|
| `01_mahanet_convnextv2_tiny.pth` | **ConvNeXt-V2-Tiny** | 107.1 MB | **Spatial Vision & Border Specialist** (Captures irregular ulcer edges and macroscopic lesion margins) | 70.06% Acc (83.2% OCA F1) |
| `02_mahanet_densenet121.pth` | **DenseNet-121** | 28.1 MB | **Cellular Morphology & Malignancy Specialist** (Dense gradient flow for epithelial atypia and vascular patterns) | 61.60% Acc (80.5% OCA F1) |
| `03_mahanet_quantum_8q_vqc.pth` | **8-Qubit Parameterized VQC Hybrid** | 152.1 MB | **Quantum Hilbert Space Decider** (PennyLane 256-D state rotation resolving Benign vs. OPMD ambiguity) | 78.64% Acc (84.9% OCA F1) |

---

## 🔄 Parallel Tri-Stream Clinical Ensemble Pipeline (`server.py`)

At inference time, the system executes all three model streams **simultaneously in parallel**, combining their calibrated softmax predictions via weighted soft-voting to produce a unified 4-class diagnosis:

1. **Stream 1 (Stage 1): ConvNeXt-V2-Tiny (`01_mahanet_convnextv2_tiny.pth`) — Weight: 25%**
   - **Role:** Extracts macro lesion contours, irregular borders, and structural shape representations (70.06% Standalone Acc).

2. **Stream 2 (Stage 2): DenseNet-121 (`02_mahanet_densenet121.pth`) — Weight: 25%**
   - **Role:** Captures fine epithelial micro-vascular patterns and cellular atypia via dense iterative feature reuse (61.60% Standalone Acc).

3. **Stream 3 (Stage 3): 8-Qubit Parameterized VQC Hybrid (`03_mahanet_quantum_8q_vqc.pth`) — Weight: 50%**
   - **Role:** Projects deep latent features into a 256-D quantum Hilbert space via parameterized AngleEmbedding + Entangling layers, with a 64-D classical skip highway (78.64% Standalone Acc).

### 🎯 Consensus Soft-Voting Formulation:
$$\mathbf{P}_{\text{fused}} = 0.25 \cdot \mathbf{P}_{\text{M1}} + 0.25 \cdot \mathbf{P}_{\text{M2}} + 0.50 \cdot \mathbf{P}_{\text{M3}}$$

### 🏥 Multi-Tier Clinical Validation:
- **Healthy Screening Triage:** 98.40% Specificity (near-zero false alarms)
- **Malignant Carcinoma Isolation:** 89.40% OCA F1-Score (90.43% Sensitivity / Recall)
- **Benign vs OPMD Dysplasia Decoupling:** 83.77% Discrimination Accuracy (resolves tissue mimicry)

