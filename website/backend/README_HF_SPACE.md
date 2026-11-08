---
title: QAI-OLI Backend
emoji: 🔬
colorFrom: purple
colorTo: blue
sdk: docker
app_port: 8000
pinned: true
models:
  - Nakod69/qai-oli-models
---

# QAI-OLI FastAPI Inference Backend

**Q-ConX-Dense Tri-Stage Quantum-Classical Oral Cancer Screening API**

This Space hosts the FastAPI backend for the QAI-OLI platform.
Models are automatically downloaded from [Nakod69/qai-oli-models](https://huggingface.co/Nakod69/qai-oli-models) on startup.

## Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/` | GET | System info |
| `/health` | GET | Model load status |
| `/api/predict` | POST | Upload image → 4-class diagnosis |

## Frontend
Live at: https://oral-cancer-screening-quantum-ai.vercel.app
