---
title: "which"
description: "macOS — which (Localiser une commande) : Donne le chemin de l'exécutable qui sera lancé pour une commande."
tags: [macos, commande, environnement-variables]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Environnement & variables |
| **Contexte** | Localiser une commande |
| **Commande type** | `which` |

## Rôle

Donne le chemin de l'exécutable qui sera lancé pour une commande.

## Options

| Option | Rôle |
| --- | --- |
| `-a` | tous les chemins correspondants |
| `(type ‹cmd›)` | indique si c'est un alias, une fonction ou un binaire |
| `(command -v ‹cmd›)` | version portable, pour les scripts |

## Exemples

**Chemin de python3**

```zsh
which python3
```

**Tous les emplacements**

```zsh
which -a python
```

**Tester dans un script**

```zsh
command -v docker
```

## Dans les autres shells

- [[27-commandes/01-bash/09-environnement-variables/which|which (Bash)]]

*Mots-clés : which localiser exécutable chemin path binaire type whereis command*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
