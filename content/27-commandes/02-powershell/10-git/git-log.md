---
title: "git log"
description: "PowerShell — git log (Gestion de version) : Historique condensé avec graphe."
tags: [powershell, commande, git]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Git |
| **Contexte** | Gestion de version |
| **Commande type** | `git log --oneline --graph --all` |

## Rôle

Historique condensé avec graphe.

## En détail

Affiche l'historique des commits : qui a changé quoi et quand. --oneline pour une vue compacte.

## Options

| Option | Rôle |
| --- | --- |
| `--oneline` | 1 ligne/commit |
| `--graph` | arbre |
| `--all` | toutes branches |
| `-p` | diffs |

## Exemples

**Graphe**

```powershell
git log --oneline --graph --all
```

**Historique d'un fichier**

```powershell
git log -p -- chemin
```

## Dans les autres shells

- [[27-commandes/01-bash/11-git/git-log|git log (Bash)]]
- [[27-commandes/03-macos/11-git/git-log|git log (macOS)]]

*Mots-clés : historique commits graphe journal log git*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
