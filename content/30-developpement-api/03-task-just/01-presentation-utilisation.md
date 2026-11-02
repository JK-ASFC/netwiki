---
title: Présentation, installation et utilisation
description: Task (Taskfile.yml, Go) et Just (justfile, Rust) — lanceurs de tâches multiplate-formes pour documenter et automatiser les commandes d'un dépôt d'infrastructure (Ansible, Terraform, Docker, tests) : installation Windows, Linux, macOS, syntaxe, variables, dépendances entre tâches, fichiers .env, sources et générés (Task), recettes paramétrées (Just), intégration CI, et comparaison avec Make.
tags: [task, taskfile, just, justfile, make, automatisation, ci]
icon: info
---

Un dépôt d'infrastructure accumule des commandes longues (`ansible-playbook -i inventaires/prod …`, `terraform plan -var-file …`). **Task** et **Just** les rangent dans un fichier versionné, lisible et **identique sur Windows, Linux et macOS**, sans les pièges de `make` (tabulations, `.PHONY`, shell différent).

## Installation

| Système | Task | Just |
| --- | --- | --- |
| Linux (script) | `sh -c "$(curl --location https://taskfile.dev/install.sh)" -- -d -b ~/.local/bin` | `curl --proto '=https' --tlsv1.2 -sSf https://just.systems/install.sh \| bash -s -- --to ~/.local/bin` |
| Debian/Ubuntu | `sudo snap install task --classic` | `sudo apt install just` (Debian 13, Ubuntu 24.04+) |
| Fedora | `sudo dnf install go-task` | `sudo dnf install just` |
| Windows | `winget install Task.Task` | `winget install Casey.Just` |
| macOS | `brew install go-task` | `brew install just` |
| Autres | `go install github.com/go-task/task/v3/cmd/task@latest` | `cargo install just` |

## Task (`Taskfile.yml`)

```yaml
version: '3'
dotenv: ['.env']
vars:
  ENV: '{{.ENV | default "recette"}}'
tasks:
  lint:
    desc: Vérifier playbooks et code Terraform
    cmds:
      - ansible-lint
      - terraform -chdir=terraform fmt -check
  plan:
    desc: Plan Terraform pour l'environnement ENV
    deps: [lint]
    cmds:
      - terraform -chdir=terraform plan -var-file=env/{{.ENV}}.tfvars -out=plan.tfplan
  deploy:
    desc: Appliquer la configuration sur ENV
    prompt: Déployer sur {{.ENV}} ?
    cmds:
      - ansible-playbook -i inventaires/{{.ENV}} site.yml {{.CLI_ARGS}}
  image:
    sources: ['docker/**/*']
    generates: ['.image.done']
    cmds:
      - docker build -t registry.corp.exemple.fr/outils/collecteur:latest docker/
      - touch .image.done
```

```bash
task --list ; task plan ENV=prod ; task deploy ENV=prod -- --check --diff ; task image   # ignorée si rien n'a changé
```

## Just (`justfile`)

```text
set dotenv-load
env := "recette"

# Liste des recettes
default:
    @just --list

# Vérifier le code
lint:
    ansible-lint
    terraform -chdir=terraform fmt -check

# Déployer : just deploy prod --check
deploy cible=env *options: lint
    ansible-playbook -i inventaires/{{cible}} site.yml {{options}}

[windows]
nettoyer:
    Remove-Item -Recurse -Force .cache

[unix]
nettoyer:
    rm -rf .cache
```

```bash
just ; just deploy prod --check --diff ; just --dry-run deploy ; just --evaluate
```

Choix : **Task** pour les dépendances et le saut des tâches à jour (sources/générés), **Just** pour des recettes simples et paramétrées. Commandes : [[90-aide-memoire|aide-mémoire]].
