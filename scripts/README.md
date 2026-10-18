# 🛠️ QAI-OLI Scripts & Utilities

This directory contains automated generation scripts for all clinical performance graphs, evaluation matrices, architecture diagrams, and validation tools.

---

## 🐍 Performance & Figure Generators

Run any generator script directly with Python from the project root:

| Script | Outputs | Purpose |
|---|---|---|
| `generate_qai_oli_performance_graphs.py` | `figures/figure_qai_oli_*.png` | Generates 300 DPI clinical triage, per-class, multi-model, and TP progression figures. |
| `generate_proposed_model_matrices.py` | `figures/proposed_model_evaluation/` | Generates confusion matrix, ROC curves, radar charts, and master clinical dashboard. |
| `generate_comparative_5_parameters_analysis.py` | `figures/comparative_parameter_analysis/` | Generates 8-model comparative charts & tables across 9 clinical parameters & master Excel. |
| `generate_comparative_accuracy_analysis.py` | `figures/figure_comparative_analysis_*.png` | Generates 8-model comparative bar charts and publication tables. |
| `generate_q_conx_dense_tp_performance_analysis.py` | `figures/figure_q_conx_dense_*.png` | Generates epoch progression and TP analysis specifically for Q-ConX-Dense. |
| `generate_architecture_flowchart.py` | `figures/architecture_diagrams/flowchart_pipeline.*` | Generates parallel multi-stream inference pipeline flowchart (HTML, PNG, JPG). |
| `render_system_architecture.py` | `figures/architecture_diagrams/system_architecture.*` | Headless Edge renderer for system architecture SVG/HTML to high-res PNG & JPG. |

### Example Execution:
```bash
python scripts/generate_qai_oli_performance_graphs.py
python scripts/generate_proposed_model_matrices.py
python scripts/generate_comparative_5_parameters_analysis.py
python scripts/generate_architecture_flowchart.py
```

---

## 📁 Subdirectories

- **`validation/`**: Internal repository verification, GSD CI checks, encoding tests, and codebase search utilities.
