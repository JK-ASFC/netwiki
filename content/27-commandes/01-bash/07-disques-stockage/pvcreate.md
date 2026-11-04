---
title: "pvcreate"
description: "Bash — pvcreate (LVM - PV) : Initialise un disque/partition comme Volume Physique LVM."
tags: [bash, commande, disques-stockage]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Disques & stockage |
| **Contexte** | LVM - PV |
| **Commande type** | `pvcreate /dev/sdb` |

## Rôle

Initialise un disque/partition comme Volume Physique LVM.

## Options

| Option | Rôle |
| --- | --- |
| `-f` | force |
| `-y` | répond oui automatiquement |

## Exemples

**Créer des PV**

```bash
pvcreate /dev/vdb /dev/vdc
```

*Mots-clés : lvm pv physical volume pvcreate disque initialiser pvcreate*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
