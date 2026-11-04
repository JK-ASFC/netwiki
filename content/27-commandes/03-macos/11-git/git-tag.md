---
title: "git tag"
description: "macOS — git tag (Gestion de version / CI) : Marque un point de l'historique (versions, releases)."
tags: [macos, commande, git]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Git |
| **Contexte** | Gestion de version / CI |
| **Commande type** | `git tag -a v1.0.0 -m "release"` |

## Rôle

Marque un point de l'historique (versions, releases).

## En détail

Pose une étiquette sur un commit, typiquement pour marquer une version (v1.0). Sert à retrouver facilement les releases.

## Options

| Option | Rôle |
| --- | --- |
| `-a` | tag annoté |
| `-m ‹message›` | message |
| `-l` | liste |
| `-d` | supprime |
| `push --tags` | pousse les tags |

## Exemples

**Tag annoté**

```zsh
git tag -a v1.0.0 -m "release 1.0"
```

**Pousser les tags**

```zsh
git push --tags
```

## Dans les autres shells

- [[27-commandes/01-bash/11-git/git-tag|git tag (Bash)]]
- [[27-commandes/02-powershell/10-git/git-tag|git tag (PowerShell)]]

*Mots-clés : tag version release marqueur annoté git*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
