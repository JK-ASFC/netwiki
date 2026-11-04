---
title: "git revert"
description: "macOS — git revert (Git / Annulation) : Crée un nouveau commit qui annule un commit donne."
tags: [macos, commande, git]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Git |
| **Contexte** | Git / Annulation |
| **Commande type** | `git revert HEAD` |

## Rôle

Crée un nouveau commit qui annule un commit donne.

## En détail

Crée un nouveau commit qui defait proprement un commit précédent, sans réécrire l'historique. La façon sure d'annuler un changement déjà partagé.

## Options

| Option | Rôle |
| --- | --- |
| `--no-edit` | garde le message par défaut |
| `-n` | sans committer tout de suite |
| `HEAD` | le dernier commit |
| `(commit)` | crée un commit inverse |

## Exemples

**Le dernier**

```zsh
git revert HEAD
```

**Un commit précis**

```zsh
git revert 3f2a1c9
```

**Sans éditer**

```zsh
git revert --no-edit HEAD
```

## Dans les autres shells

- [[27-commandes/01-bash/11-git/git-revert|git revert (Bash)]]
- [[27-commandes/02-powershell/10-git/git-revert|git revert (PowerShell)]]

*Mots-clés : annuler inverse commit revert git*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
