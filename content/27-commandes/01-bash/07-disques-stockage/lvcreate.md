---
title: "lvcreate"
description: "Bash — lvcreate (LVM - LV) : Crée un Volume Logique (LV) dans un VG."
tags: [bash, commande, disques-stockage]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Disques & stockage |
| **Contexte** | LVM - LV |
| **Commande type** | `lvcreate -L 10G -n lv0 vg0` |

## Rôle

Crée un Volume Logique (LV) dans un VG.

## Options

| Option | Rôle |
| --- | --- |
| `-L ‹taille (M/G/T)›` | taille fixe |
| `-l ‹N%/extents›` | en pourcentage ou extents (ex: 100%FREE) |
| `-n ‹nom›` | nom du LV |
| `-s` | crée un snapshot |

## Exemples

**Créer un LV**

```bash
lvcreate -L 752M -n smalldata volume1
```

**Tout l'espace libre**

```bash
lvcreate -l 100%FREE -n data volume1
```

*Mots-clés : lvm lv logical volume créer lvcreate taille lvcreate*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
