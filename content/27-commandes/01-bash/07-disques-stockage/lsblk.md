---
title: "lsblk"
description: "Bash — lsblk (Gestion du stockage) : Disques, partitions, FS et montages."
tags: [bash, commande, disques-stockage]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Disques & stockage |
| **Contexte** | Gestion du stockage |
| **Commande type** | `lsblk -f` |

## Rôle

Disques, partitions, FS et montages.

## En détail

Liste les disques et leurs partitions sous forme d'arbre. Pour visualiser le matériel de stockage branche sur la machine.

## Options

| Option | Rôle |
| --- | --- |
| `-f` | FS, UUID, label |
| `-p` | chemins complets |
| `-o ‹colonnes›` | colonnes |
| `-d` | disques seuls |

## Exemples

**FS + UUID + montages**

```bash
lsblk -f
```

**Avec modèle**

```bash
lsblk -o NAME,SIZE,TYPE,MOUNTPOINT,MODEL
```

*Mots-clés : disque partition bloc montage uuid système de fichiers lsblk nvme*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
