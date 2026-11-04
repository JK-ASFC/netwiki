---
title: "git switch / checkout"
description: "Bash — git switch / checkout (Gestion de version) : Change de branche (switch) ou restaure des fichiers."
tags: [bash, commande, git]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
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

```bash
git switch -c feature/login
```

**Revenir à la précédente**

```bash
git switch -
```

## Dans les autres shells

- [[27-commandes/02-powershell/10-git/git-switch-checkout|git switch / checkout (PowerShell)]]
- [[27-commandes/03-macos/11-git/git-switch-checkout|git switch / checkout (macOS)]]

*Mots-clés : changer branche basculer checkout switch créer git*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
