---
title: "git diff"
description: "PowerShell — git diff (Gestion de version) : Différences (disque, index, entre branches)."
tags: [powershell, commande, git]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Git |
| **Contexte** | Gestion de version |
| **Commande type** | `git diff` |

## Rôle

Différences (disque, index, entre branches).

## En détail

Montre précisément ce qui a changé, ligne par ligne, par rapport à la dernière version enregistrée. Pour relire avant de valider.

## Options

| Option | Rôle |
| --- | --- |
| `--staged` | ce qui est indexé |
| `--stat` | résume |
| `--name-only` | noms seuls |
| `a..b` | entre deux refs |

## Exemples

**Ce qui est indexé**

```powershell
git diff --staged
```

**Entre deux branches**

```powershell
git diff main..dev
```

## Dans les autres shells

- [[27-commandes/01-bash/11-git/git-diff|git diff (Bash)]]
- [[27-commandes/03-macos/11-git/git-diff|git diff (macOS)]]

*Mots-clés : différences comparer changements staged diff git*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
