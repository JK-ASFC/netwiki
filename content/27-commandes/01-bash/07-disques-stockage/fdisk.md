---
title: "fdisk"
description: "Bash — fdisk (Partitionnement) : Crée/modifie des partitions (MBR/GPT), ou les liste."
tags: [bash, commande, disques-stockage]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Disques & stockage |
| **Contexte** | Partitionnement |
| **Commande type** | `fdisk -l` |

## Rôle

Crée/modifie des partitions (MBR/GPT), ou les liste.

## Options

| Option | Rôle |
| --- | --- |
| `-l` | liste les partitions |
| ⚠️ ` (sans -l : mode interactif sur le disque)` |  |

> [!WARNING]
> Options à manier avec précaution : ` (sans -l : mode interactif sur le disque)`. Elles contournent une protection, détruisent des données ou agissent sans confirmation.

## Exemples

**Lister**

```bash
fdisk -l
```

**Partitionner (interactif)**

```bash
fdisk /dev/sdb
```

*Mots-clés : partition fdisk disque mbr gpt table partitionner fdisk*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
