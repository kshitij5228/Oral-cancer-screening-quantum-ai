# 🖼️ QAI-OLI Publication Figures & Visualizations

This directory contains publication-ready (300 DPI) figures, clinical triage charts, architecture diagrams, and benchmark plots.

---

## 📁 Directory Structure

### 1. 🏛️ `architecture_diagrams/`
IEEE-standard architecture diagrams available in both high-res PNG and scalable SVG:
- **`uml.png` / `uml.svg`**: Model Pipeline Architecture & Quantum-Classical Hybrid Dataflow.
- **`dfd_level_0.png` / `dfd_level_0.svg`**: Data Flow Diagram Level 0 (System Context & Terminators).
- **`dfd_level_1.png` / `dfd_level_1.svg`**: Data Flow Diagram Level 1 (Hierarchical Subsystems & Storage).
- **`dfd_level_2.png` / `dfd_level_2.svg`**: Data Flow Diagram Level 2 (Hilbert Space & Quantum Decoupler Signal Trace).
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

---
*Note: All charts are regenerated via automated scripts in [`../scripts/`](../scripts/). Spreadsheets have been relocated to [`../reports/`](../reports/).*
