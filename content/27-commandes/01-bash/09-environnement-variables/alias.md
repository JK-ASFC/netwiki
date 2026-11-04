---
title: "alias"
description: "Bash — alias (Raccourcis de commandes) : Crée des raccourcis de commandes, ou liste ceux déjà définis."
tags: [bash, commande, environnement-variables]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
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

```bash
alias
```

**Créer ll**

```bash
alias ll='ls -lah'
```

**Sécuriser rm**

```bash
alias rm='rm -i'
```

## Dans les autres shells

- [[27-commandes/03-macos/09-environnement-variables/alias|alias (macOS)]]

*Mots-clés : alias raccourci commande abreviation shorthand unalias bashrc*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
