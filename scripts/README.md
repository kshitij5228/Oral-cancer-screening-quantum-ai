# 🛠️ QAI-OLI Scripts & Utilities

This directory contains automated generation scripts for all clinical performance graphs, evaluation matrices, architecture diagrams, and validation tools.

---

## 🐍 Performance & Figure Generators

Run any generator script directly with Python from the project root:

| Script | Outputs | Purpose |
|---|---|---|
| `generate_qai_oli_performance_graphs.py` | `figures/clinical_triage_parameters.png`, `per_class_diagnostic_metrics.png`, `models_multi_parameter_comparison.png`, `tp_progression_parameters.png` | Generates 300 DPI clinical triage, per-class, multi-model benchmark, and TP progression bar charts. |
| `generate_proposed_model_matrices.py` | `figures/proposed_model_evaluation/` | Generates confusion matrix, ROC curves, radar charts, diagnostic metrics matrix, and master clinical dashboard. |
| `generate_comparative_parameter_analysis.py` | `figures/comparative_parameter_analysis/` & `reports/05_...` | Generates 8-model comparative charts & tables across all 9 clinical parameters & master comparative Excel. |
| `generate_comparative_accuracy_analysis.py` | `figures/comparative_parameter_analysis/accuracy_*.png` | Lightweight single-parameter (Accuracy) grouped bar chart and publication table generator. |
| `generate_q_conx_dense_tp_performance_analysis.py` | `figures/q_conx_dense_epoch_performance_*.png` | Generates dedicated multi-epoch progression bar chart and publication table for Q-ConX-Dense. |
| `generate_architecture_flowchart.py` | `figures/architecture_diagrams/flowchart_pipeline.*` | Generates parallel multi-stream inference pipeline flowchart (HTML, Mermaid, PNG). |
| `generate_use_case_diagram.py` | `figures/architecture_diagrams/use_case_diagram.*` | Generates clinical operational use case diagram (HTML, SVG, PNG). |

### Example Execution:
```bash
python scripts/generate_qai_oli_performance_graphs.py
python scripts/generate_proposed_model_matrices.py
python scripts/generate_comparative_parameter_analysis.py
python scripts/generate_q_conx_dense_tp_performance_analysis.py
python scripts/generate_architecture_flowchart.py
python scripts/generate_use_case_diagram.py
```
