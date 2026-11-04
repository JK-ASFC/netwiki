---
title: "lvresize"
description: "Bash — lvresize (LVM - LV) : Redimensionne un Volume Logique (et son FS)."
tags: [bash, commande, disques-stockage]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Disques & stockage |
| **Contexte** | LVM - LV |
| **Commande type** | `lvresize -L 20G vg0/lv0` |

## Rôle

Redimensionne un Volume Logique (et son FS).

## Options

| Option | Rôle |
| --- | --- |
| `-L ‹±taille (M/G/T)›` | nouvelle taille (+N pour agrandir) |
| `-l ‹N%›` | en pourcentage |
| `-r` | redimensionne aussi le système de fichiers |

## Exemples

**Fixer la taille**

```bash
lvresize --size 752M volume1/smalldata
```

**Agrandir + FS**

```bash
lvresize -r -L +5G vg0/data
```

*Mots-clés : lvm lv redimensionner agrandir réduire lvresize taille lvresize*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
