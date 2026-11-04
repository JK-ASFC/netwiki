---
title: "git merge"
description: "Bash — git merge (Gestion de version) : Fusionne une branche dans la branche courante."
tags: [bash, commande, git]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Git |
| **Contexte** | Gestion de version |
| **Commande type** | `git merge feature/x` |

## Rôle

Fusionne une branche dans la branche courante.

## En détail

Fusionne le travail d'une branche dans une autre en combinant les modifications. L'étape pour intégrer une fonctionnalité terminée.

## Options

| Option | Rôle |
| --- | --- |
| `--no-ff` | commit de fusion explicite |
| `--squash` | aplati en un commit |
| `--abort` | annule la fusion |
| `--ff-only` | refuse si divergence |

## Exemples

**Fusion propre**

```bash
git merge --no-ff feature/x
```

**Annuler en conflit**

```bash
git merge --abort
```

## Dans les autres shells

- [[27-commandes/02-powershell/10-git/git-merge|git merge (PowerShell)]]
- [[27-commandes/03-macos/11-git/git-merge|git merge (macOS)]]

*Mots-clés : fusionner branche merge intégrer git*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
