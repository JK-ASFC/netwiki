---
title: "git remote"
description: "macOS — git remote (Gestion de version) : Gère les dépôts distants (origin, upstream)."
tags: [macos, commande, git]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Git |
| **Contexte** | Gestion de version |
| **Commande type** | `git remote -v` |

## Rôle

Gère les dépôts distants (origin, upstream).

## En détail

Gère les dépôts distants associés à votre projet (leur adresse, leur nom comme origin). Pour savoir ou pousser et tirer.

## Options

| Option | Rôle |
| --- | --- |
| `-v` | liste avec URLs |
| `add nom url` | ajoute |
| `set-url` | change l'URL |
| `remove` | retire |

## Exemples

**Voir les remotes**

```zsh
git remote -v
```

**Ajouter un upstream**

```zsh
git remote add upstream <url>
```

## Dans les autres shells

- [[27-commandes/01-bash/11-git/git-remote|git remote (Bash)]]
- [[27-commandes/02-powershell/10-git/git-remote|git remote (PowerShell)]]

*Mots-clés : distant remote origin upstream url git*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
