# 📚 QAI-OLI Research Literature & Benchmark Papers

This directory maintains the reference library, literature review corpus, and comparative clinical benchmarks supporting the **QAI-OLI** oral oncology research.

---

## 📁 Directory Structure

```
research_papers/
├── literature_survey_selected/    # Curated Literature Survey Papers (Ordered 1 to 7)
│   ├── 1.pdf                      # Naoum et al. (2025) - Multimodal Feature Fusion
│   ├── 2.pdf                      # Mukherjee et al. (2025) - RGB-HSI Meta-Learning
│   ├── 3.pdf                      # Lloyd et al. (2025) - Electrical Impedance Spectroscopy
│   ├── 4.pdf                      # Hazra et al. (2025) - Uncertainty-Aware Multimodal Fusion
│   ├── 5.pdf                      # Naoum et al. (2024) - Stratified Multiclass CNN
│   ├── 6.pdf                      # Magdy et al. (2024) - RPA Oral Cancer Architecture
│   ├── 7.pdf                      # Sonawane et al. (2024) - Limited Training Data Classification
│   └── INDEX_OF_SELECTED_PAPERS.md# Detailed citation guide & exact thesis/report paragraphs
│
└── all_reference_papers/          # Complete Collection of 25 Foundational Studies
    ├── 1.pdf ... 25.pdf           # Original academic publications
    ├── LITTAB for cancer.xlsx     # Literature survey synthesis & comparative matrix
    └── TOP_REFERENCE_PAPERS_VS_TRINETRA_BENCHMARK.xlsx # Baseline performance matrix
```

---

## 📑 Core Literature Survey Comparison vs QAI-OLI

All selected literature survey papers focus on multi-class oral lesion identification across healthy tissue, benign lesions, pre-cancer (dysplasia/OPMD), and oral carcinoma (OCA).

| Paper ID | Primary Authors | Year | Diagnostic Modality | Reported Performance | QAI-OLI Improvement |
| :---: | :--- | :---: | :--- | :---: | :---: |
| **`1.pdf`** | Naoum et al. | 2025 | Multimodal Feature Fusion CNN | 54.97% – 82.57% Acc | **+1.20% to +28.80%** |
| **`2.pdf`** | Mukherjee et al. | 2025 | RGB-HSI Hyperspectral Imaging | 64.56% Acc (F1: 66.23%) | **+19.21%** |
| **`3.pdf`** | Lloyd et al. | 2025 | Electrical Impedance Spectroscopy | 80.00% Acc (AUC: 0.82) | **+3.77% (Contactless)** |
| **`4.pdf`** | Hazra et al. | 2025 | Bayesian Uncertainty-Aware CNN | 79.40% Acc (F1: 66.23%) | **+4.37%** |
| **`5.pdf`** | Naoum et al. | 2024 | Stratified ResNet / EfficientNet | 83.30% Acc (Rec: 77.31%) | **+0.47% (Higher OPMD Recall)** |
| **`6.pdf`** | Magdy et al. | 2024 | RPA + Transfer Learning CNN | 81.00% Acc | **+2.77%** |
| **`7.pdf`** | Sonawane et al. | 2024 | Limited-Data Oral CNN | 72.94% Acc | **+10.83%** |
| **PROPOSED**| **QAI-OLI (Ours)** | **2025/26** | **8-Qubit VQC + Dual-Stream Vision** | **83.77% Acc (F1: 82.6%)** | **World SOTA Benchmark** |

---

## 🔗 Related Resources
- **Detailed Literature Review Notes**: [`literature_survey_selected/INDEX_OF_SELECTED_PAPERS.md`](literature_survey_selected/INDEX_OF_SELECTED_PAPERS.md)
- **Standardized Multi-Sheet Excel Reports**: [`../reports/`](../reports/)
- **Publication Figures & Charts**: [`../figures/`](../figures/)
