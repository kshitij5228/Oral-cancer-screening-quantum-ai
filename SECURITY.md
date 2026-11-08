# Security Policy — QAI-OLI

## Supported Versions

The following table shows which versions of QAI-OLI currently receive
security updates. We use [Semantic Versioning](https://semver.org/).

| Version | Supported |
|---------|-----------|
| 1.6.x (current) | ✅ Yes |
| < 1.6.0 | ❌ No — please upgrade |

---

## Reporting a Vulnerability

If you discover a security vulnerability, **please do not open a public
GitHub issue**. Public disclosure before a fix is available could place
users, clinical workflows, or data at risk.

### How to Report

1. **Email the lead maintainer directly:**
   - **Name:** Kshitij Nakod
   - **GitHub:** [@kshitij5228](https://github.com/kshitij5228)
   - Use the email address listed publicly in the [README](README.md)
     under the Authors section.
   - **Subject line:** `[QAI-OLI SECURITY] <brief description>`

2. **Include in your report:**
   - A clear description of the vulnerability
   - Steps to reproduce
   - Potential impact (e.g., data exposure, model manipulation,
     authentication bypass)
   - Any proof-of-concept code or screenshots (redact all patient data)

3. **Response timeline:**
   - We aim to acknowledge receipt within **72 hours**.
   - We will assess severity and provide an estimated remediation
     timeline within **7 days**.
   - After a fix is released, coordinated disclosure will be credited
     to you unless you request anonymity.

---

## Scope

The following are **in scope** for this policy:

- FastAPI backend server (`website/backend/server.py`) — authentication,
  input validation, path traversal
- Frontend API proxy (`website/app/api/predict/route.ts`) — SSRF,
  injection vulnerabilities
- Image Quality Gate — adversarial bypass
- Dependency vulnerabilities affecting runtime security

The following are **out of scope:**

- Vulnerabilities in upstream dependencies (please report those directly
  to the respective projects)
- Model accuracy or clinical performance issues (use the
  [Model Performance issue template](.github/ISSUE_TEMPLATE/model_performance.yml)
  instead)
- Issues that require physical access to the deployment server

---

## Critical Security Guidance for Deployments

### ⚠️ Never Commit Secrets or Credentials

This project uses environment variables for all sensitive configuration.
The following must **never** be committed to the repository:

- API keys (Hugging Face tokens, Vercel tokens, etc.)
- Cloud provider credentials (AWS, GCP, Azure)
- Database connection strings
- Private keys or certificates (`.pem`, `.key`)
- `.env` files (already in `.gitignore` — keep it that way)

**Use `.env.local` for local development (never committed):**

```env
# website/.env.local  — DO NOT COMMIT
BACKEND_URL=http://127.0.0.1:8000
HF_TOKEN=hf_...
```

If you accidentally commit a secret, **revoke and rotate it immediately**
before attempting to remove it from git history.

### ⚠️ Patient Data and Clinical Images

This is a medical AI research project. The following rules are absolute:

- **Never commit real patient photographs** to this repository, whether
  identified or de-identified.
- **Never store patient-linked metadata** (names, dates of birth, medical
  record numbers) anywhere in the codebase, configuration, or logs.
- Sample images in `website/public/samples/` are synthetic or
  de-identified demonstration images only.
- Model weights (`.pth` files) are excluded from the repository via
  `.gitignore`. They must not be committed even if they appear safe —
  embedded training data characteristics could be extractable.

### ⚠️ CORS and Network Exposure

The backend server currently uses `allow_origins=["*"]` for local
development convenience. **Before any production deployment:**

- Restrict CORS to your specific frontend domain.
- Place the FastAPI server behind a reverse proxy (nginx, Caddy) with
  HTTPS enforced.
- Do not expose the backend directly on port 8000 to the internet.

### ⚠️ Model Checkpoint Integrity

Downloaded model weights should be verified against their expected SHA-256
checksums (documented in `models/README.md`) before loading. Loading
untrusted `.pth` files with `torch.load(..., weights_only=False)` is a
known arbitrary code execution risk — the codebase uses `weights_only=True`
to mitigate this.

---

## Dependency Vulnerability Scanning

We recommend contributors run the following before submitting PRs:

```bash
# Python dependency audit
pip install pip-audit
pip-audit -r website/backend/requirements.txt

# Node.js dependency audit
cd website
npm audit
```

---

*This policy applies to the QAI-OLI repository at
https://github.com/kshitij5228/Oral-cancer-screening-quantum-ai*
