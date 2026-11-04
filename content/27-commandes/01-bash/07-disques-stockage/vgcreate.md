---
title: "vgcreate"
description: "Bash — vgcreate (LVM - VG) : Crée un Groupe de Volumes (VG) à partir de PV."
tags: [bash, commande, disques-stockage]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Disques & stockage |
| **Contexte** | LVM - VG |
| **Commande type** | `vgcreate vg0 /dev/sdb` |

## Rôle

Crée un Groupe de Volumes (VG) à partir de PV.

## Options

| Option | Rôle |
| --- | --- |
| `-s ‹taille PE›` | taille des extents physiques |

## Exemples

**Créer un VG**

```bash
vgcreate volume1 /dev/vdb
```

*Mots-clés : lvm vg volume group créer vgcreate groupe vgcreate*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
