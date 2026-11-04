---
title: "git stash"
description: "Bash — git stash (Gestion de version) : Met de côté les modifications en cours."
tags: [bash, commande, git]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
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
| `push -m ‹message›` | remise nommée |

## Exemples

**Remiser**

```bash
git stash push -u -m "wip"
```

**Restaurer**

```bash
git stash pop
```

## Dans les autres shells

- [[27-commandes/02-powershell/10-git/git-stash|git stash (PowerShell)]]
- [[27-commandes/03-macos/11-git/git-stash|git stash (macOS)]]

*Mots-clés : remiser mettre de côté wip temporaire stash git*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
