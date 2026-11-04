---
title: "mysqlcheck"
description: "PowerShell — mysqlcheck (Maintenance / Intégrité) : Vérifie, répare et optimise les tables sous Windows."
tags: [powershell, commande, mysql]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | MySQL |
| **Contexte** | Maintenance / Intégrité |
| **Commande type** | `mysqlcheck.exe -u ‹utilisateur› -p --check ‹base›` |

## Rôle

Vérifie, répare et optimise les tables sous Windows.

## Options

| Option | Rôle |
| --- | --- |
| `-u ‹utilisateur›` | utilisateur |
| `-p` | mot de passe |
| `--check` | vérifie |
| `--repair` | répare |
| `--optimize` | optimise |
| `--analyze` | met à jour les statistiques |
| `--all-databases` | toutes les bases |
| `--auto-repair` | répare si erreur |

## Exemples

**Vérifier**

```powershell
mysqlcheck.exe -u root -p --check mabase
```

**Optimiser tout**

```powershell
mysqlcheck.exe -u root -p --optimize --all-databases
```

**Réparer**

```powershell
mysqlcheck.exe -u root -p --repair mabase clients
```

## Dans les autres shells

- [[27-commandes/01-bash/14-mysql/mysqlcheck|mysqlcheck (Bash)]]
- [[27-commandes/03-macos/14-mysql/mysqlcheck|mysqlcheck (macOS)]]

*Mots-clés : mysqlcheck vérifier réparer optimiser analyser table base windows wamp mysql*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
