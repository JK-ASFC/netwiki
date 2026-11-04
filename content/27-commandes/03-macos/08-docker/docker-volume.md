---
title: "docker volume"
description: "macOS — docker volume (Conteneurisation) : Gère les volumes (données persistantes)."
tags: [macos, commande, docker]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Docker |
| **Contexte** | Conteneurisation |
| **Commande type** | `docker volume ls` |

## Rôle

Gère les volumes (données persistantes).

## En détail

Gère les volumes : un espace de stockage persistant qui survit à la suppression du conteneur, pour ne pas perdre les données.

## Options

| Option | Rôle |
| --- | --- |
| `ls` | liste |
| `create` | crée |
| `inspect` | détails + point de montage |
| `prune` | supprime les orphelins |

## Exemples

**Lister**

```zsh
docker volume ls
```

**Point de montage**

```zsh
docker volume inspect mon-volume
```

## Dans les autres shells

- [[27-commandes/01-bash/08-docker/docker-volume|docker volume (Bash)]]
- [[27-commandes/02-powershell/07-docker/docker-volume|docker volume (PowerShell)]]

*Mots-clés : volume données persistant stockage docker*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
