---
title: "docker compose"
description: "Bash — docker compose (Conteneurisation) : Orchestre une stack compose.yaml."
tags: [bash, commande, docker]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Docker |
| **Contexte** | Conteneurisation |
| **Commande type** | `docker compose up -d --build` |

## Rôle

Orchestre une stack compose.yaml.

## En détail

Démarre et gère plusieurs conteneurs décrits dans un seul fichier (docker-compose.yml). Pratique pour une appli composée de plusieurs services.

## Options

| Option | Rôle |
| --- | --- |
| `up -d` | démarre détaché |
| `down` | arrête/supprime |
| `--build` | reconstruit |
| `logs -f` | suit |
| `ps` | état |

## Exemples

**Démarrer**

```bash
docker compose up -d
```

**Logs d'un service**

```bash
docker compose logs -f web
```

## Dans les autres shells

- [[27-commandes/02-powershell/07-docker/docker-compose|docker compose (PowerShell)]]
- [[27-commandes/03-macos/08-docker/docker-compose|docker compose (macOS)]]

*Mots-clés : orchestration stack services up down yaml compose*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
