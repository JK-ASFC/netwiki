---
title: "alias"
description: "macOS — alias (Raccourcis de commandes) : Crée des raccourcis de commandes, ou liste ceux déjà définis."
tags: [macos, commande, environnement-variables]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Environnement & variables |
| **Contexte** | Raccourcis de commandes |
| **Commande type** | `alias` |

## Rôle

Crée des raccourcis de commandes, ou liste ceux déjà définis.

## Options

| Option | Rôle |
| --- | --- |
| `‹nom›='‹commande›'` | définit un alias (nom = commande) |
| `(~/.bashrc)` | à y ajouter pour le rendre permanent |
| `unalias ‹nom›` | supprime un alias |

## Exemples

**Lister**

```zsh
alias
```

**Créer ll**

```zsh
alias ll='ls -lah'
```

**Sécuriser rm**

```zsh
alias rm='rm -i'
```

## Dans les autres shells

- [[27-commandes/01-bash/09-environnement-variables/alias|alias (Bash)]]

*Mots-clés : alias raccourci commande abreviation shorthand unalias bashrc*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
