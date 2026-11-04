---
title: "xfs_quota"
description: "Bash — xfs_quota (Quotas) : Gère les quotas disque sur un système XFS."
tags: [bash, commande, securite-acces]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Sécurité & accès |
| **Contexte** | Quotas |
| **Commande type** | `xfs_quota -x -c 'report' /mnt` |

## Rôle

Gère les quotas disque sur un système XFS.

## Options

| Option | Rôle |
| --- | --- |
| `-x` | mode expert (administration) |
| `-c ‹commande›` | commande à exécuter entre quotes |

## Exemples

**Rapport**

```bash
xfs_quota -x -c 'report' /mnt
```

**Limites user**

```bash
xfs_quota -x -c 'limit bsoft=100m bhard=500m john' /dev/vda1
```

*Mots-clés : quota xfs disque limite bsoft bhard utilisateur xfs_quota*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
