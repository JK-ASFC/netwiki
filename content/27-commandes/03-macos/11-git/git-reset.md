---
title: "git reset"
description: "macOS — git reset (Gestion de version) : Annule / désindexe (--hard détruit)."
tags: [macos, commande, git]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Git |
| **Contexte** | Gestion de version |
| **Commande type** | `git reset --soft HEAD~1` |

## Rôle

Annule / désindexe (--hard détruit).

## En détail

Annule des modifications ou des commits en revenant à un état antérieur. Selon le mode, plus ou moins destructeur : à comprendre avant d'utiliser.

## Options

| Option | Rôle |
| --- | --- |
| `--soft` | garde index + travail |
| `--mixed` | désindexe (défaut) |
| ⚠️ `--hard` | détruit les changements |
| `HEAD~1` | un commit en arrière |

> [!WARNING]
> Options à manier avec précaution : `--hard`. Elles contournent une protection, détruisent des données ou agissent sans confirmation.

## Exemples

**Annuler le dernier commit**

```zsh
git reset --soft HEAD~1
```

**Désindexer un fichier**

```zsh
git reset chemin/fichier
```

## Dans les autres shells

- [[27-commandes/01-bash/11-git/git-reset|git reset (Bash)]]
- [[27-commandes/02-powershell/10-git/git-reset|git reset (PowerShell)]]

*Mots-clés : annuler revenir désindexer reset defaire git*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
