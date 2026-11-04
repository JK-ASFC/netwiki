---
title: "pvremove"
description: "Bash — pvremove (LVM - PV) : Retire un Volume Physique de LVM."
tags: [bash, commande, disques-stockage]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Disques & stockage |
| **Contexte** | LVM - PV |
| **Commande type** | `pvremove /dev/sdc` |

## Rôle

Retire un Volume Physique de LVM.

## Options

| Option | Rôle |
| --- | --- |
| `-f` | force |
| `-y` | oui |

## Exemples

**Retirer un PV**

```bash
pvremove /dev/vdc
```

*Mots-clés : lvm pv supprimer retirer pvremove physical volume pvremove*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
