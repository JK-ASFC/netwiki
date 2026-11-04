---
title: "docker compose"
description: "PowerShell — docker compose (Conteneurisation) : Orchestre une stack compose.yaml."
tags: [powershell, commande, docker]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
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

```powershell
docker compose up -d
```

**Logs d'un service**

```powershell
docker compose logs -f web
```

## Dans les autres shells

- [[27-commandes/01-bash/08-docker/docker-compose|docker compose (Bash)]]
- [[27-commandes/03-macos/08-docker/docker-compose|docker compose (macOS)]]

*Mots-clés : orchestration stack services up down yaml compose*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
