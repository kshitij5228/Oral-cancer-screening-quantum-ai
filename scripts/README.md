# 🛠️ QAI-OLI Scripts & Utilities

This directory contains automated generation scripts for all clinical performance graphs, evaluation matrices, and validation tools.

---

## 🐍 Performance & Figure Generators

Run any generator script directly with Python from the project root:

| Script | Outputs | Purpose |
|---|---|---|
| `generate_qai_oli_performance_graphs.py` | `figures/figure_qai_oli_*.png` | Generates 300 DPI clinical triage, per-class, multi-model, and TP progression figures. |
| `generate_proposed_model_matrices.py` | `figures/proposed_model_evaluation/` | Generates confusion matrix, ROC curves, radar charts, and master clinical dashboard. |
| `generate_comparative_accuracy_analysis.py` | `figures/figure_comparative_analysis_*.png` | Generates 8-model comparative bar charts and publication tables. |
| `generate_q_conx_dense_tp_performance_analysis.py` | `figures/figure_q_conx_dense_*.png` | Generates epoch progression and TP analysis specifically for Q-ConX-Dense. |

### Example Execution:
```bash
python scripts/generate_qai_oli_performance_graphs.py
python scripts/generate_proposed_model_matrices.py
```

---

## 📁 Subdirectories

- **`validation/`**: Internal repository verification, GSD CI checks, encoding tests, and codebase search utilities.
