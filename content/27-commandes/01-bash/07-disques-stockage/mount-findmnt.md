---
title: "mount / findmnt"
description: "Bash — mount / findmnt (Gestion du stockage) : Monte un FS ou inspecte les montages."
tags: [bash, commande, disques-stockage]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Disques & stockage |
| **Contexte** | Gestion du stockage |
| **Commande type** | `findmnt` |

## Rôle

Monte un FS ou inspecte les montages.

## En détail

mount rattache un disque ou une partition à un dossier pour y accéder ; findmnt affiche ce qui est actuellement monte et à quel endroit.

## Options

| Option | Rôle |
| --- | --- |
| `-t ‹type›` | système de fichiers (ext4, nfs) |
| `-o ‹options›` | options (ro, noexec...) |
| `-a` | monte tout (fstab) |
| `--bind` | remonte un dossier ailleurs |

## Exemples

**Voir les montages**

```bash
findmnt
```

**Lecture seule**

```bash
sudo mount -o ro /dev/sdb1 /mnt
```

*Mots-clés : monter partition système de fichiers nas findmnt mount nfs*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
