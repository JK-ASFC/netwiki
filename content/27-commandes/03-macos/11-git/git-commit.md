---
title: "git commit"
description: "macOS — git commit (Gestion de version) : Enregistre l'index dans l'historique."
tags: [macos, commande, git]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Git |
| **Contexte** | Gestion de version |
| **Commande type** | `git commit -m "feat: ajout"` |

## Rôle

Enregistre l'index dans l'historique.

## En détail

Enregistre les modifications préparées dans l'historique, avec un message décrivant le changement. Crée un point de sauvegarde du code.

## Options

| Option | Rôle |
| --- | --- |
| `-m ‹message›` | message |
| `-a` | indexe les suivis |
| ⚠️ `--amend` | modifie le dernier |
| `--no-edit` | garde le message existant (avec --amend) |

> [!WARNING]
> Options à manier avec précaution : `--amend`. Elles contournent une protection, détruisent des données ou agissent sans confirmation.

## Exemples

**Message**

```zsh
git commit -m "fix: bug X"
```

**Corriger le dernier**

```zsh
git commit --amend --no-edit
```

## Dans les autres shells

- [[27-commandes/01-bash/11-git/git-commit|git commit (Bash)]]
- [[27-commandes/02-powershell/10-git/git-commit|git commit (PowerShell)]]

*Mots-clés : commit enregistrer message historique valider git*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
