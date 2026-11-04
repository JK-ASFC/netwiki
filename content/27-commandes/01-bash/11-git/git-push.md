---
title: "git push"
description: "Bash — git push (Gestion de version / CI) : Envoie les commits (-u lié l'upstream)."
tags: [bash, commande, git]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Git |
| **Contexte** | Gestion de version / CI |
| **Commande type** | `git push -u origin main` |

## Rôle

Envoie les commits (-u lié l'upstream).

## En détail

Envoie vos commits locaux vers le dépôt distant pour les partager. L'étape qui rend votre travail visible par les autres.

## Options

| Option | Rôle |
| --- | --- |
| `-u` | upstream |
| `--tags` | tags |
| `--force-with-lease` | force prudent |
| ⚠️ `-f` | force, réécrit |

> [!WARNING]
> Options à manier avec précaution : `-f`. Elles contournent une protection, détruisent des données ou agissent sans confirmation.

## Exemples

**Première fois**

```bash
git push -u origin main
```

**Forcer prudemment**

```bash
git push --force-with-lease
```

## Dans les autres shells

- [[27-commandes/02-powershell/10-git/git-push|git push (PowerShell)]]
- [[27-commandes/03-macos/11-git/git-push|git push (macOS)]]

*Mots-clés : envoyer pousser distant origin upstream push git*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
