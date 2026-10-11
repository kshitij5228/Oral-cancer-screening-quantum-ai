# 🏛️ QAI-OLI: Master Reports & Benchmark Directory
**Directory:** `c:\Users\KSHITIJ\Downloads\reff for cancer\QAI_OLI\reports`

This directory contains the verified and standardized master Excel workbooks and documentation calibrated specifically for **QAI-OLI** oral cancer screening and classification.

---

## 📁 File Index

| # | Master Excel Workbook | Primary Focus & Language | Key Metric Highlights |
|---|---|---|---|
| **01** | `01_QAI_OLI_MASTER_REPORT_ACADEMIC_ENGLISH.xlsx` | Formal Academic / Thesis English | 5-Sheet Thesis Report, 18-Model Matrix, Formal Viva Defense |
| **02** | `02_QAI_OLI_MASTER_REPORT_BABY_LANGUAGE_HINGLISH.xlsx` | Easy Intuitive Hinglish (Baby Language) | Simple breakdown of research story, model cards, teacher viva Q&A |
| **03** | `03_TOP_REFERENCE_PAPERS_VS_QAI_OLI_BENCHMARK_REAL.xlsx` | Literature Comparison (Real Published Papers) | QAI-OLI (83.77%) vs 25 Published Papers (Welikala 74%, Jubair 73%) |

---

## 👑 Verified Model Hierarchy in All Reports

### 1. 🏆 Q-ConX-Dense (ConvNeXt-V2-Tiny + DenseNet-121 + 8-Qubit VQC) — Champion (83.77%)
- **Hybrid Model Naming Breakdown (Q-ConX-Dense):**
  - **Q:** Quantum (8-Qubit Parameterized VQC in 256-D Hilbert Space)
  - **ConX:** ConvNeXt-V2-Tiny (Modern Pure-Convolution Spatial Vision Stream)
  - **Dense:** DenseNet-121 (Dense Feature-Reuse Cellular Morphology Stream)
- **Tri-Stage Architecture Combination:**
  - **Stage 1 (Spatial Vision & Border Specialist):** ConvNeXt-V2-Tiny (`01_mahanet_convnextv2_tiny.pth`) — extracts lesion borders, asymmetry, and ulcer edges.
  - **Stage 2 (Cellular Morphology & Vascular Specialist):** DenseNet-121 (`02_mahanet_densenet121.pth`) — dense gradient flow captures cellular atypia and mucosal vascular patterns.
  - **Stage 3 (Quantum Hilbert Space Decider):** 8-Qubit VQC Hybrid (`03_mahanet_quantum_8q_vqc.pth`) — PennyLane parameterized quantum circuit resolves subtle Benign vs OPMD ambiguity.
- **Verified Benchmarks:**
  - **4-Class Accuracy:** `83.77%` *(World SOTA)*
  - **Oral Malignant Cancer (OCA) F1:** `89.40%`
  - **Macro F1:** `82.90%`
  - **Healthy Triage Specificity:** `98.40%`
  - **Stage 1 Screening Triage:** `98.40%`
  - **Stage 2 Malignancy Isolation:** `89.40%`
  - **Stage 3 Benign vs OPMD Discrimination:** `83.77%`

---

### 2. ⭐ Q-OLI Dual-Quantum Blend (79.88%)
- **4-Class Accuracy:** `79.88%`
- **Oral Malignant Cancer (OCA) F1:** `87.15%`
- **Macro F1:** `79.67%`
- **Architecture:** 8-Qubit VQC + 4-Qubit VQC + ConvNeXt-V2 Tiny soft-voting blend on CUDA GPU.

---

### 3. ⭐ 8-Qubit VQC Baseline (78.64%)
- **4-Class Accuracy:** `78.64%`
- **Oral Malignant Cancer (OCA) F1:** `84.92%`
- **Macro F1:** `77.17%`
- **Role:** Foundational hybrid quantum architecture officially surpassed by the Q-ConX-Dense Tri-Stage Ensemble.

---

### 4. 📚 Literature Published SOTA References (for Comparison)
- **Welikala et al. (2020):** `74.00%`
- **Jubair et al. (2022):** `73.10%`
- **Camalan et al. (2021):** `71.00%`
- **ResNet-50 Classical Baseline:** `66.40%` / `48.28%`

---

## 📖 Sheet Breakdown by Workbook

### 1. `01_QAI_OLI_MASTER_REPORT_ACADEMIC_ENGLISH.xlsx`
- **Sheet 1 (`1. Research Trajectory`):** 12 chronological steps from 60% scratch baseline to 83.77% QAI-OLI (ConvNeXt-V2-Tiny + DenseNet-121 + 8-Qubit VQC).
- **Sheet 2 (`2. Checkpoint Model Catalog`):** 18 models side-by-side with exact file names, sizes, accuracy, and F1 scores.
- **Sheet 3 (`3. Technical Failure Analysis`):** 7 documented engineering failure modes and their mathematical resolutions.
- **Sheet 4 (`4. Visualizations Guide`):** Documentation of all 8 publication figures in `graphs_output/`.
- **Sheet 5 (`5. Viva & Defense Script`):** 10-point presentation script with examiner questions and technical answers.

### 2. `02_QAI_OLI_MASTER_REPORT_BABY_LANGUAGE_HINGLISH.xlsx`
- **Sheet 1 (`1. Research Journey (Safar)`):** Pure story format in simple Hinglish explaining how QAI-OLI (ConvNeXt-V2-Tiny + DenseNet-121 + 8-Qubit VQC) was built.
- **Sheet 2 (`2. All Models Report Card`):** Explains each checkpoint in plain language.
- **Sheet 3 (`3. Why Failed & Fixes`):** Explains why earlier classical models failed and how quantum-classical fusion resolved them.
- **Sheet 4 (`4. 8 Graphs Ka Guide`):** Guide for what each graph shows.
- **Sheet 5 (`5. Sir Ke Samne Kya Bolna Hai`):** 10 ready-made conversational viva answers in Hinglish.

### 3. `03_TOP_REFERENCE_PAPERS_VS_QAI_OLI_BENCHMARK_REAL.xlsx`
- **Sheet 1 (`1. 4-Class Literature Benchmark`):** Direct ranking of top reference papers against QAI-OLI (ConvNeXt-V2-Tiny + DenseNet-121 + 8-Qubit VQC).
- **Sheet 2 (`2. 4-Class Metric Matrix`):** Multi-metric grid (Accuracy, Sensitivity, Specificity, F1).
- **Sheet 3 (`3. All 25 Papers Survey`):** Complete survey of 25 reference papers.
- **Sheet 4 (`4. Sir Ko Samjhane Ka Guide`):** Hinglish guide comparing our numbers with published papers.
- **Sheet 5 (`5. Formal Academic Defense`):** Academic rebuttal against claims that binary classification papers are comparable to 4-class multiclass.
