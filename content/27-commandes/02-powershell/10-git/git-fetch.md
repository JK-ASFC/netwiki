---
title: "git fetch"
description: "PowerShell — git fetch (Gestion de version / CI) : Récupère les refs distantes sans fusionner."
tags: [powershell, commande, git]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Git |
| **Contexte** | Gestion de version / CI |
| **Commande type** | `git fetch --all --prune` |

## Rôle

Récupère les refs distantes sans fusionner.

## En détail

Récupère les nouveautés du dépôt distant sans les fusionner tout de suite. Permet de voir ce qui a changé avant d'intégrer.

## Options

| Option | Rôle |
| --- | --- |
| `--all` | tous les remotes |
| `--prune` | nettoie les branches supprimées |
| `--tags` | récupère les tags |

## Exemples

**Mettre à jour les refs**

```powershell
git fetch --all --prune
```

## Dans les autres shells

- [[27-commandes/01-bash/11-git/git-fetch|git fetch (Bash)]]
- [[27-commandes/03-macos/11-git/git-fetch|git fetch (macOS)]]

*Mots-clés : récupérer distant refs fetch prune origin git*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
