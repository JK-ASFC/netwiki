---
title: "git clone"
description: "macOS — git clone (Gestion de version) : Récupère un dépôt (--depth 1 = léger)."
tags: [macos, commande, git]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Git |
| **Contexte** | Gestion de version |
| **Commande type** | `git clone --depth 1 -b main <url>` |

## Rôle

Récupère un dépôt (--depth 1 = léger).

## En détail

Récupère une copie complète d'un dépôt distant (par exemple sur GitHub) sur votre machine. La première étape pour travailler sur un projet existant.

## Options

| Option | Rôle |
| --- | --- |
| `--depth ‹N›` | tronque |
| `-b ‹branche›` | branche |
| `--recurse-submodules` | sous-modules |

## Exemples

**Clone léger**

```zsh
git clone --depth 1 <url>
```

## Dans les autres shells

- [[27-commandes/01-bash/11-git/git-clone|git clone (Bash)]]
- [[27-commandes/02-powershell/10-git/git-clone|git clone (PowerShell)]]

*Mots-clés : cloner dépôt récupérer repository télécharger git*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
