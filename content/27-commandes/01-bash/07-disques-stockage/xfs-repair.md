---
title: "xfs_repair"
description: "Bash — xfs_repair (Réparation) : Vérifie et répare un système de fichiers XFS."
tags: [bash, commande, disques-stockage]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Disques & stockage |
| **Contexte** | Réparation |
| **Commande type** | `xfs_repair /dev/sdb1` |

## Rôle

Vérifie et répare un système de fichiers XFS.

## Options

| Option | Rôle |
| --- | --- |
| `-n` | vérifie sans rien modifier |
| ⚠️ `-L` | efface le journal (dernier recours) |
| `-v` | verbeux |

> [!WARNING]
> Options à manier avec précaution : `-L`. Elles contournent une protection, détruisent des données ou agissent sans confirmation.

## Exemples

**Vérifier**

```bash
xfs_repair -n /dev/sdb1
```

**Réparer**

```bash
xfs_repair /dev/vdb
```

*Mots-clés : xfs réparer vérifier fsck filesystem journal xfs_repair*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
