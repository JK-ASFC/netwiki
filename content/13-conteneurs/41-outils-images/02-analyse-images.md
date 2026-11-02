---
title: Dive, Hadolint et Dockle
description: Qualité des images conteneurs — Hadolint (analyse statique des Dockerfile et des commandes shell avec ShellCheck, règles DL et SC, .hadolint.yaml, CI et éditeurs), Dive (exploration des couches d'une image, fichiers ajoutés, espace gaspillé, score d'efficacité, mode CI) et Dockle (audit de bonnes pratiques et du CIS Docker Benchmark : utilisateur non root, secrets, HEALTHCHECK, signatures, codes CIS et DKL), installation Windows, Linux, macOS et Docker, et intégration en pipeline avec Trivy.
tags: [hadolint, dive, dockle, dockerfile, images, qualité, ci]
icon: info
---

| Outil | Analyse | Moment |
| --- | --- | --- |
| **Hadolint** | Le **Dockerfile** (avant construction) | Éditeur, CI |
| **Dive** | Les **couches** de l'image construite (taille, fichiers inutiles) | Optimisation |
| **Dockle** | L'image construite : **bonnes pratiques** et CIS | CI, avant publication |
| [[39-securite-kubernetes/01-audit-analyse\|Trivy]] | Vulnérabilités | CI, registre |

## Installation

| Outil | Windows | macOS | Linux / Docker |
| --- | --- | --- | --- |
| Hadolint | `scoop install hadolint` ou binaire | `brew install hadolint` | binaire GitHub ; `docker run --rm -i hadolint/hadolint < Dockerfile` |
| Dive | binaire GitHub | `brew install dive` | `.deb`/`.rpm` ; `docker run --rm -it -v /var/run/docker.sock:/var/run/docker.sock wagoodman/dive IMG` |
| Dockle | binaire GitHub | `brew install goodwithtech/r/dockle` | `.deb`/`.rpm` ; image `goodwithtech/dockle` |

## Utilisation

```bash
hadolint Dockerfile
hadolint --ignore DL3008 --failure-threshold warning Dockerfile
dive registry.corp.exemple.fr/infra/inventaire:1.8.2                # interface : Tab change de panneau, Ctrl+U fichiers modifiés
CI=true dive --lowestEfficiency=0.95 --highestWastedBytes=20MB IMG   # échec si l'image gaspille trop
dockle --exit-code 1 --exit-level warn registry.corp.exemple.fr/infra/inventaire:1.8.2
dockle --ignore CIS-DI-0005 IMG
```

```yaml
# .hadolint.yaml
ignored: [DL3008]
trustedRegistries: [registry.corp.exemple.fr, docker.io]
failure-threshold: warning
```

Corrections fréquentes : épingler les versions (`apt-get install paquet=version`), `--no-install-recommends` et nettoyage dans la même couche, `USER` non root, `HEALTHCHECK`, `COPY` plutôt qu'`ADD`, étapes multiples pour exclure les outils de compilation.

Suite : [[03-kompose|Kompose]] · [[90-aide-memoire|aide-mémoire]].
