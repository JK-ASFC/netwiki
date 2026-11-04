---
title: "orb (clone export import)"
description: "macOS — orb (clone export import) (Machines Linux / Copie & sauvegarde) : Duplique une machine, l'exporte vers un fichier (sauvegarde ou changement de Mac) ou l'importe depuis un fichier."
tags: [macos, commande, virtualisation]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Virtualisation |
| **Contexte** | Machines Linux / Copie & sauvegarde |
| **Commande type** | `orb clone ubuntu ubuntu-copy` |

## Rôle

Duplique une machine, l'exporte vers un fichier (sauvegarde ou changement de Mac) ou l'importe depuis un fichier.

## Options

| Option | Rôle |
| --- | --- |
| `clone / export / import` | sous-commande : dupliquer, exporter, importer |
| `‹source› ‹destination›` | clone : machine et nom de la copie ; export : machine et fichier |
| `‹archive›` | import : fichier archive à importer |
| `-n ‹nom›` | nom de la machine importée |

## Exemples

**Cloner**

```zsh
orb clone ubuntu ubuntu-copy
```

**Exporter vers un fichier**

```zsh
orb export ubuntu ubuntu.tar.zst
```

**Importer sous un autre nom**

```zsh
orb import -n new-name ubuntu.tar.zst
```

*Mots-clés : orbstack orb clone export import machine sauvegarde copie dupliquer archive*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
