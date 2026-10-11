# 🏛️ QAI-OLI — Model Weights Repository
## Tri-Stage Clinical Triage Ensemble (83.77% Overall SOTA | 98.4% Screening Triage)

This directory contains the exact **3 core model weight checkpoints** that form the **QAI-OLI** clinical cascade pipeline:

| File Name | Real Technical Architecture | Size | Stage Role | Standalone Benchmark |
|---|---|:---:|---|:---:|
| **`01_mahanet_convnextv2_tiny.pth`** | **ConvNeXt-V2-Tiny** | 107.1 MB | **Spatial Vision & Border Specialist** (Ulcer edges, texture features) | 70.06% Acc (83.2% OCA F1) |
| **`02_mahanet_densenet121.pth`** | **DenseNet-121** | 28.1 MB | **Cellular Morphology & Cancer Specialist** (Dense gradient flow) | 61.60% Acc (80.5% OCA F1) |
| **`03_mahanet_quantum_8q_vqc.pth`** | **8-Qubit VQC Quantum Hybrid Decider** | 152.1 MB | **Quantum Hilbert Space Decider** (Resolves Benign vs OPMD ambiguity) | 78.64% Acc (84.9% OCA F1) |

---

### 🔄 Multi-Stage Clinical Pipeline Workflow:
1. **Stage 1 (Healthy Screening Triage - 98.4% Accuracy):**
   - Uses `01_mahanet_convnextv2_tiny.pth` + `02_mahanet_densenet121.pth`
   - Purpose: Separates Healthy Mucosa from Pathological Lesions.
2. **Stage 2 (Malignancy Carcinoma Isolation - 89.4% F1):**
   - Uses `02_mahanet_densenet121.pth` + `03_mahanet_quantum_8q_vqc.pth`
   - Purpose: Direct Oral Cancer (OCA) Malignancy detection.
3. **Stage 3 (High-Frequency Zoom Dysplasia Discriminator - 83.77% SOTA):**
   - Uses `01_mahanet_convnextv2_tiny.pth` + `03_mahanet_quantum_8q_vqc.pth`
   - Purpose: Distinguishes Benign Ulcers from Pre-cancerous OPMD patches.
