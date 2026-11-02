---
title: Présentation, installation et utilisation
description: Dagger et Earthly — pipelines portables exécutés dans des conteneurs (BuildKit), identiques sur le poste et dans n'importe quelle CI : Dagger (moteur, CLI, modules et fonctions en Go, Python ou TypeScript, dagger init, functions, call, shell, Daggerverse, cache, intégration GitHub Actions, GitLab CI et Jenkins) et Earthly (Earthfile, cibles, SAVE ARTIFACT, SAVE IMAGE, earthly +cible, satellites, état du projet), installation Windows, Linux, macOS et prérequis Docker ou Podman.
tags: [dagger, earthly, buildkit, ci, conteneurs, pipelines]
icon: info
---

Le défaut classique d'une CI : le pipeline n'existe qu'en YAML spécifique à la forge et ne se teste qu'en poussant des commits. **Dagger** et **Earthly** décrivent la construction une fois, l'exécutent dans des conteneurs via **BuildKit**, et la même commande tourne sur le poste et dans [[02-gitlab/03-ci-cd-runners|GitLab CI]], GitHub Actions ou [[05-jenkins/02-pipelines-agents|Jenkins]].

Prérequis commun : un moteur de conteneurs ([[01-docker/01-presentation-installation|Docker]], [[02-podman/01-presentation-installation|Podman]] ou nerdctl).

## Dagger

| Système | Installation |
| --- | --- |
| Linux | `curl -fsSL https://dl.dagger.io/dagger/install.sh \| BIN_DIR=$HOME/.local/bin sh` |
| macOS | `brew install dagger/tap/dagger` |
| Windows | `winget install Dagger.Cli` |

Le pipeline est du **code** (Go, Python, TypeScript…) organisé en *modules* exposant des **fonctions** :

```bash
dagger init --sdk=python --name=outils      # crée dagger.json et .dagger/
dagger functions                            # fonctions disponibles
dagger call lint --source=.                 # appel d'une fonction
dagger call construire --source=. publish --address=registry.corp.exemple.fr/infra/outils:1.0
dagger                                       # shell interactif (Dagger Shell)
```

```python
# .dagger/src/outils/main.py
import dagger
from dagger import dag, function, object_type

@object_type
class Outils:
    @function
    async def lint(self, source: dagger.Directory) -> str:
        return await (
            dag.container().from_("cytopia/ansible-lint")
            .with_directory("/src", source).with_workdir("/src")
            .with_exec(["ansible-lint"]).stdout()
        )
```

Dans une CI, l'étape se réduit à installer la CLI et lancer `dagger call …`. Modules réutilisables : **Daggerverse**.

## Earthly

```text
# Earthfile
VERSION 0.8
FROM python:3.12-slim
WORKDIR /src

deps:
    COPY requirements.txt .
    RUN pip install -r requirements.txt

test:
    FROM +deps
    COPY . .
    RUN pytest -q

image:
    FROM +deps
    COPY . .
    ENTRYPOINT ["python", "-m", "collecteur"]
    SAVE IMAGE --push registry.corp.exemple.fr/infra/collecteur:latest
```

```bash
earthly +test ; earthly --push +image ; earthly ls
```

Installation : `brew install earthly`, `winget install earthly.earthly` ou binaire GitHub.

> [!WARNING]
> En 2025, la société Earthly a annoncé l'arrêt du développement actif de l'outil. Vérifiez l'état du projet (forks communautaires) avant de l'adopter ; pour un nouveau projet, Dagger ou un simple Dockerfile multi-étapes avec [[03-task-just/01-presentation-utilisation|Task ou Just]] sont plus sûrs.

Commandes : [[90-aide-memoire|aide-mémoire]].
