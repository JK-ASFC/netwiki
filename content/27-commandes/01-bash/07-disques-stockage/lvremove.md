---
title: "lvremove"
description: "Bash — lvremove (LVM - LV) : Supprime un Volume Logique."
tags: [bash, commande, disques-stockage]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Disques & stockage |
| **Contexte** | LVM - LV |
| **Commande type** | `lvremove vg0/lv0` |

## Rôle

Supprime un Volume Logique.

## Options

| Option | Rôle |
| --- | --- |
| ⚠️ `-f` | force (sans confirmation) |

> [!WARNING]
> Options à manier avec précaution : `-f`. Elles contournent une protection, détruisent des données ou agissent sans confirmation.

## Exemples

**Supprimer un LV**

```bash
lvremove volume1/smalldata
```

*Mots-clés : lvm lv supprimer logical volume lvremove lvremove*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
