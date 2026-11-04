---
title: "git remote"
description: "Bash — git remote (Gestion de version) : Gère les dépôts distants (origin, upstream)."
tags: [bash, commande, git]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
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

```bash
git remote -v
```

**Ajouter un upstream**

```bash
git remote add upstream <url>
```

## Dans les autres shells

- [[27-commandes/02-powershell/10-git/git-remote|git remote (PowerShell)]]
- [[27-commandes/03-macos/11-git/git-remote|git remote (macOS)]]

*Mots-clés : distant remote origin upstream url git*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
