---
title: "docker stop / start"
description: "macOS — docker stop / start (Conteneurisation) : Arrête / relance / redémarre un conteneur."
tags: [macos, commande, docker]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Docker |
| **Contexte** | Conteneurisation |
| **Commande type** | `docker restart app` |

## Rôle

Arrête / relance / redémarre un conteneur.

## En détail

Arrête proprement un conteneur (stop) ou relance un conteneur déjà créé (start), sans le recréer.

## Options

| Option | Rôle |
| --- | --- |
| `stop / start / restart` | sous-commande : arrêt propre (SIGTERM), démarrage ou redémarrage |
| `-t ‹N›` | délai (s) avant SIGKILL lors d'un stop ou restart |

## Exemples

**Redémarrer**

```zsh
docker restart web
```

**Arrêter tous**

```zsh
docker stop $(docker ps -q)
```

## Dans les autres shells

- [[27-commandes/01-bash/08-docker/docker-stop-start|docker stop / start (Bash)]]
- [[27-commandes/02-powershell/07-docker/docker-stop-start|docker stop / start (PowerShell)]]

*Mots-clés : arrêter démarrer relancer redémarrer stop start docker*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
