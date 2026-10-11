# 🔬 QAI-OLI: Hybrid Quantum-Classical Oral Oncology Diagnostic Platform
> **Official Implementation & Clinical Screening Suite**  
> *SOTA 4-Class Oral Lesion Stratification with 8-Qubit Variational Quantum Circuit (VQC) and Dual Deep Learning Backbones*

[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2016-black?logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![PyTorch](https://img.shields.io/badge/Deep%20Learning-PyTorch%202.x-EE4C2C?logo=pytorch)](https://pytorch.org/)
[![PennyLane](https://img.shields.io/badge/Quantum-PennyLane%200.35-blueviolet)](https://pennylane.ai/)
[![License](https://img.shields.io/badge/License-Academic%20Research-blue)](LICENSE)

---

## 🌟 Executive Summary

**QAI-OLI** (Quantum Artificial Intelligence for Oral Lesion Identification) is a full-stack, contactless oral oncology screening and diagnostic platform. Powered by the **Q-ConX-Dense Tri-Stage Clinical Cascade**, it couples dual classical vision backbones (**ConvNeXt-V2-Tiny** for boundary/spatial features and **DenseNet-121** for cellular morphology/vascular patterns) with a parallel **8-Qubit Variational Quantum Circuit (VQC)** running on PennyLane and a **Classical Residual Bypass Highway**.

The platform is designed for primary healthcare screeners (ASHA/PHC workers) and tertiary oral oncologists, delivering instant 4-class triage alongside real-time **Grad-CAM visual saliency heatmaps**, **Quantum Polarization Telemetry (QPS)**, and printable institutional pathology requisition slips.

---

## 📊 Key Verified Benchmarks

| Diagnostic Metric | Value | Clinical Significance |
| :--- | :--- | :--- |
| **Multi-Center 4-Class Accuracy** | **83.77%** | SOTA multi-class benchmark across 487 test cases |
| **Healthy Mucosa Specificity** | **98.40%** | Minimizes unnecessary referrals and patient anxiety |
| **Oral Carcinoma (OCA) F1-Score** | **89.40%** | Rapid detection of frank malignant squamous cell carcinoma |
| **OPMD Pre-Cancer F1-Score** | **78.60%** | Early triage for high-risk dysplasia lesions |
| **Quantum Advantage ($\Delta$ Acc)** | **+4.92%** | Demonstrable gain over classical linear bottleneck |
| **Inference Latency** | **14.8 ms** | Real-time chairside execution on standard hardware |

---

## 🏛️ System Architecture & Diagrams

Full high-resolution SVG and PNG diagrams are available in [`figures/architecture_diagrams/`](figures/architecture_diagrams/):

1. **[Model Pipeline Architecture](figures/architecture_diagrams/uml.png)** — Dual-backbone feature fusion, 8-qubit VQC ansatz, and classical residual highway.
2. **[DFD Level 0: Context Diagram](figures/architecture_diagrams/dfd_level_0.png)** — System boundary, external terminators (clinicians, oncologists, EHR/PACS), and primary data flows (DF1–DF6).
3. **[DFD Level 1: Subsystem Architecture](figures/architecture_diagrams/dfd_level_1.png)** — Hierarchical pipeline from Pre-Flight IQA to Tri-Stage Cascade, XAI, and Data Stores D1–D3.
4. **[DFD Level 2: Core AI & Quantum Decoupler](figures/architecture_diagrams/dfd_level_2.png)** — Mathematical signal trace of the 256-D Hilbert projection, Pauli-Z measurement, and soft-voting calibration.
5. **[UML Use Case Diagram](figures/architecture_diagrams/use_case.png)** — 5 operational actors, 11 use cases (UC1–UC11), and full traceability matrix.

---

## 📁 Repository Structure

```
QAI_OLI/
├── figures/
│   └── architecture_diagrams/      # Clean IEEE-standard SVG & PNG architecture diagrams
│       ├── uml.png / uml.svg
│       ├── dfd_level_0.png / .svg
│       ├── dfd_level_1.png / .svg
│       ├── dfd_level_2.png / .svg
│       └── use_case.png / .svg
│
├── models/                         # Verified model checkpoints (tracked via Git LFS)
│   ├── 01_mahanet_convnextv2_tiny.pth   (112 MB | Spatial Specialist)
│   ├── 02_mahanet_densenet121.pth       (29.5 MB | Cellular Morphology Specialist)
│   ├── 03_mahanet_quantum_8q_vqc.pth    (159 MB | 8-Qubit VQC Decider)
│   └── README.md
│
├── website/                        # Full-Stack Web Platform
│   ├── app/                        # Next.js 16 App Router (React 19, Tailwind)
│   │   ├── page.tsx                # Landing Page
│   │   ├── screening/              # Interactive AI Screening & Dual-Stream Grad-CAM
│   │   ├── research/               # Publication Benchmarks & Model Report Cards
│   │   └── api/predict/route.ts    # Secure Next.js proxy route to FastAPI backend
│   │
│   ├── backend/                    # FastAPI Inference Engine
│   │   ├── server.py               # Main API server with Tri-Stage Ensemble
│   │   ├── model_qai.py            # Hybrid PennyLane VQC + Classical Residual Net
│   │   ├── quality_gate.py         # Laplacian blur & exposure pre-flight IQA
│   │   ├── explainable_ai.py       # Grad-CAM spatial focus overlays
│   │   ├── Dockerfile              # Containerized deployment for Cloud/Hugging Face
│   │   └── requirements.txt        # Python dependencies
│   │
│   ├── package.json                # Frontend package configuration
│   └── start_all.bat               # One-click Windows launcher
│
├── reports/                        # Clinical & Statistical Validation Reports
│   └── PROJECT_MASTER_DOCUMENTATION_REPORT.md  # Comprehensive academic master report
├── .gitignore                      # Git ignore rules for node_modules, cache, etc.
└── .gitattributes                  # Git LFS tracking for .pth weights
```

---

## ⚡ Quick Start (Local Setup)

### Prerequisites
- Node.js 18+ & npm
- Python 3.10+
- Git & Git LFS

### Option A: One-Click Launch (Windows)
Double-click `website/start_all.bat`. It will start:
- FastAPI Backend on `http://127.0.0.1:8000`
- Next.js Frontend on `http://localhost:3000`

### Option B: Manual Launch
1. **Backend:**
   ```bash
   cd website/backend
   pip install -r requirements.txt
   uvicorn server:app --host 0.0.0.0 --port 8000 --reload
   ```
2. **Frontend:**
   ```bash
   cd website
   npm install
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

---

## 🚀 Cloud Deployment

### 1. Frontend on Vercel
1. Import this repository into [Vercel](https://vercel.com).
2. Set **Root Directory** to `website`.
3. Add Environment Variable:
   - `BACKEND_URL`: `https://your-backend-service.com` (or Hugging Face Space URL).
4. Click **Deploy**.

### 2. Backend on Hugging Face Spaces / Docker
1. Create a new Space on [Hugging Face](https://huggingface.co/spaces) with **Docker** SDK.
2. Push `website/backend` along with `models/` directory.
3. The server will launch via the provided `Dockerfile` with CPU-optimized PyTorch.

---

## 📄 License & Attribution
Developed for oral oncology clinical triaging and research validation.  
All experimental data, architecture models, and validation benchmarks are documented in [`PROJECT_MASTER_DOCUMENTATION_REPORT.md`](PROJECT_MASTER_DOCUMENTATION_REPORT.md).
