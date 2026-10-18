# 🖼️ QAI-OLI Publication Figures & Visualizations

This directory contains publication-ready (300 DPI) figures, clinical triage charts, architecture diagrams, and benchmark plots.

---

## 📁 Directory Structure

### 1. 🏛️ `architecture_diagrams/`
IEEE-standard architecture diagrams available in vector (SVG, HTML) and 300 DPI high-res raster (PNG):
- **`system_architecture.png` / `.html`**: Complete End-to-End System Architecture (5 Tiers: Patient IQA, Feature Decoupling, Tri-Stream Consensus, Clinical Outputs, Decision Archival).
- **`flowchart_pipeline.png` / `.html`**: Clean Parallel Multi-Stream Inference Flowchart (M1 ConvNeXt + M2 DenseNet + M3 PennyLane VQC + Soft-Vote Calibration).
- **`uml.png` / `uml.svg`**: Model Pipeline Architecture & Quantum-Classical Hybrid Dataflow.
- **`use_case.png` / `use_case.svg`**: UML Operational Use Case Diagram (5 Actors, 11 Clinical Use Cases).

### 2. 📊 `proposed_model_evaluation/`
Dedicated multi-metric clinical evaluation suite for the champion model (Q-ConX-Dense):
- **`figure_1_qai_oli_confusion_matrix.png`**: 4-Class confusion matrix on N=487 held-out test cohort.
- **`figure_2_qai_oli_metrics_matrix.png`**: Per-class precision, recall, F1, and specificity matrix.
- **`figure_3_qai_oli_parameter_radar_chart.png`**: Multi-dimensional diagnostic capability radar chart.
- **`figure_4_qai_oli_roc_curves_matrix.png`**: Multi-class ROC curves and AUC scores.
- **`figure_5_qai_oli_master_clinical_dashboard.png`**: Integrated master clinical deployment dashboard.
- **`figure_6_qai_oli_overall_performance_barchart.png`**: Summary bar chart of key clinical triage milestones.

### 3. 📈 Root Figures (`figures/`)
- **`figure_qai_oli_clinical_triage_parameters.png`**: Stage-by-stage clinical triage performance vs 80% viability threshold.
- **`figure_qai_oli_per_class_metrics.png`**: Per-class diagnostic metrics across Healthy, Benign, OPMD, and OCA.
- **`figure_qai_oli_models_comparison_multi_parameter.png`**: Multi-parameter benchmark comparing classical, quantum, and hybrid models.
- **`figure_qai_oli_tp_progression_parameters.png`**: Key metric progression across training partitions (TP_40 to TP_90).
- **`figure_comparative_analysis_accuracy_barchart.png`**: Grouped accuracy progression across training fractions.
- **`figure_comparative_analysis_accuracy_table.png`**: Formatted high-res accuracy table.
- **`figure_q_conx_dense_performance_analysis.png`**: Multi-epoch progression analysis for Q-ConX-Dense.
- **`figure_q_conx_dense_performance_analysis_table.png`**: Multi-epoch progression table.

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
- **Master Multi-Sheet Excel**: `comparative_analysis_all_parameters_master.xlsx`
- **Documentation**: `README.md` with full Markdown tables and embedded previews.
- **Regeneration Script**: `scripts/generate_comparative_5_parameters_analysis.py`

---
*Note: All charts are regenerated via automated scripts in [`../scripts/`](../scripts/). Spreadsheets have been relocated to [`../reports/`](../reports/).*
