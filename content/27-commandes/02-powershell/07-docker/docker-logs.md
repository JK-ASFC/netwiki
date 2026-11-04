---
title: "docker logs"
description: "PowerShell — docker logs (Analyse d'incidents) : Affiche la sortie d'un conteneur."
tags: [powershell, commande, docker]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
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

```powershell
docker logs -f web
```

**Depuis 10 min**

```powershell
docker logs --since 10m web
```

## Dans les autres shells

- [[27-commandes/01-bash/08-docker/docker-logs|docker logs (Bash)]]
- [[27-commandes/03-macos/08-docker/docker-logs|docker logs (macOS)]]

*Mots-clés : logs sortie conteneur debug erreur suivre tail docker*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
