---
title: "docker cp"
description: "macOS — docker cp (Conteneurisation) : Copie des fichiers entre l'hôte et un conteneur."
tags: [macos, commande, docker]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Docker |
| **Contexte** | Conteneurisation |
| **Commande type** | `docker cp app:/etc/nginx/nginx.conf .` |

## Rôle

Copie des fichiers entre l'hôte et un conteneur.

## En détail

Copie des fichiers entre la machine hôte et un conteneur, dans un sens ou dans l'autre.

## Options

| Option | Rôle |
| --- | --- |
| `ctr:chemin .` | du conteneur vers l'hôte |
| `. ctr:chemin` | de l'hôte vers le conteneur |
| `-a` | préserve les droits |

## Exemples

**Extraire une conf**

```zsh
docker cp web:/etc/nginx/nginx.conf ./nginx.conf
```

**Injecter un fichier**

```zsh
docker cp ./app.conf web:/etc/app/
```

## Dans les autres shells

- [[27-commandes/01-bash/08-docker/docker-cp|docker cp (Bash)]]
- [[27-commandes/02-powershell/07-docker/docker-cp|docker cp (PowerShell)]]

*Mots-clés : copier fichier conteneur hôte extraire cp docker*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
