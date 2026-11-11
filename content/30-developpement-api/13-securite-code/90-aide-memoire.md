---
title: Sécurité du code et linters — aide-mémoire
description: Commandes de détection de secrets (Gitleaks, detect-secrets, TruffleHog), d'analyse IaC (Checkov, KICS, Terrascan, TFLint) et de linting (ShellCheck, shfmt, Actionlint, EditorConfig), plus l'orchestration pre-commit.
tags: [aide-mémoire, gitleaks, trufflehog, checkov, tflint, shellcheck, actionlint, pre-commit]
icon: terminal
---

Explications : [[01-gitleaks-detect-secrets-trufflehog|Secrets]] · [[02-iac-checkov-kics|IaC]] · [[03-linters-shellcheck|Linters]].

```bash
# Secrets
gitleaks detect --source . --report-format sarif --report-path gitleaks.sarif
detect-secrets scan > .secrets.baseline ; detect-secrets audit .secrets.baseline
trufflehog git file://. --only-verified

# IaC
checkov -d . -o sarif --output-file-path .
docker run -t -v "$PWD":/path checkmarx/kics:latest scan -p /path -o /path
terrascan scan -i terraform -d .
tflint --init && tflint --recursive

# Linters
shellcheck -x scripts/*.sh
shfmt -w -i 2 -ci scripts/
actionlint
editorconfig-checker

# Orchestration
pip install pre-commit
pre-commit install
pre-commit run --all-files
```

| En CI | Astuce |
| --- | --- |
| Rapports | SARIF (Gitleaks, Checkov, Terrascan) affichés par la forge |
| Montée en charge | commencer en `--soft-fail`, puis bloquer |
| Exceptions | annotations au plus près (`# shellcheck disable`, `#checkov:skip`), documentées |
