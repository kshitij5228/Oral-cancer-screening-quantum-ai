# 🏆 QAI-OLI: Quantum-Classical Oral Oncology AI Suite
## Official SOTA Diagnostic Framework (83.77% Overall Accuracy | 98.40% Screening Triage)

This directory is the consolidated master package containing all models, publication figures, data tables, and comprehensive validation reports for the **QAI-OLI** system (formerly referred to as SUDARSHAN-MahaNet).

---

## 📁 Package Architecture

```
QAI_OLI/
├── models/
│   ├── 01_mahanet_convnextv2_tiny.pth      (107.1 MB | Stage 1 Spatial Feature Specialist)
│   ├── 02_mahanet_densenet121.pth          (28.1 MB  | Stage 2 Cellular Morphology Specialist)
│   ├── 03_mahanet_quantum_8q_vqc.pth       (152.1 MB | Stage 3 8-Qubit VQC Quantum Decider)
│   └── README.md
│
├── figures/
│   ├── proposed_model_evaluation/          (Dedicated Clinical Performance Suite for Q-ConX-Dense)
│   ├── figure_comparative_analysis_accuracy_barchart.png
│   ├── figure_comparative_analysis_accuracy_table.png
│   ├── figure_q_conx_dense_performance_analysis.png
│   ├── figure_q_conx_dense_performance_analysis_table.png
│   ├── figure_qai_oli_per_class_metrics.png
│   ├── figure_qai_oli_clinical_triage_parameters.png
│   ├── figure_qai_oli_models_comparison_multi_parameter.png
│   ├── figure_qai_oli_tp_progression_parameters.png
│   ├── comparative_analysis_accuracy_master.xlsx
│   └── qai_oli_option1_gap5_all_models.xlsx
│
└── reports/
    ├── 01_QAI_OLI_MASTER_REPORT_ACADEMIC_ENGLISH.xlsx
    ├── 02_QAI_OLI_MASTER_REPORT_BABY_LANGUAGE_HINGLISH.xlsx
    ├── 03_TOP_REFERENCE_PAPERS_VS_QAI_OLI_BENCHMARK_REAL.xlsx
    └── README_REPORTS.md
```

---

## 🔬 Core System Specifications
- **Proposed Model Architecture:** Q-ConX-Dense (Tri-Stage Hierarchical Clinical Triage combining Quantum, ConvNeXt-V2, and DenseNet-121)
- **Overall 4-Class Test Accuracy:** **83.77413%** (N=487 multi-center test benchmark)
- **Oral Malignancy Carcinoma (OCA) Sensitivity F1:** **89.40%**
- **Healthy Screening Specificity:** **98.40%**
- **Macro F1-Score:** **82.90%**
