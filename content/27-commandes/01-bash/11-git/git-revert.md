---
title: "git revert"
description: "Bash — git revert (Git / Annulation) : Crée un nouveau commit qui annule un commit donne."
tags: [bash, commande, git]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
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

```bash
git revert HEAD
```

**Un commit précis**

```bash
git revert 3f2a1c9
```

**Sans éditer**

```bash
git revert --no-edit HEAD
```

## Dans les autres shells

- [[27-commandes/02-powershell/10-git/git-revert|git revert (PowerShell)]]
- [[27-commandes/03-macos/11-git/git-revert|git revert (macOS)]]

*Mots-clés : annuler inverse commit revert git*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
