---
title: "at"
description: "macOS — at (Exécution différée (une fois)) : Planifie une commande pour UNE seule exécution future (contrairement à cron qui répète). On saisit les commandes puis Ctrl+D, ou on les passe par un tube."
tags: [macos, commande, automatisation]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Automatisation |
| **Contexte** | Exécution différée (une fois) |
| **Commande type** | `at now + 1 hour` |

## Rôle

Planifie une commande pour UNE seule exécution future (contrairement à cron qui répète). On saisit les commandes puis Ctrl+D, ou on les passe par un tube.

## Options

| Option | Rôle |
| --- | --- |
| `-l` | liste les tâches en attente (équivaut à atq) |
| `-d ‹id›` | supprime une tâche en attente (équivaut à atrm) |
| `-f ‹fichier›` | lit les commandes depuis un fichier |
| `-m` | envoie un mail à la fin de l'exécution |
| `-c ‹id›` | affiche le contenu d'une tâche programmée |

## Exemples

**Dans 5 minutes**

```zsh
echo "/usr/local/bin/backup.sh" | at now + 5 minutes
```

**Ce soir à 22h**

```zsh
at 22:00
```

**Demain matin**

```zsh
at 9:00 AM tomorrow
```

**À une date précise**

```zsh
at 10:00 2025-08-01
```

**Lister puis annuler**

```zsh
atq⏎atrm 3
```

## Dans les autres shells

- [[27-commandes/01-bash/04-automatisation/at|at (Bash)]]

*Mots-clés : at planifier diffère une fois batch atq atrm exécution future automatisation tâche ponctuelle*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
