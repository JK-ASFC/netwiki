---
title: "git push"
description: "PowerShell — git push (Gestion de version / CI) : Envoie les commits (-u lié l'upstream)."
tags: [powershell, commande, git]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
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

```powershell
git push -u origin main
```

**Forcer prudemment**

```powershell
git push --force-with-lease
```

## Dans les autres shells

- [[27-commandes/01-bash/11-git/git-push|git push (Bash)]]
- [[27-commandes/03-macos/11-git/git-push|git push (macOS)]]

*Mots-clés : envoyer pousser distant origin upstream push git*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
