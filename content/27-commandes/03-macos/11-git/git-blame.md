---
title: "git blame"
description: "macOS — git blame (Git / Historique) : Montre qui a modifié chaque ligne d'un fichier."
tags: [macos, commande, git]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Git |
| **Contexte** | Git / Historique |
| **Commande type** | `git blame app.py` |

## Rôle

Montre qui a modifié chaque ligne d'un fichier.

## En détail

Indique, pour chaque ligne d'un fichier, qui l'a modifiée et dans quel commit. Sert à comprendre l'origine d'un changement.

## Options

| Option | Rôle |
| --- | --- |
| `-L ‹début,fin›` | limite à des lignes |
| `-e` | affiche les emails |
| `-w` | ignore les espaces |
| `(fichier)` | annotation ligne à ligne |

## Exemples

**Tout le fichier**

```zsh
git blame app.py
```

**Lignes 10-20**

```zsh
git blame -L 10,20 app.py
```

**Avec emails**

```zsh
git blame -e config.py
```

## Dans les autres shells

- [[27-commandes/01-bash/11-git/git-blame|git blame (Bash)]]
- [[27-commandes/02-powershell/10-git/git-blame|git blame (PowerShell)]]

*Mots-clés : responsable auteur ligne historique git blame*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
