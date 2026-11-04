---
title: "head"
description: "macOS — head (Analyse de logs) : Début d'un fichier (N premières lignes)."
tags: [macos, commande, fichiers-texte]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Fichiers & texte |
| **Contexte** | Analyse de logs |
| **Commande type** | `head -n 20 fichier` |

## Rôle

Début d'un fichier (N premières lignes).

## En détail

Affiche les premières lignes d'un fichier. Pratique pour jeter un oeil au début d'un gros fichier.

## Options

| Option | Rôle |
| --- | --- |
| `-n ‹N›` | N premières lignes |
| `-c ‹N›` | N premiers octets |
| `-q` | sans en-tête multi-fichiers |

## Exemples

**20 premières**

```zsh
head -n 20 access.log
```

## Dans les autres shells

- [[27-commandes/01-bash/10-fichiers-texte/head|head (Bash)]]

*Mots-clés : logs début premières lignes head aperçu*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
