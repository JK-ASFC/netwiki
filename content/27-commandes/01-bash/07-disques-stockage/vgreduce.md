---
title: "vgreduce"
description: "Bash — vgreduce (LVM - VG) : Retire un PV d'un VG."
tags: [bash, commande, disques-stockage]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Disques & stockage |
| **Contexte** | LVM - VG |
| **Commande type** | `vgreduce vg0 /dev/sdc` |

## Rôle

Retire un PV d'un VG.

## Options

| Option | Rôle |
| --- | --- |
| ⚠️ `--removemissing` | retire les PV manquants (après panne) |

> [!WARNING]
> Options à manier avec précaution : `--removemissing`. Elles contournent une protection, détruisent des données ou agissent sans confirmation.

## Exemples

**Retirer un PV d'un VG**

```bash
vgreduce volume1 /dev/vdc
```

*Mots-clés : lvm vg réduire retirer vgreduce volume group vgreduce*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
