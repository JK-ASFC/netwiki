---
title: "git config"
description: "PowerShell — git config (Git / Configuration) : Lit et définit la configuration Git."
tags: [powershell, commande, git]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Git |
| **Contexte** | Git / Configuration |
| **Commande type** | `git config --global user.name "Jean Dupont"` |

## Rôle

Lit et définit la configuration Git.

## En détail

Définit la configuration de Git, à commencer par votre nom et votre email qui apparaîtront sur chaque commit.

## Options

| Option | Rôle |
| --- | --- |
| `--global` | pour l'utilisateur |
| `--local` | pour le dépôt |
| `--list` | affiche toute la config |
| `user.email` | adresse de commit |

## Exemples

**Nom**

```powershell
git config --global user.name "Jean Dupont"
```

**Email**

```powershell
git config --global user.email "jean@mail.com"
```

**Tout afficher**

```powershell
git config --list
```

## Dans les autres shells

- [[27-commandes/01-bash/11-git/git-config|git config (Bash)]]
- [[27-commandes/03-macos/11-git/git-config|git config (macOS)]]

*Mots-clés : configurer identité nom email global git config*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
