---
title: "git blame"
description: "Bash — git blame (Git / Historique) : Montre qui a modifié chaque ligne d'un fichier."
tags: [bash, commande, git]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
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

```bash
git blame app.py
```

**Lignes 10-20**

```bash
git blame -L 10,20 app.py
```

**Avec emails**

```bash
git blame -e config.py
```

## Dans les autres shells

- [[27-commandes/02-powershell/10-git/git-blame|git blame (PowerShell)]]
- [[27-commandes/03-macos/11-git/git-blame|git blame (macOS)]]

*Mots-clés : responsable auteur ligne historique git blame*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
