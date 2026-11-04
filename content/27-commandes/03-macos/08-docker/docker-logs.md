---
title: "docker logs"
description: "macOS — docker logs (Analyse d'incidents) : Affiche la sortie d'un conteneur."
tags: [macos, commande, docker]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Docker |
| **Contexte** | Analyse d'incidents |
| **Commande type** | `docker logs -f --tail 100 app` |

## Rôle

Affiche la sortie d'un conteneur.

## En détail

Affiche les journaux d'un conteneur, c'est-a-dire ce qu'il écrit en sortie. -f pour suivre en direct. Indispensable pour debuguer.

## Options

| Option | Rôle |
| --- | --- |
| `-f` | suit |
| `--tail ‹N›` | N lignes |
| `-t` | horodatage |
| `--since` | depuis une durée |

## Exemples

**Suivre**

```zsh
docker logs -f web
```

**Depuis 10 min**

```zsh
docker logs --since 10m web
```

## Dans les autres shells

- [[27-commandes/01-bash/08-docker/docker-logs|docker logs (Bash)]]
- [[27-commandes/02-powershell/07-docker/docker-logs|docker logs (PowerShell)]]

*Mots-clés : logs sortie conteneur debug erreur suivre tail docker*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
