---
title: "docker build"
description: "Bash — docker build (Conteneurisation) : Construit une image depuis un Dockerfile."
tags: [bash, commande, docker]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Docker |
| **Contexte** | Conteneurisation |
| **Commande type** | `docker build -t app:latest .` |

## Rôle

Construit une image depuis un Dockerfile.

## En détail

Construit une image à partir d'un Dockerfile, la recette de l'application. L'étape avant de pouvoir lancer son propre conteneur.

## Options

| Option | Rôle |
| --- | --- |
| `-t ‹nom:tag›` | nomme/tague |
| `-f ‹Dockerfile›` | Dockerfile |
| `--no-cache` | ignore cache |
| `--build-arg` | variable |

## Exemples

**Builder**

```bash
docker build -t app:1.0 .
```

**Sans cache**

```bash
docker build --no-cache -t app:1.0 .
```

## Dans les autres shells

- [[27-commandes/02-powershell/07-docker/docker-build|docker build (PowerShell)]]
- [[27-commandes/03-macos/08-docker/docker-build|docker build (macOS)]]

*Mots-clés : image construire dockerfile tag compiler build docker*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
