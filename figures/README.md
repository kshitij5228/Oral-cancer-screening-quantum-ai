# 🖼️ QAI-OLI Publication Figures & Visualizations

This directory contains publication-ready (300 DPI) figures, clinical triage charts, architecture diagrams, and benchmark plots.

---

## 📁 Directory Structure

### 1. 🏛️ `architecture_diagrams/`
IEEE-standard architecture diagrams rendered in publication-quality 300 DPI high-resolution PNG format:
- **`system_architecture.png`**: Complete End-to-End System Architecture (5 Tiers: Client, Gateway & IQA, Classical Vision, Quantum Co-processor, Decision Ensemble).
- **`flowchart_pipeline.png`**: Clean Parallel Multi-Stream Inference Flowchart (M1 ConvNeXt + M2 DenseNet + M3 PennyLane VQC + Soft-Vote Calibration).
- **`use_case_diagram.png`**: Comprehensive Clinical Operational Use Case Diagram (Primary Care Triage, Specialist Verification, Patient Portal, Tele-oncology).

### 2. 📊 `proposed_model_evaluation/`
Dedicated multi-metric clinical evaluation suite for the champion model (Q-ConX-Dense):
- **`confusion_matrix.png`**: 4-Class confusion matrix on N=487 held-out test cohort.
- **`diagnostic_metrics_matrix.png`**: Per-class precision, recall, F1, and specificity matrix.
- **`parameter_radar_chart.png`**: Multi-dimensional diagnostic capability radar chart.
- **`roc_auc_curve.png`**: Unified multi-class ROC curves and AUC scores.
- **`master_clinical_dashboard.png`**: Integrated master clinical deployment dashboard.
- **`overall_performance_barchart.png`**: Summary bar chart of key clinical triage milestones.

### 3. 📈 Root Figures (`figures/`)
- **`clinical_triage_parameters.png`**: Stage-by-stage clinical triage performance vs 80% viability threshold.
- **`per_class_diagnostic_metrics.png`**: Per-class diagnostic metrics across Healthy, Benign, OPMD, and OCA.
- **`models_multi_parameter_comparison.png`**: Multi-parameter benchmark comparing classical, quantum, and hybrid models.
- **`tp_progression_parameters.png`**: Key metric progression across training partitions (TP_40 to TP_90).
- **`q_conx_dense_epoch_performance_barchart.png`**: Multi-epoch progression analysis bar chart for Q-ConX-Dense.
- **`q_conx_dense_epoch_performance_table.png`**: Multi-epoch progression publication table for Q-ConX-Dense.

### 4. 🔬 `comparative_parameter_analysis/`
Dedicated multi-parameter comparative analysis suite containing matched bar charts and publication tables across training partitions (TP_40% to TP_90%) for 8 core models:
- **Overall Accuracy**: `accuracy_barchart.png` & `accuracy_table.png`
- **Macro F1-Score**: `f1_score_barchart.png` & `f1_score_table.png`
- **Cohen's Kappa (κ Score)**: `kappa_barchart.png` & `kappa_table.png`
- **Macro Recall / Sensitivity**: `recall_barchart.png` & `recall_table.png`
- **Macro Precision**: `precision_barchart.png` & `precision_table.png`
- **Macro Specificity**: `specificity_barchart.png` & `specificity_table.png`
- **Balanced Accuracy**: `balanced_accuracy_barchart.png` & `balanced_accuracy_table.png`
- **Matthews Correlation Coefficient (MCC)**: `mcc_barchart.png` & `mcc_table.png`
- **Cross-Entropy Test Loss**: `loss_barchart.png` & `loss_table.png`
- **Summary Table**: `comparative_analysis_all_parameters_table.png`
- **Documentation**: `README.md` with full Markdown tables and embedded previews.
- **Regeneration Script**: `scripts/generate_comparative_parameter_analysis.py`

---
*Note: All charts are regenerated via automated scripts in [`../scripts/`](../scripts/). Spreadsheets have been relocated to [`../reports/`](../reports/).*
