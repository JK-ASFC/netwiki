---
title: "tree"
description: "macOS — tree (Audit & scripts) : Visualise l'arborescence d'un dossier."
tags: [macos, commande, fichiers-texte]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Fichiers & texte |
| **Contexte** | Audit & scripts |
| **Commande type** | `tree -L 2` |

## Rôle

Visualise l'arborescence d'un dossier.

## En détail

Affiche l'arborescence d'un dossier sous forme d'arbre, avec ses sous-dossiers. Plus visuel que ls pour comprendre une structure.

## Options

| Option | Rôle |
| --- | --- |
| `-L ‹N›` | profondeur max |
| `-a` | caches |
| `-d` | dossiers seuls |
| `-I ‹motif›` | exclut un motif |

## Exemples

**Deux niveaux**

```zsh
tree -L 2
```

**Dossiers sans node_modules**

```zsh
tree -d -I node_modules
```

## Dans les autres shells

- [[27-commandes/01-bash/10-fichiers-texte/tree|tree (Bash)]]

*Mots-clés : arborescence dossier structure visualiser hiérarchie tree*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
