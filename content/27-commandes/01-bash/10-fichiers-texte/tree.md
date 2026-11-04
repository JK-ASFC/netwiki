---
title: "tree"
description: "Bash — tree (Audit & scripts) : Visualise l'arborescence d'un dossier."
tags: [bash, commande, fichiers-texte]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
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

```bash
tree -L 2
```

**Dossiers sans node_modules**

```bash
tree -d -I node_modules
```

## Dans les autres shells

- [[27-commandes/03-macos/10-fichiers-texte/tree|tree (macOS)]]

*Mots-clés : arborescence dossier structure visualiser hiérarchie tree*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
