## Summary of Changes

<!-- Provide a concise (2–5 sentence) description of what this PR changes and why. -->


## Related Issue

<!-- Link the issue this PR addresses. Use "Closes #N" to auto-close it on merge. -->
Closes #

## Type of Change

<!-- Check all that apply. -->

- [ ] 🐛 Bug fix (non-breaking change that fixes an issue)
- [ ] ✨ New feature (non-breaking change that adds functionality)
- [ ] 🧠 ML / Model change (architecture, VQC circuit, training logic, ensemble weights)
- [ ] ⚡ Performance improvement
- [ ] ♻️ Refactor (no functional change)
- [ ] 📚 Documentation update
- [ ] 🔧 Build / CI / dependency change
- [ ] 🗄️ Data / dataset change

## Implementation Details

<!-- Explain the key implementation decisions. For model changes, describe the
     architectural rationale and any ablation study supporting this change. -->


## Testing Performed

<!-- Describe the tests you ran to verify your changes. -->

### Backend (Python)

```bash
# Commands used to test the backend
uvicorn server:app --port 8000 --reload
# Then tested via /api/predict endpoint with:
# - website/public/samples/healthy_original.jpg  → expected: Healthy
# - website/public/samples/oca_original.jpg      → expected: OCA
# - website/public/samples/opmd_original.jpg     → expected: OPMD
# - website/public/samples/benign_original.jpg   → expected: Benign
```

### Frontend (Next.js)

```bash
pnpm dev
# Tested on: Chrome 125, Firefox 128
# Viewport sizes tested: 375px (mobile), 1440px (desktop)
```

### Unit / Integration Tests

<!-- If applicable, paste test output here. -->

## Model Evaluation Results (if applicable)

<!-- If this PR changes model logic, ensemble weights, or VQC circuit,
     provide evaluation results on the frozen held-out test cohort (N=487).
     Do NOT fabricate numbers. -->

| Metric | Before | After | Δ Change |
|---|---|---|---|
| 4-Class Accuracy | — | — | — |
| Macro F1 | — | — | — |
| OCA F1-Score | — | — | — |
| OPMD F1-Score | — | — | — |
| Cohen's κ | — | — | — |

> Evaluation command used:
> ```bash
> # paste exact command here
> ```

## Screenshots (if applicable)

<!-- Add before/after screenshots for UI changes. No real patient images. -->

| Before | After |
|--------|-------|
| — | — |

## Checklist

<!-- All items must be checked before requesting a review. -->

### Code Quality
- [ ] My code follows the project's coding standards (PEP 8 for Python, TypeScript strict mode).
- [ ] I have added docstrings / type hints to all new public functions.
- [ ] I have run `black` + `ruff` (Python) or `prettier` (TypeScript) on changed files.

### Safety & Integrity
- [ ] This PR does **not** include real patient photographs or patient-identifiable data.
- [ ] This PR does **not** commit API keys, credentials, `.env` files, or secrets.
- [ ] This PR does **not** modify trained model checkpoint `.pth` files.
- [ ] This PR does **not** introduce unverified clinical benchmark numbers or fabricated accuracy scores.
- [ ] The Image Quality Gate has not been weakened or bypassed.

### ML / Model (complete if model changed)
- [ ] New model variants are additive (new `variant=` flag) and do not break existing variants.
- [ ] Ensemble soft-voting weights are unchanged, or a justified ablation is provided above.
- [ ] Evaluation was performed against the frozen 487-image held-out test cohort.

### Documentation
- [ ] I have updated relevant documentation to reflect my changes.
- [ ] I have updated `README.md` if the setup/usage process changed.

### Git Hygiene
- [ ] My branch is up to date with `upstream/main` (`git rebase upstream/main`).
- [ ] My commits follow the Conventional Commits specification.
- [ ] I have squashed WIP / fixup commits (`git rebase -i`).
