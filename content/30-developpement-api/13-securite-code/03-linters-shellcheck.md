---
title: Actionlint, ShellCheck, shfmt et EditorConfig
description: Linters et formatage pour la qualité du code et des pipelines — ShellCheck (analyse des scripts shell, erreurs courantes, directives), shfmt (formatage des scripts shell), Actionlint (validation des workflows GitHub Actions, shellcheck et pyflakes intégrés), EditorConfig (cohérence d'indentation et de fins de ligne entre éditeurs) ; intégration pre-commit et CI, et place parmi les autres linters.
tags: [shellcheck, shfmt, actionlint, editorconfig, lint, shell, github actions, qualité]
icon: shield-check
---

Les **linters** repèrent erreurs et maladresses avant l'exécution ; le **formatage** et **EditorConfig** garantissent un style cohérent. Ils s'intègrent en hook **pre-commit** et en **CI**, pour une base de code lisible et des pipelines fiables.

## ShellCheck

**ShellCheck** analyse les scripts **shell** (bash, sh, dash, ksh) et signale les pièges classiques : variables non quotées, comparaisons erronées, usages non portables, globbing involontaire. Indispensable pour tout script d'administration.

```bash
# apt install shellcheck ; dnf install ShellCheck ; brew install shellcheck
shellcheck script.sh
shellcheck -S warning scripts/*.sh             # niveau minimal : warning
shellcheck -x deploiement.sh                   # suit les « source » (fichiers inclus)
```

```bash
# Directives dans le script pour justifier une exception, au plus près de la ligne :
# shellcheck disable=SC2086  # découpage de mots voulu ici
rm $fichiers
```

## shfmt

**shfmt** **formate** les scripts shell de façon déterministe (indentation, espaces, style des blocs), comme `gofmt` pour Go.

```bash
# paquet shfmt ; brew install shfmt ; image mvdan/shfmt
shfmt -d script.sh                             # diff (ne modifie pas)
shfmt -w -i 2 -ci scripts/                     # écrit : indentation 2 espaces, indent des case
shfmt -l .                                     # liste les fichiers non conformes
```

## Actionlint

**Actionlint** valide les **workflows GitHub Actions** (`.github/workflows/*.yml`) : erreurs de syntaxe, expressions `${{ }}` invalides, références inexistantes, matrices incohérentes. Il lance **ShellCheck** sur les étapes `run:` et **pyflakes** sur le Python intégré.

```bash
# binaire des versions GitHub ; brew install actionlint ; image rhysd/actionlint
actionlint
actionlint -color .github/workflows/ci.yml
docker run --rm -v "$PWD":/repo -w /repo rhysd/actionlint:latest -color
```

Équivalents pour d'autres plates-formes : `gitlab-ci-local`/validation d'API pour GitLab CI.

## EditorConfig

**EditorConfig** n'est pas un linter mais un fichier `.editorconfig` que **la plupart des éditeurs** respectent (nativement ou par greffon) : il fixe indentation, fins de ligne, encodage et espaces de fin, pour éviter les diffs parasites entre contributeurs.

```ini .editorconfig
root = true

[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true
indent_style = space
indent_size = 2

[*.{py,md}]
indent_size = 4

[Makefile]
indent_style = tab
```

Un vérificateur (`editorconfig-checker`) permet d'en imposer le respect en CI.

## En pre-commit et en CI

```yaml .pre-commit-config.yaml
repos:
  - repo: https://github.com/koalaman/shellcheck-precommit
    rev: v0.x.x
    hooks: [ { id: shellcheck } ]
  - repo: https://github.com/scop/pre-commit-shfmt
    rev: v3.x.x
    hooks: [ { id: shfmt, args: ["-i", "2", "-ci"] } ]
  - repo: https://github.com/rhysd/actionlint
    rev: v1.x.x
    hooks: [ { id: actionlint } ]
  - repo: https://github.com/editorconfig-checker/editorconfig-checker.python
    rev: 3.x.x
    hooks: [ { id: editorconfig-checker } ]
```

`pre-commit` (le cadre Python) orchestre ces hooks localement et en CI (`pre-commit run --all-files`).

## Place parmi les autres linters

Ces outils complètent les linters de chaque langage (Ruff/Flake8 en Python, ESLint/Biome en JS, golangci-lint en Go, RuboCop en Ruby, clippy en Rust, hadolint pour Dockerfile, yamllint pour YAML). Une chaîne qualité typique combine : **format** automatique, **lint** du langage, **lint** des scripts et pipelines (ShellCheck, Actionlint), [[01-gitleaks-detect-secrets-trufflehog|secrets]] et [[02-iac-checkov-kics|IaC]].

## Choisir

| Cible | Outil |
| --- | --- |
| Scripts shell (erreurs) | ShellCheck |
| Scripts shell (format) | shfmt |
| Workflows GitHub Actions | Actionlint |
| Cohérence de style entre éditeurs | EditorConfig |

Commandes : [[90-aide-memoire|aide-mémoire]].
