---
title: "git revert"
description: "PowerShell — git revert (Git / Annulation) : Crée un nouveau commit qui annule un commit donne."
tags: [powershell, commande, git]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
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

```powershell
git revert HEAD
```

**Un commit précis**

```powershell
git revert 3f2a1c9
```

**Sans éditer**

```powershell
git revert --no-edit HEAD
```

## Dans les autres shells

- [[27-commandes/01-bash/11-git/git-revert|git revert (Bash)]]
- [[27-commandes/03-macos/11-git/git-revert|git revert (macOS)]]

*Mots-clés : annuler inverse commit revert git*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
