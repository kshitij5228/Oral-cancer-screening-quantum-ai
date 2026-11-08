# Contributing to QAI-OLI

Thank you for your interest in contributing to **QAI-OLI** — a hybrid
quantum-classical oral oncology screening research platform. This document
guides you through every step from forking the repository to submitting a
reviewed pull request.

> **Medical Research Notice:** QAI-OLI is an academic research prototype.
> Contributions must not alter verified benchmark results, introduce clinical
> claims that have not been validated, or add patient-identifiable data.

---

## Table of Contents

1. [Community Standards](#1-community-standards)
2. [Project Overview for Contributors](#2-project-overview-for-contributors)
3. [Fork, Clone & Remote Setup](#3-fork-clone--remote-setup)
4. [Development Environment Setup](#4-development-environment-setup)
5. [Branch Naming Conventions](#5-branch-naming-conventions)
6. [Coding Standards](#6-coding-standards)
7. [Commit Message Conventions](#7-commit-message-conventions)
8. [Pull Request Process](#8-pull-request-process)
9. [Code Review Expectations](#9-code-review-expectations)
10. [Area-Specific Contribution Guides](#10-area-specific-contribution-guides)
11. [Reporting Bugs and Requesting Features](#11-reporting-bugs-and-requesting-features)
12. [What We Will NOT Accept](#12-what-we-will-not-accept)

---

## 1. Community Standards

All contributors must follow the project
[Code of Conduct](CODE_OF_CONDUCT.md). Be respectful, constructive, and
mindful of the academic and medical context of this research.

---

## 2. Project Overview for Contributors

```
QAI_OLI/
├── docs/           Academic & clinical documentation
├── figures/        Publication-quality figures (auto-generated)
├── models/         Model checkpoint registry (weights not in repo)
├── reports/        Benchmark Excel workbooks
├── scripts/        Automated plotting & benchmark scripts (Python)
└── website/
    ├── app/        Next.js 16 App Router (TypeScript / React 19)
    ├── backend/    FastAPI inference server (Python)
    ├── components/ Shared React UI components
    └── lib/        Frontend utility functions
```

**Key technology stack:**

| Layer | Technology |
|---|---|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS v4 |
| Backend | FastAPI, Uvicorn, Python 3.10+ |
| ML / DL | PyTorch 2.x, timm, Albumentations |
| Quantum | PennyLane 0.35+ |
| Explainability | Grad-CAM (custom `qai_explainable_ai.py`) |
| Package manager | pnpm (frontend), pip (backend) |

---

## 3. Fork, Clone & Remote Setup

```bash
# 1. Fork the repository on GitHub (click "Fork" on the repo page)

# 2. Clone your fork locally
git clone https://github.com/<your-username>/Oral-cancer-screening-quantum-ai.git
cd Oral-cancer-screening-quantum-ai

# 3. Add the upstream remote so you can keep in sync
git remote add upstream https://github.com/kshitij5228/Oral-cancer-screening-quantum-ai.git

# 4. Verify remotes
git remote -v
# origin    https://github.com/<your-username>/Oral-cancer-screening-quantum-ai.git (fetch)
# upstream  https://github.com/kshitij5228/Oral-cancer-screening-quantum-ai.git (fetch)
```

---

## 4. Development Environment Setup

### Prerequisites

| Tool | Minimum Version |
|---|---|
| Python | 3.10 |
| Node.js | 18 LTS |
| pnpm | 8+ (or npm 9+) |
| Git | 2.38+ |

### Backend Setup (FastAPI + PyTorch + PennyLane)

```bash
# Navigate to the backend directory
cd website/backend

# Create and activate a virtual environment (recommended)
python -m venv .venv
# Windows
.venv\Scripts\activate
# macOS / Linux
source .venv/bin/activate

# Install all Python dependencies
pip install -r requirements.txt

# Verify key packages
python -c "import torch; import pennylane; import fastapi; print('OK')"
```

> **Note on model weights:** The `.pth` checkpoint files are not committed
> to the repository. The server automatically attempts to download them from
> Hugging Face Hub (`Nakod69/qai-oli-models`) on first startup. For offline
> access, contact the lead developer — see
> [models/README.md](models/README.md).

#### Run the Backend Server

```bash
cd website/backend
uvicorn server:app --host 127.0.0.1 --port 8000 --reload
# API docs available at http://127.0.0.1:8000/docs
```

### Frontend Setup (Next.js)

```bash
cd website

# Install Node dependencies (using pnpm — preferred)
pnpm install
# or: npm install

# Start the development server
pnpm dev
# or: npm run dev
# App available at http://localhost:3000
```

#### Environment Variables (Frontend)

Create `website/.env.local` (never commit this file):

```env
# URL of your running FastAPI backend
BACKEND_URL=http://127.0.0.1:8000
```

### One-Click Launch (Windows)

```bat
:: From the repository root
start_application.bat
```

This launches both the backend (port 8000) and frontend (port 3000)
simultaneously.

---

## 5. Branch Naming Conventions

Branch names must be lowercase, hyphen-separated, and prefixed with a
category:

| Prefix | Use Case | Example |
|---|---|---|
| `feat/` | New feature or capability | `feat/opmd-confidence-tooltip` |
| `fix/` | Bug fix | `fix/gradcam-null-pointer` |
| `model/` | ML model, VQC circuit, or training changes | `model/4qubit-ablation` |
| `docs/` | Documentation only | `docs/update-contributing` |
| `refactor/` | Code cleanup, no behaviour change | `refactor/quality-gate-module` |
| `test/` | Adding or improving tests | `test/backend-unit-tests` |
| `chore/` | Build, CI, dependency bumps | `chore/bump-pennylane-0.36` |
| `data/` | Dataset scripts or data integrity fixes | `data/class-balance-audit` |

```bash
# Always branch from main
git checkout main
git pull upstream main
git checkout -b feat/your-feature-name
```

---

## 6. Coding Standards

### Python (Backend & Scripts)

- Follow [PEP 8](https://peps.python.org/pep-0008/).
- Use type hints for all function signatures.
- Write docstrings for every public function and class (Google-style preferred).
- Maximum line length: **100 characters**.
- Use `black` for formatting and `ruff` for linting:

```bash
pip install black ruff
black website/backend/
ruff check website/backend/
```

**Example — well-formed backend function:**

```python
def compute_ensemble_probs(
    probs_m1: torch.Tensor,
    probs_m2: torch.Tensor,
    probs_m3: torch.Tensor,
    weights: tuple[float, float, float] = (0.25, 0.25, 0.50),
) -> torch.Tensor:
    """Compute calibrated soft-vote ensemble probabilities.

    Args:
        probs_m1: Softmax probabilities from ConvNeXt-V2-Tiny (shape: [4]).
        probs_m2: Softmax probabilities from DenseNet-121 (shape: [4]).
        probs_m3: Softmax probabilities from 8-Qubit VQC Hybrid (shape: [4]).
        weights: Convex combination weights summing to 1.0.

    Returns:
        Fused probability tensor of shape [4].
    """
    w1, w2, w3 = weights
    return w1 * probs_m1 + w2 * probs_m2 + w3 * probs_m3
```

### TypeScript / React (Frontend)

- Use TypeScript strict mode; avoid `any`.
- Functional components only; use React hooks.
- Follow the Next.js App Router conventions (`page.tsx`, `layout.tsx`).
- Component files: `PascalCase.tsx`; utility files: `camelCase.ts`.
- Use Tailwind CSS utility classes; avoid inline `style={}` props.
- Format with `prettier` (project config in `website/`):

```bash
cd website
npx prettier --write .
```

### Documentation / Markdown

- Use ATX-style headers (`##`, `###`).
- Code blocks must specify language for syntax highlighting.
- Do not introduce new benchmark numbers, accuracy scores, or clinical
  claims unless they are reproduced from an actual experimental run on the
  frozen held-out test cohort (N = 487).

---

## 7. Commit Message Conventions

We follow the **Conventional Commits** specification
(https://www.conventionalcommits.org).

```
<type>(<scope>): <short imperative summary>

[Optional body — explain the why, not the what]

[Optional footer: Closes #<issue-number>, BREAKING CHANGE: ...]
```

**Types:**

| Type | When to use |
|---|---|
| `feat` | New feature |
| `fix` | Bug fix |
| `model` | ML/VQC model changes |
| `docs` | Documentation only |
| `refactor` | Refactoring, no logic change |
| `test` | Adding or modifying tests |
| `chore` | Dependencies, CI, build |
| `perf` | Performance improvement |
| `data` | Dataset or data processing change |

**Examples:**

```
feat(backend): add dual Grad-CAM overlay for DenseNet stream

fix(frontend): prevent null reference in screening confidence card

model(vqc): add 4-qubit ablation variant to get_qai_model()

docs(contributing): clarify branch naming for model changes

Closes #42
```

---

## 8. Pull Request Process

1. **Ensure your branch is up to date with upstream main:**

   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Self-review your diff before opening a PR:**

   ```bash
   git diff upstream/main...HEAD
   ```

3. **Push your branch to your fork:**

   ```bash
   git push origin feat/your-feature-name
   ```

4. **Open a Pull Request** on GitHub against the `main` branch of
   `kshitij5228/Oral-cancer-screening-quantum-ai`.

5. **Fill in the PR template completely** — incomplete templates will
   result in the PR being closed until the template is fully addressed.

6. **Link the relevant issue** in your PR description using
   `Closes #<issue-number>` or `Relates to #<issue-number>`.

7. **Ensure all checklist items are checked** before requesting review.

---

## 9. Code Review Expectations

- Every PR requires **at least one approving review** from a maintainer
  before it can be merged.
- Reviewers will respond within **5–7 business days**.
- Address all requested changes before re-requesting review.
- Do not force-push during an active review (it destroys review history).
- Squash minor fixup commits before the final merge (`git rebase -i`).

Reviewers will check:

- Correctness and medical safety (no fabricated clinical claims).
- Adherence to coding standards.
- No hardcoded secrets, credentials, API keys, or patient data.
- No regression in existing functionality.
- Tests present for new logic where applicable.

---

## 10. Area-Specific Contribution Guides

### ML Models & Quantum Circuits (`model_qai.py`, `model_v2.py`, `model_advanced.py`)

- Never overwrite or delete existing trained model weights (`.pth` files).
- New model variants must be additive — add a new `variant=` flag to
  `get_qai_model()` rather than replacing existing architectures.
- Any benchmark numbers you report in a PR **must** be reproducible using
  the frozen 487-image held-out test cohort. Document the exact command
  used to produce the numbers.
- VQC changes (number of qubits, ansatz, entangling layers) are considered
  `model/` scope and require architecture justification in the PR body.
- Do not change the soft-voting weights (0.25 / 0.25 / 0.50) without
  an attached ablation study showing improvement on the frozen test set.

### Backend API (`server.py`, `quality_gate.py`, `qai_explainable_ai.py`)

- FastAPI endpoints must remain backward-compatible; do not break the
  existing `/api/predict` response schema.
- New endpoints should be documented with FastAPI's built-in `summary=`
  and `description=` parameters so they appear in `/docs`.
- Error responses must follow the existing structure:
  `{"success": false, "error_type": "...", "message": "..."}`.
- The Quality Gate (`quality_gate.py`) must not be weakened —
  it protects the clinical reliability of the system.

### Frontend (`website/app/`, `website/components/`)

- New pages must follow the Next.js App Router file-system routing
  (`app/<route>/page.tsx`).
- Reuse existing shadcn/ui components from `website/components/ui/`
  before creating new ones.
- Responsive design is mandatory — test on mobile viewports (375 px).
- Do not introduce additional client-side analytics or tracking without
  maintainer approval.

### Documentation (`docs/`, `README.md`, `figures/`)

- Do not alter verified benchmark numbers in `TRAINING_APPROACH_CHRONOLOGY.md`
  or `PROJECT_MASTER_DOCUMENTATION_REPORT.md`.
- Figures in `figures/` are auto-generated by scripts in `scripts/`.
  If you change a script, regenerate and commit the updated figure.
- README improvements are welcome — keep the medical disclaimer intact
  and do not add fabricated citations.

### Scripts (`scripts/`)

- Plotting scripts must remain self-contained and runnable with the
  standard backend `requirements.txt` environment.
- Provide a brief docstring at the top of each script explaining its
  purpose and expected output.

---

## 11. Reporting Bugs and Requesting Features

Please use the **GitHub Issues** tab and select the appropriate template:

- 🐛 **Bug Report** — Something is broken
- ✨ **Feature Request** — An idea for a new capability
- 📉 **Model Performance / Research Issue** — Unexpected inference results
- 📚 **Documentation Improvement** — Errors or gaps in docs
- 🗄️ **Dataset / Data Integrity Issue** — Dataset concerns

Good issues include:
- Steps to reproduce (for bugs)
- Expected vs. actual behaviour
- Python / Node.js version and OS
- Relevant log output or error messages

---

## 12. What We Will NOT Accept

- Changes to trained model checkpoint `.pth` files
- Fabricated or unverified clinical benchmark numbers
- Introduction of patient-identifiable health information
- Hardcoded API keys, tokens, secrets, or credentials
- Pull requests targeting branches other than `main`
- Code that bypasses the Image Quality Gate for clinical use
- Plagiarized research text or copyright-infringing material
- Dependencies with incompatible licenses (e.g., GPL code imported into the
  MIT-licensed core)

---

*Thank you for helping advance open, transparent, and reproducible medical AI
research. — The QAI-OLI Team*
