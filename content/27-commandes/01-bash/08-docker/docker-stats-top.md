---
title: "docker stats / top"
description: "Bash — docker stats / top (Diagnostic) : Consommation CPU/MEM/IO en direct des conteneurs."
tags: [bash, commande, docker]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Docker |
| **Contexte** | Diagnostic |
| **Commande type** | `docker stats --no-stream` |

## Rôle

Consommation CPU/MEM/IO en direct des conteneurs.

## En détail

stats affiche en direct la consommation (CPU, RAM, réseau) des conteneurs ; top liste les processus à l'intérieur d'un conteneur.

## Options

| Option | Rôle |
| --- | --- |
| `stats / top` | sous-commande : stats = conso CPU/MEM en direct, top = processus d'un conteneur |
| `--no-stream` | une seule mesure puis rend la main (scriptable, avec stats) |
| `--format ‹modèle›` | personnalisé la sortie (ex : {{.Name}} {{.CPUPerc}}) |

## Exemples

**Conso instantanée**

```bash
docker stats --no-stream
```

**Processus d'un conteneur**

```bash
docker top web
```

## Dans les autres shells

- [[27-commandes/02-powershell/07-docker/docker-stats-top|docker stats / top (PowerShell)]]
- [[27-commandes/03-macos/08-docker/docker-stats-top|docker stats / top (macOS)]]

*Mots-clés : statistiques cpu mémoire performance stats top docker*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
