---
title: "git stash"
description: "PowerShell — git stash (Gestion de version) : Met de côté les modifications en cours."
tags: [powershell, commande, git]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Git |
| **Contexte** | Gestion de version |
| **Commande type** | `git stash push -u -m "wip"` |

## Rôle

Met de côté les modifications en cours.

## En détail

Met de côté temporairement des modifications non terminées pour revenir à un état propre, puis les récupère plus tard.

## Options

| Option | Rôle |
| --- | --- |
| `push -u` | inclut les non-suivis |
| `pop` | restaure |
| `list` | liste |
| `drop` | supprime une remise |

## Exemples

**Remiser**

```powershell
git stash push -u -m "wip"
```

**Restaurer**

```powershell
git stash pop
```

## Dans les autres shells

- [[27-commandes/01-bash/11-git/git-stash|git stash (Bash)]]
- [[27-commandes/03-macos/11-git/git-stash|git stash (macOS)]]

*Mots-clés : remiser mettre de côté wip temporaire stash git*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
