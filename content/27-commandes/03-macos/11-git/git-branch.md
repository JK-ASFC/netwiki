---
title: "git branch"
description: "macOS — git branch (Gestion de version) : Gère les branches ; -vv montre le suivi distant."
tags: [macos, commande, git]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Git |
| **Contexte** | Gestion de version |
| **Commande type** | `git branch -vv` |

## Rôle

Gère les branches ; -vv montre le suivi distant.

## En détail

Liste, crée ou supprime des branches : des lignes de travail parallèles pour développer sans toucher au code principal.

## Options

| Option | Rôle |
| --- | --- |
| `-a` | locales + distantes |
| `-vv` | dernier commit + upstream |
| `-d ‹branche›` | supprime si fusionnée |
| ⚠️ `-D ‹branche›` | supprime de force |
| `-m ‹nouveau nom›` | renomme |

> [!WARNING]
> Options à manier avec précaution : `-D ‹branche›`. Elles contournent une protection, détruisent des données ou agissent sans confirmation.

## Exemples

**Suivi distant**

```zsh
git branch -vv
```

**Supprimer fusionnée**

```zsh
git branch -d feature/x
```

## Dans les autres shells

- [[27-commandes/01-bash/11-git/git-branch|git branch (Bash)]]
- [[27-commandes/02-powershell/10-git/git-branch|git branch (PowerShell)]]

*Mots-clés : branche créer supprimer renommer lister branch git*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
