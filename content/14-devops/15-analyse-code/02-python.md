---
title: Ruff, Pylint, mypy et Bandit (Python)
description: Qualité et sécurité du code Python — Ruff (MIT : linter et formateur très rapide en Rust, compatible Flake8, isort, pyupgrade, Black ; ruff check, --fix, ruff format, pyproject.toml), Pylint (GPL : analyse approfondie, score, .pylintrc), mypy (MIT : vérification statique des annotations de types, --strict) et Bandit (Apache 2.0 : failles de sécurité courantes ; bandit -r, niveaux, SARIF), installation par pip, uv ou pipx, configuration commune et intégration pre-commit et CI.
tags: [python, ruff, pylint, mypy, bandit, lint, typage, sécurité]
icon: file-code-2
---

| Outil | Rôle | Remarque |
| --- | --- | --- |
| **Ruff** | Linter **et** formateur | Remplace Flake8, isort, pyupgrade et Black dans la plupart des projets |
| **Pylint** | Analyse approfondie (conception, conventions) | Plus lent, plus bavard ; complément de Ruff |
| **mypy** | Vérification des **types** | Exploite les annotations (`def f(x: int) -> str`) |
| **Bandit** | **Sécurité** | `eval`, `subprocess` avec `shell=True`, `verify=False`, mots de passe en dur… |

Installation (Linux, Windows, macOS), de préférence dans l'environnement du projet ou avec [[10-uv|uv]] :

```bash
uv add --dev ruff pylint mypy "bandit[sarif]"       # ou : pip install ruff pylint mypy "bandit[sarif]"
pipx install ruff                                    # outil global
```

## Configuration commune (pyproject.toml)

```toml
[tool.ruff]
line-length = 110
target-version = "py312"

[tool.ruff.lint]
select = ["E", "F", "W", "I", "UP", "B", "S", "SIM"]     # erreurs, imports, modernisation, bugbear, sécurité
ignore = ["E501"]

[tool.ruff.format]
quote-style = "double"

[tool.mypy]
python_version = "3.12"
strict = true
ignore_missing_imports = true

[tool.bandit]
exclude_dirs = ["tests"]
```

## Utilisation

```bash
ruff check .                     # analyse
ruff check . --fix               # corrections automatiques sûres
ruff format .                    # mise en forme (équivalent Black)
pylint src/
pylint --generate-rcfile > .pylintrc
mypy src/
bandit -r src/ -ll               # sévérité moyenne et plus
bandit -r src/ -f sarif -o bandit.sarif
```

## Intégration

```yaml
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/astral-sh/ruff-pre-commit
    rev: v0.14.0
    hooks:
      - id: ruff
        args: [--fix]
      - id: ruff-format
```

(Remplacer `rev` par la version de Ruff utilisée.) En CI : `ruff check --output-format=github .` (annotations dans GitHub), `mypy` et `bandit` en étapes séparées qui font échouer le pipeline. Les règles `S` de Ruff reprennent une partie de Bandit : garder Bandit pour les rapports de sécurité dédiés.

Commandes : [[90-aide-memoire|aide-mémoire]].
