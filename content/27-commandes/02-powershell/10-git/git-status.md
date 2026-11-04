---
title: "git status"
description: "PowerShell — git status (Gestion de version) : État du dépôt (court + branche)."
tags: [powershell, commande, git]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Git |
| **Contexte** | Gestion de version |
| **Commande type** | `git status -sb` |

## Rôle

État du dépôt (court + branche).

## En détail

Montre l'état du projet : fichiers modifiés, ajoutés ou prêts à être valides. La commande qu'on tape le plus souvent pour se repérer.

## Options

| Option | Rôle |
| --- | --- |
| `-s` | court |
| `-b` | branche/suivi |

## Exemples

**Vue compacte**

```powershell
git status -sb
```

## Dans les autres shells

- [[27-commandes/01-bash/11-git/git-status|git status (Bash)]]
- [[27-commandes/03-macos/11-git/git-status|git status (macOS)]]

*Mots-clés : état modifications staged branche status git*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
