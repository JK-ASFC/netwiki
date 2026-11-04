---
title: "docker stop / start"
description: "Bash — docker stop / start (Conteneurisation) : Arrête / relance / redémarre un conteneur."
tags: [bash, commande, docker]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
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

```bash
docker restart web
```

**Arrêter tous**

```bash
docker stop $(docker ps -q)
```

## Dans les autres shells

- [[27-commandes/02-powershell/07-docker/docker-stop-start|docker stop / start (PowerShell)]]
- [[27-commandes/03-macos/08-docker/docker-stop-start|docker stop / start (macOS)]]

*Mots-clés : arrêter démarrer relancer redémarrer stop start docker*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
