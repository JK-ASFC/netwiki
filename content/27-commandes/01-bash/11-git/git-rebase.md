---
title: "git rebase"
description: "Bash — git rebase (Gestion de version) : Réécrit l'historique (squash, reorder)."
tags: [bash, commande, git]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Git |
| **Contexte** | Gestion de version |
| **Commande type** | `git rebase -i HEAD~3` |

## Rôle

Réécrit l'historique (squash, reorder).

## En détail

Rejoue vos commits par-dessus une autre branche pour obtenir un historique linéaire et propre. Plus avance, à manier avec soin.

## Options

| Option | Rôle |
| --- | --- |
| `-i` | interactif |
| `--onto` | change la base |
| `--continue` | après conflit |
| `--abort` | annule tout |

## Exemples

**Nettoyer 3 commits**

```bash
git rebase -i HEAD~3
```

**Continuer après conflit**

```bash
git rebase --continue
```

## Dans les autres shells

- [[27-commandes/02-powershell/10-git/git-rebase|git rebase (PowerShell)]]
- [[27-commandes/03-macos/11-git/git-rebase|git rebase (macOS)]]

*Mots-clés : réécrire historique squash interactif rebase git*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
