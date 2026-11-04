---
title: "git tag"
description: "Bash — git tag (Gestion de version / CI) : Marque un point de l'historique (versions, releases)."
tags: [bash, commande, git]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
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

```bash
git tag -a v1.0.0 -m "release 1.0"
```

**Pousser les tags**

```bash
git push --tags
```

## Dans les autres shells

- [[27-commandes/02-powershell/10-git/git-tag|git tag (PowerShell)]]
- [[27-commandes/03-macos/11-git/git-tag|git tag (macOS)]]

*Mots-clés : tag version release marqueur annoté git*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
