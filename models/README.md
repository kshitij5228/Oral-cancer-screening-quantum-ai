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

## 🔄 Multi-Stage Clinical Triage Ensemble Pipeline

1. **Stage 1: Frontline Healthy Screening Triage (98.40% Specificity)**
   - Utilizes `01_mahanet_convnextv2_tiny.pth` + `02_mahanet_densenet121.pth`
   - Purpose: High-throughput screening that reliably separates Healthy Mucosa from Pathological Lesions.

2. **Stage 2: Malignant Carcinoma Isolation (89.40% OCA F1-Score)**
   - Utilizes `02_mahanet_densenet121.pth` + `03_mahanet_quantum_8q_vqc.pth`
   - Purpose: Rapid identification of frank Oral Squamous Cell Carcinoma (OSCC).

3. **Stage 3: Dysplasia Texture Decoupling (83.77% Overall 4-Class SOTA)**
   - Utilizes `01_mahanet_convnextv2_tiny.pth` + `03_mahanet_quantum_8q_vqc.pth`
   - Purpose: Discriminating subtle morphological differences between Benign Ulcers and Pre-Malignant OPMD lesions.
