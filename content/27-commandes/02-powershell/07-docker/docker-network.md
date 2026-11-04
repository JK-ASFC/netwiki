---
title: "docker network"
description: "PowerShell — docker network (Conteneurisation) : Gère les réseaux Docker (bridge, isolation)."
tags: [powershell, commande, docker]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Docker |
| **Contexte** | Conteneurisation |
| **Commande type** | `docker network ls` |

## Rôle

Gère les réseaux Docker (bridge, isolation).

## En détail

Gère les réseaux Docker : créer un réseau privé pour que des conteneurs communiquent entre eux par leur nom.

## Options

| Option | Rôle |
| --- | --- |
| `ls` | liste |
| `create` | crée un réseau |
| `inspect` | détails + conteneurs |
| `connect/disconnect` | attache/détache |

## Exemples

**Lister**

```powershell
docker network ls
```

**Réseau dédié**

```powershell
docker network create majordome-net
```

## Dans les autres shells

- [[27-commandes/01-bash/08-docker/docker-network|docker network (Bash)]]
- [[27-commandes/03-macos/08-docker/docker-network|docker network (macOS)]]

*Mots-clés : réseau network bridge isolation connecter docker*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
