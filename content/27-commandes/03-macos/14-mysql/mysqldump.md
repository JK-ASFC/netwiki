---
title: "mysqldump"
description: "macOS — mysqldump (Sauvegarde / Backup) : Exporte une base MySQL/MariaDB en script SQL (sauvegarde)."
tags: [macos, commande, mysql]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | MySQL |
| **Contexte** | Sauvegarde / Backup |
| **Commande type** | `mysqldump -u ‹utilisateur› -p --single-transaction ‹base›` |

## Rôle

Exporte une base MySQL/MariaDB en script SQL (sauvegarde).

## Options

| Option | Rôle |
| --- | --- |
| `-u ‹utilisateur›` | utilisateur |
| `-p` | mot de passe (interactif) |
| `--single-transaction` | dump cohérent sans verrou (InnoDB) |
| `--all-databases` | toutes les bases |
| `--databases ‹b1 b2›` | bases nommées (avec CREATE DATABASE) |
| `--routines` | inclut procédures/fonctions |
| `--no-data` | structure seule (sans données) |
| `--triggers` | inclut les triggers |

## Exemples

**Une base**

```zsh
mysqldump -u root -p mabase > mabase.sql
```

**Toutes les bases**

```zsh
mysqldump -u root -p --all-databases > full.sql
```

**Structure seule**

```zsh
mysqldump -u root -p --no-data mabase > schema.sql
```

## Dans les autres shells

- [[27-commandes/01-bash/14-mysql/mysqldump|mysqldump (Bash)]]
- [[27-commandes/02-powershell/14-mysql/mysqldump|mysqldump (PowerShell)]]

*Mots-clés : mysqldump sauvegarde backup export dump sql base données mariadb lamp*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
