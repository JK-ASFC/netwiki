---
title: "mysqlcheck"
description: "Bash — mysqlcheck (Maintenance / Intégrité) : Vérifie, répare et optimise les tables MySQL/MariaDB."
tags: [bash, commande, mysql]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | MySQL |
| **Contexte** | Maintenance / Intégrité |
| **Commande type** | `mysqlcheck -u ‹utilisateur› -p --check ‹base›` |

## Rôle

Vérifie, répare et optimise les tables MySQL/MariaDB.

## Options

| Option | Rôle |
| --- | --- |
| `-u ‹utilisateur›` | utilisateur |
| `-p` | mot de passe |
| `--check` | vérifie les tables |
| `--repair` | répare les tables corrompues |
| `--optimize` | optimise (défragmente) |
| `--analyze` | met à jour les statistiques |
| `--all-databases` | toutes les bases |
| `--auto-repair` | répare automatiquement si erreur |

## Exemples

**Vérifier une base**

```bash
mysqlcheck -u root -p --check mabase
```

**Optimiser tout**

```bash
mysqlcheck -u root -p --optimize --all-databases
```

**Réparer une table**

```bash
mysqlcheck -u root -p --repair mabase clients
```

## Dans les autres shells

- [[27-commandes/02-powershell/14-mysql/mysqlcheck|mysqlcheck (PowerShell)]]
- [[27-commandes/03-macos/14-mysql/mysqlcheck|mysqlcheck (macOS)]]

*Mots-clés : mysqlcheck vérifier réparer optimiser analyser table base mysql maintenance lamp*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
