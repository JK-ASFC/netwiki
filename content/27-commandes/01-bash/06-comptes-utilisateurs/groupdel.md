---
title: "groupdel"
description: "Bash — groupdel (Comptes / Groupes) : Supprime un groupe local."
tags: [bash, commande, comptes-utilisateurs]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Comptes & utilisateurs |
| **Contexte** | Comptes / Groupes |
| **Commande type** | `groupdel developpeurs` |

## Rôle

Supprime un groupe local.

## En détail

Supprime un groupe, une fois qu'aucun fichier important ne lui appartient plus.

## Options

| Option | Rôle |
| --- | --- |
| `(arg)` | nom du groupe |

## Exemples

**Supprimer**

```bash
groupdel developpeurs
```

**Vérifier d'abord**

```bash
getent group developpeurs
```

**Lister**

```bash
getent group
```

*Mots-clés : supprimer groupe local groupdel*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
