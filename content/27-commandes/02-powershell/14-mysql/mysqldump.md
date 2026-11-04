---
title: "mysqldump"
description: "PowerShell — mysqldump (Sauvegarde / Backup) : Exporte une base MySQL/MariaDB en script SQL sous Windows."
tags: [powershell, commande, mysql]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | MySQL |
| **Contexte** | Sauvegarde / Backup |
| **Commande type** | `mysqldump.exe -u ‹utilisateur› -p --single-transaction ‹base›` |

## Rôle

Exporte une base MySQL/MariaDB en script SQL sous Windows.

## Options

| Option | Rôle |
| --- | --- |
| `-u ‹utilisateur›` | utilisateur |
| `-p` | mot de passe (interactif) |
| `--single-transaction` | dump cohérent sans verrou (InnoDB) |
| `--all-databases` | toutes les bases |
| `--databases ‹b1 b2›` | bases nommées |
| `--routines` | procédures/fonctions |
| `--no-data` | structure seule |
| `--result-file=‹fichier.sql›` | écrit dans un fichier (évite les soucis d'encodage Windows) |

## Exemples

**Une base**

```powershell
mysqldump.exe -u root -p mabase --result-file=C:\backup\mabase.sql
```

**Toutes les bases**

```powershell
mysqldump.exe -u root -p --all-databases --result-file=C:\backup\full.sql
```

**Structure seule**

```powershell
mysqldump.exe -u root -p --no-data mabase
```

## Dans les autres shells

- [[27-commandes/01-bash/14-mysql/mysqldump|mysqldump (Bash)]]
- [[27-commandes/03-macos/14-mysql/mysqldump|mysqldump (macOS)]]

*Mots-clés : mysqldump sauvegarde backup export dump sql base données windows wamp mariadb*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
