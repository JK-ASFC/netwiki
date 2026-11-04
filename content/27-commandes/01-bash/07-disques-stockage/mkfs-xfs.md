---
title: "mkfs.xfs"
description: "Bash — mkfs.xfs (Formatage) : Crée un système de fichiers XFS sur une partition."
tags: [bash, commande, disques-stockage]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Disques & stockage |
| **Contexte** | Formatage |
| **Commande type** | `mkfs.xfs /dev/sdb1` |

## Rôle

Crée un système de fichiers XFS sur une partition.

## Options

| Option | Rôle |
| --- | --- |
| `-L ‹label›` | étiquette du volume (12 caractères maximum) |
| ⚠️ `-f` | FORCE : écrase un système de fichiers existant sans demander |
| `-b size= ‹taille (4096)›` | taille de bloc en octets (512 à 65536, 4096 par défaut) |
| `-d ‹agcount=4,su=,sw=›` | section DONNÉES : agcount (groupes d'allocation = parallélisme), su/sw (alignement RAID), size, name, file |
| `-i ‹size=512,maxpct=25›` | INODES : size (taille), maxpct (part max du FS), sparse, attr |
| `-l ‹size=64m,internal›` | JOURNAL (log) : taille, internal/logdev=... pour un journal externe, sunit, lazy-count |
| `-m ‹crc=1,reflink=1›` | MÉTADONNÉES : crc (sommes de contrôle), reflink (copies légères), finobt, uuid, bigtime |
| `-n ‹size=8192,ftype=1›` | NOMMAGE (répertoires) : taille des blocs d'annuaire, ftype, version, ci (insensible à la casse) |
| `-r ‹extsize=,rtdev=›` | section TEMPS RÉEL : périphérique et taille d'extent dédiés (usage spécialisé) |
| `-s size= ‹taille secteur›` | taille de secteur logique (512 ou 4096 : à aligner sur le disque) |
| `-c options= ‹fichier›` | charge les options depuis un fichier de configuration |
| `-K` | n'envoie PAS de discard/TRIM au périphérique (formatage plus rapide sur SSD) |
| `-N` | SIMULATION : affiche les paramètres calculés sans rien écrire |
| `-p ‹fichier prototype›` | pré-remplit le FS d'après un fichier de description |
| `-q` | mode silencieux (n'affiche pas le récapitulatif) |
| `-V` | affiche la version de mkfs.xfs |

> [!WARNING]
> Options à manier avec précaution : `-f`. Elles contournent une protection, détruisent des données ou agissent sans confirmation.

## Exemples

**Formater en XFS**

```bash
mkfs.xfs /dev/sdb1
```

**Avec label**

```bash
mkfs.xfs -L DataDisk /dev/vdb
```

*Mots-clés : formater xfs mkfs système fichiers filesystem label mkfs.xfs*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
