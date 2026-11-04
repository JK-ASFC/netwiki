---
title: "docker ps"
description: "Bash — docker ps (Conteneurisation) : Liste les conteneurs (-a inclut les arrêtés)."
tags: [bash, commande, docker]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Docker |
| **Contexte** | Conteneurisation |
| **Commande type** | `docker ps -a` |

## Rôle

Liste les conteneurs (-a inclut les arrêtés).

## En détail

Liste les conteneurs en cours d'exécution (avec -a, aussi ceux arrêtés). Le point de départ pour savoir ce qui tourne.

## Options

| Option | Rôle |
| --- | --- |
| `-a` | tous |
| `-q` | IDs seuls |
| `--filter` | ex. status=exited |
| `--format` | sortie perso |

## Exemples

**Tableau compact**

```bash
docker ps -a --format "table {{.Names}}\t{{.Status}}"
```

**IDs seuls**

```bash
docker ps -aq
```

## Dans les autres shells

- [[27-commandes/02-powershell/07-docker/docker-ps|docker ps (PowerShell)]]
- [[27-commandes/03-macos/08-docker/docker-ps|docker ps (macOS)]]

*Mots-clés : conteneur lister état running arrêté container ps docker*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
