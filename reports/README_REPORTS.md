# 🏛️ QAI-OLI: Master Reports & Benchmark Directory
**Directory:** `reports/`

This directory houses the standardized, multi-sheet empirical benchmark workbooks and comparative literature matrices for the **QAI-OLI** oral oncology screening and diagnostic platform. All data is documented in rigorous academic English.

---

## 📁 File Index

| # | Master Excel Workbook | Primary Focus | Key Metric Highlights |
|---|---|---|---|
| **01** | `01_QAI_OLI_MASTER_CLINICAL_BENCHMARK_REPORT.xlsx` | Comprehensive Clinical & Technical Report | 5-Sheet Master Report: Research Trajectory, 18-Model Checkpoint Catalog, Failure Modes & Defense Script |
| **02** | `02_TOP_REFERENCE_PAPERS_VS_QAI_OLI_BENCHMARK.xlsx` | Literature Comparison & Benchmark Study | QAI-OLI (83.77%) vs. 25 Published Papers (Welikala 74%, Jubair 73%, Naoum 55%) across 4 classes |
| **03** | `03_QAI_OLI_ACCURACY_COMPARATIVE_ANALYSIS.xlsx` | Multi-Model Benchmark Progression | 8-Model & 10-Model Comparative Progression across Training Partitions (TP_40 to TP_90) |
| **04** | `04_QAI_OLI_TRAINING_PROGRESSION_DATA.xlsx` | Multi-Epoch Trajectory Table | Multi-model convergence trajectories across training pool percentages (40%–90%) & Epochs (5–35) |

---

## 👑 Model Performance Hierarchy

### 1. 🏆 Q-ConX-Dense (ConvNeXt-V2-Tiny + DenseNet-121 + 8-Qubit VQC) — Champion (83.77%)
- **Architecture Overview:**
  - **Stage 1 (Spatial Vision & Boundary Specialist):** ConvNeXt-V2-Tiny (`01_mahanet_convnextv2_tiny.pth`) — captures macroscopic lesion morphology and irregular keratinized borders.
  - **Stage 2 (Cellular Morphology & Vascular Specialist):** DenseNet-121 (`02_mahanet_densenet121.pth`) — dense gradient flow resolves subtle epithelial atypia and vascular network changes.
  - **Stage 3 (Quantum Hilbert Space Decider):** 8-Qubit Parameterized VQC (`03_mahanet_quantum_8q_vqc.pth`) — PennyLane parameterized ansatz resolves complex boundary confusions in a 256-D Hilbert space.
- **Empirical Clinical Benchmarks (N=487 Held-Out Test Cohort):**
  - **Overall 4-Class Test Accuracy:** `83.77%` *(World SOTA)*
  - **Oral Carcinoma (OCA) F1-Score:** `89.40%`
  - **Macro-Averaged F1-Score:** `82.90%`
  - **Stage 1 Screening Specificity (Healthy Mucosa):** `98.40%`
  - **Stage 2 Malignancy Isolation (Sensitivity / Recall):** `90.43%`
  - **Stage 3 Benign vs. OPMD Discrimination Accuracy:** `83.77%`

---

### 2. ⭐ Q-OLI Dual-Quantum Blend (79.88%)
- **4-Class Accuracy:** `79.88%`
- **Oral Carcinoma (OCA) F1:** `87.15%`
- **Macro F1:** `79.67%`
- **Architecture:** Soft-voting ensemble combining 8-Qubit VQC, 4-Qubit VQC, and ConvNeXt-V2-Tiny on CUDA GPU.

---

### 3. ⭐ 8-Qubit VQC Baseline (78.64%)
- **4-Class Accuracy:** `78.64%`
- **Oral Carcinoma (OCA) F1:** `84.92%`
- **Macro F1:** `77.17%`
- **Role:** Foundational hybrid quantum model confirming a +4.92% gain over the classical 8-D linear control.

---

### 4. 📚 Published Literature Benchmarks (for Comparison)
- **Welikala et al. (2020):** `74.00%`
- **Jubair et al. (2022):** `73.10%`
- **Camalan et al. (2021):** `71.00%`
- **Naoum et al. (2025, 4-Class Multi-Lesion):** `54.97%`
- **ResNet-50 Baseline:** `48.28%` / `66.40%`

---

## 📖 Workbook Architecture & Sheet Layout

### 1. `01_QAI_OLI_MASTER_CLINICAL_BENCHMARK_REPORT.xlsx`
- **Sheet 1 (`1. Research Trajectory`):** Chronological progression from baseline classical networks to the tri-stage quantum-classical SOTA.
- **Sheet 2 (`2. Checkpoint Model Catalog`):** Complete model registry cataloging parameters, disk footprint, floating-point operations, and test scores.
- **Sheet 3 (`3. Technical Failure Analysis`):** Detailed analysis of historical failure modes (e.g., cascade compounding errors, frozen-backbone bottlenecks) and their mathematical solutions.
- **Sheet 4 (`4. Visualizations Guide`):** Index and clinical interpretation of publication figures.
- **Sheet 5 (`5. Technical Defense Script`):** Structured 10-point technical presentation narrative with empirical evidence and defense against technical inquiries.

### 2. `02_TOP_REFERENCE_PAPERS_VS_QAI_OLI_BENCHMARK.xlsx`
- **Sheet 1 (`1. 4-Class Literature Benchmark`):** Direct comparative ranking of published state-of-the-art models against QAI-OLI across standardized 4-class evaluation.
- **Sheet 2 (`2. 4-Class Metric Matrix`):** Multi-metric comparison matrix reporting accuracy, sensitivity, specificity, and macro F1 scores.
- **Sheet 3 (`3. All 25 Papers Survey`):** Literature survey cataloging 25 oral oncology papers across clinical modality, imaging source, and dataset scale.
- **Sheet 4 (`4. Formal Academic Defense`):** Rigorous academic defense substantiating the distinction between 4-class multi-lesion stratification and trivial binary screening.

### 3. `03_QAI_OLI_ACCURACY_COMPARATIVE_ANALYSIS.xlsx`
- Tabulated progression comparing 8 distinct network backbones across training pool allocations from 40% (TP_40) to 90% (TP_90).

### 4. `04_QAI_OLI_TRAINING_PROGRESSION_DATA.xlsx`
- Multi-epoch trajectory matrix capturing model loss and evaluation metrics at 5-epoch intervals (Epoch 5 to 35).
