---
title: "git add"
description: "macOS — git add (Gestion de version) : Indexe des changements ; -p choisit morceau par morceau."
tags: [macos, commande, git]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
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

```zsh
git add -A
```

**Choisir les morceaux**

```zsh
git add -p
```

## Dans les autres shells

- [[27-commandes/01-bash/11-git/git-add|git add (Bash)]]
- [[27-commandes/02-powershell/10-git/git-add|git add (PowerShell)]]

*Mots-clés : indexer stage ajouter modifications add git*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
