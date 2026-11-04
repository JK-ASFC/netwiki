---
title: "groupmod"
description: "Bash — groupmod (Comptes / Groupes) : Modifie un groupe existant (nom, GID)."
tags: [bash, commande, comptes-utilisateurs]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Comptes & utilisateurs |
| **Contexte** | Comptes / Groupes |
| **Commande type** | `groupmod -n devops dev` |

## Rôle

Modifie un groupe existant (nom, GID).

## En détail

Modifie un groupe existant : le renommer ou changer son identifiant.

## Options

| Option | Rôle |
| --- | --- |
| `-n ‹nouveau nom›` | renomme le groupe |
| `-g ‹gid›` | change le GID |

## Exemples

**Renommer**

```bash
groupmod -n devops dev
```

**Changer le GID**

```bash
groupmod -g 1600 devops
```

**Vérifier**

```bash
getent group devops
```

*Mots-clés : modifier groupe nom gid groupmod*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
