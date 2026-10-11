# QAI-OLI · Full-Stack Clinical AI Screening Platform

Modern Next.js 16 + FastAPI clinical screening web application for oral cancer and pre-malignant lesion risk stratification. Powered by the **Q-ConX-Dense Tri-Stage Clinical Triage Ensemble** (ConvNeXt-V2-Tiny + DenseNet-121 + 8-Qubit VQC).

---

## 🏗️ Architecture

- **Frontend:** Next.js 16 (App Router), React 19, Tailwind CSS, Lucide icons, Printable Pathology Requisition generation.
- **Backend:** FastAPI (Python), PyTorch, OpenCV Pre-Flight Quality Gate (IQA), Dual-Stream Grad-CAM Explainability.
- **Models:** Checkpoints loaded directly from `QAI_OLI/models/`.

---

## ⚡ Quick Start (One-Click)

Simply double-click:
- **`start_all.bat`** — Launches both FastAPI backend and Next.js frontend in separate windows.

Or launch individually:
1. **Backend:** Double-click `start_backend.bat` (runs on `http://127.0.0.1:8000`)
2. **Frontend:** Double-click `start_frontend.bat` (runs on `http://localhost:3000`)

---

## 🩺 Endpoints

- `GET /` — Engine status and version info.
- `GET /health` — Checkpoint verification and quantum telemetry status.
- `POST /api/predict` — Image quality gate validation, multi-backbone classification, quantum polarization score, and Grad-CAM heatmap generation.

---

## 📊 Verified SOTA Performance
- **4-Class Multi-Center Test Accuracy:** 83.77%
- **Healthy Mucosa Screening Specificity:** 98.40%
- **Oral Carcinoma (OCA) Sensitivity F1:** 89.40%
- **Macro F1-Score:** 82.90%
- **False Negative Rate (FNR):** < 5.13%
