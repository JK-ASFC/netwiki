---
title: "git switch / checkout"
description: "macOS — git switch / checkout (Gestion de version) : Change de branche (switch) ou restaure des fichiers."
tags: [macos, commande, git]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Git |
| **Contexte** | Gestion de version |
| **Commande type** | `git switch -c feature/x` |

## Rôle

Change de branche (switch) ou restaure des fichiers.

## En détail

Change de branche pour travailler sur une autre version du projet. switch est la commande moderne, checkout l'historique.

## Options

| Option | Rôle |
| --- | --- |
| `switch br` | va sur une branche |
| `-c ‹branche›` | crée + bascule |
| `checkout -- f` | restaure un fichier |
| `switch -` | branche précédente |

## Exemples

**Nouvelle branche**

```zsh
git switch -c feature/login
```

**Revenir à la précédente**

```zsh
git switch -
```

## Dans les autres shells

- [[27-commandes/01-bash/11-git/git-switch-checkout|git switch / checkout (Bash)]]
- [[27-commandes/02-powershell/10-git/git-switch-checkout|git switch / checkout (PowerShell)]]

*Mots-clés : changer branche basculer checkout switch créer git*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
