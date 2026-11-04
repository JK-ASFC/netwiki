---
title: "mdadm"
description: "Bash — mdadm (RAID logiciel) : Crée et gère des grappes RAID logicielles."
tags: [bash, commande, disques-stockage]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Disques & stockage |
| **Contexte** | RAID logiciel |
| **Commande type** | `mdadm --create /dev/md0 --level=1 --raid-devices=2 /dev/sdb /dev/sdc` |

## Rôle

Crée et gère des grappes RAID logicielles.

## Options

| Option | Rôle |
| --- | --- |
| `--create ‹/dev/mdN›` | crée une grappe |
| `--level ‹niveau›` | niveau RAID (0,1,5,6,10) |
| `--raid-devices ‹N›` | nombre de disques |
| `--detail ‹/dev/mdN›` | détails d'une grappe |
| `--assemble` | assemble une grappe existante |
| `--stop ‹/dev/mdN›` | arrête une grappe |

## Exemples

**RAID 1 (miroir)**

```bash
mdadm --create /dev/md0 --level=1 --raid-devices=2 /dev/vdb /dev/vdc
```

**État**

```bash
mdadm --detail /dev/md0
```

*Mots-clés : raid mdadm grappe array miroir parité md mdadm*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
