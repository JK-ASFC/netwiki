---
title: "git pull"
description: "PowerShell — git pull (Gestion de version) : Récupère et intègre (--rebase = linéaire)."
tags: [powershell, commande, git]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Git |
| **Contexte** | Gestion de version |
| **Commande type** | `git pull --rebase` |

## Rôle

Récupère et intègre (--rebase = linéaire).

## En détail

Récupère les modifications du dépôt distant et les intégré à votre copie locale. À faire pour rester à jour avec l'équipe.

## Options

| Option | Rôle |
| --- | --- |
| `--rebase` | rejoue au-dessus |
| `--ff-only` | refuse fusion |

## Exemples

**Pull propre**

```powershell
git pull --rebase
```

## Dans les autres shells

- [[27-commandes/01-bash/11-git/git-pull|git pull (Bash)]]
- [[27-commandes/03-macos/11-git/git-pull|git pull (macOS)]]

*Mots-clés : récupérer tirer mettre à jour fusion rebase pull git*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
