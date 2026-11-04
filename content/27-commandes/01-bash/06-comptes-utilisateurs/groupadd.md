---
title: "groupadd"
description: "Bash — groupadd (Comptes / Groupes) : Crée un groupe local."
tags: [bash, commande, comptes-utilisateurs]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Comptes & utilisateurs |
| **Contexte** | Comptes / Groupes |
| **Commande type** | `groupadd developpeurs` |

## Rôle

Crée un groupe local.

## En détail

Crée un nouveau groupe. Les groupes servent à partager des permissions entre plusieurs utilisateurs.

## Options

| Option | Rôle |
| --- | --- |
| `-g ‹gid›` | GID fixe |
| `-r` | groupe système |

## Exemples

**Créer un groupe**

```bash
groupadd developpeurs
```

**GID précis**

```bash
groupadd -g 1500 developpeurs
```

**Groupe système**

```bash
groupadd -r svcaccts
```

*Mots-clés : créer groupe local gid groupadd*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
