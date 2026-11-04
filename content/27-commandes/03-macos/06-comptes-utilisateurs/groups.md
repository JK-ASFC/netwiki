---
title: "groups"
description: "macOS — groups (Groupes d'un compte) : Liste les groupes auxquels appartient un utilisateur."
tags: [macos, commande, comptes-utilisateurs]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Comptes & utilisateurs |
| **Contexte** | Groupes d'un compte |
| **Commande type** | `groups` |

## Rôle

Liste les groupes auxquels appartient un utilisateur.

## Options

| Option | Rôle |
| --- | --- |
| `(sans arg)` | groupes de l'utilisateur courant |
| `‹utilisateur›` | groupes d'un autre compte |
| `(équivalent) id -Gn ‹utilisateur›` | exactement la même sortie |
| `(interactif) id -p` | formulation recommandée par le manuel |
| `(membres) dscl . -read /Groups/‹groupe› GroupMembership` | sens inverse : qui est dans le groupe |

## Exemples

**Mes groupes**

```zsh
groups
```

**Ceux d'un autre**

```zsh
groups jean
```

**Vue lisible (interactif)**

```zsh
id -p
```

## Dans les autres shells

- [[27-commandes/01-bash/06-comptes-utilisateurs/groups|groups (Bash)]]

*Mots-clés : groupes appartenance groups utilisateur*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
