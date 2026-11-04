---
title: "dmsetup"
description: "Bash — dmsetup (LVM) : Pilote bas niveau du device mapper : inspecte les périphériques virtuels créés par LVM, LUKS ou multipath."
tags: [bash, commande, disques-stockage]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Disques & stockage |
| **Contexte** | LVM |
| **Commande type** | `dmsetup ls` |

## Rôle

Pilote bas niveau du device mapper : inspecte les périphériques virtuels créés par LVM, LUKS ou multipath.

## Options

| Option | Rôle |
| --- | --- |
| `ls` | liste les périphériques device-mapper actifs |
| `info` | état détaillé : état, nombre d'ouvertures, numéros majeur:mineur |
| `table` | affiche la TABLE de correspondance : cible, secteurs et périphériques sous-jacents |
| `deps` | liste les périphériques dont celui-ci dépend |
| `status` | état d'avancement des cibles (synchronisation de miroir, remplissage de snapshot) |
| `--tree` | affiche l'arborescence des dépendances |
| ⚠️ `remove` | SUPPRIME un périphérique device-mapper (danger : le volume disparaît) |
| ⚠️ `remove_all` | supprime TOUS les périphériques device-mapper inactifs |

> [!WARNING]
> Options à manier avec précaution : `remove`, `remove_all`. Elles contournent une protection, détruisent des données ou agissent sans confirmation.

## Exemples

**Lister**

```bash
sudo dmsetup ls
```

**Voir la table**

```bash
sudo dmsetup table
```

**Arborescence**

```bash
sudo dmsetup ls --tree
```

**État d'un volume**

```bash
sudo dmsetup info /dev/mapper/vg0-data
```

*Mots-clés : device mapper dm lvm luks multipath table bas niveau dépannage*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
