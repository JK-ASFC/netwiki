---
title: "git show"
description: "Bash — git show (Git / Historique) : Affiche les détails et le diff d'un commit."
tags: [bash, commande, git]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Git |
| **Contexte** | Git / Historique |
| **Commande type** | `git show HEAD` |

## Rôle

Affiche les détails et le diff d'un commit.

## En détail

Affiche le détail d'un commit : son message et les modifications exactes qu'il contient.

## Options

| Option | Rôle |
| --- | --- |
| `--stat` | résume des fichiers |
| `--name-only` | fichiers seuls |
| `HEAD` | le dernier commit |
| `(commit)` | détails + diff |

## Exemples

**Le dernier**

```bash
git show HEAD
```

**Un commit**

```bash
git show 3f2a1c9
```

**Résume**

```bash
git show --stat HEAD
```

## Dans les autres shells

- [[27-commandes/02-powershell/10-git/git-show|git show (PowerShell)]]
- [[27-commandes/03-macos/11-git/git-show|git show (macOS)]]

*Mots-clés : détails commit diff afficher git show*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
