---
title: "git add"
description: "PowerShell — git add (Gestion de version) : Indexe des changements ; -p choisit morceau par morceau."
tags: [powershell, commande, git]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Git |
| **Contexte** | Gestion de version |
| **Commande type** | `git add -p` |

## Rôle

Indexe des changements ; -p choisit morceau par morceau.

## En détail

Prépare des fichiers modifiés pour le prochain commit, en les plaçant dans la zone d'index. Étape avant git commit.

## Options

| Option | Rôle |
| --- | --- |
| `-A` | tout |
| `-u` | suivis seulement |
| `-p` | sélection interactive (hunks) |
| `.` | dossier courant |

## Exemples

**Tout indexer**

```powershell
git add -A
```

**Choisir les morceaux**

```powershell
git add -p
```

## Dans les autres shells

- [[27-commandes/01-bash/11-git/git-add|git add (Bash)]]
- [[27-commandes/03-macos/11-git/git-add|git add (macOS)]]

*Mots-clés : indexer stage ajouter modifications add git*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
