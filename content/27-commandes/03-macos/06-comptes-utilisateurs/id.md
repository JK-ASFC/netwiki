---
title: "id"
description: "macOS — id (Identité utilisateur) : Affiche l'UID, le GID et les groupes de l'utilisateur."
tags: [macos, commande, comptes-utilisateurs]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Comptes & utilisateurs |
| **Contexte** | Identité utilisateur |
| **Commande type** | `id` |

## Rôle

Affiche l'UID, le GID et les groupes de l'utilisateur.

## En détail

Affiche l'identifiant d'un utilisateur et les groupes auxquels il appartient. Pratique pour vérifier des droits.

## Options

| Option | Rôle |
| --- | --- |
| `-u` | UID seul |
| `-g` | GID principal |
| `-G` | tous les GID |
| `-Gn` | noms des groupes |
| `‹utilisateur›` | cible un autre compte |

## Exemples

**Mon identité**

```zsh
id
```

**Mes groupes (noms)**

```zsh
id -Gn
```

**UID d'un autre**

```zsh
id -u jean
```

## Dans les autres shells

- [[27-commandes/01-bash/06-comptes-utilisateurs/id|id (Bash)]]

*Mots-clés : identité uid gid groupes id utilisateur*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
