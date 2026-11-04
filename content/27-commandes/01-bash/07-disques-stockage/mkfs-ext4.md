---
title: "mkfs.ext4"
description: "Bash — mkfs.ext4 (Formatage) : Crée un système de fichiers ext4 sur une partition."
tags: [bash, commande, disques-stockage]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Disques & stockage |
| **Contexte** | Formatage |
| **Commande type** | `mkfs.ext4 /dev/sdb1` |

## Rôle

Crée un système de fichiers ext4 sur une partition.

## Options

| Option | Rôle |
| --- | --- |
| `-L ‹label›` | étiquette du volume (réutilisable comme LABEL=... dans /etc/fstab) |
| `-b ‹taille (1024/2048/4096)›` | taille de bloc en octets : petits blocs = moins de perte sur de petits fichiers |
| `-N ‹nb d'inodes›` | nombre TOTAL d'inodes (un inode par fichier) : à monter pour des millions de petits fichiers |
| `-i ‹octets par inode›` | crée un inode tous les N octets : plus petit = plus d'inodes |
| `-I ‹taille d'inode›` | taille d'un inode en octets (128, 256…) : 256 permet les attributs étendus |
| `-m ‹pourcent›` | pourcentage de blocs réservés à root (5 % par défaut) : 0 ou 1 sur un disque de données |
| `-c` | vérifie les blocs défectueux (lecture) avant de formater ; -cc fait un test lecture/écriture |
| `-j` | crée un journal (implicite pour ext4 ; utile pour transformer un ext2) |
| `-J ‹size=64›` | options du journal : taille en Mio, ou device=... pour un journal externe |
| `-O ‹fonctionnalités›` | active/désactive des fonctions : ^has_journal (retire), extent, 64bit, metadata_csum |
| `-E ‹stride=32,stripe-width=64›` | options étendues : alignement RAID, discard, lazy_itable_init |
| `-T ‹usage›` | profil d'usage : small, floppy, big, huge, news (ajuste inodes et blocs) |
| `-U ‹UUID›` | impose un UUID précis (ou random / clear) |
| `-M ‹dernier point de montage›` | inscrit le dernier répertoire de montage dans le superbloc |
| `-d ‹dossier source›` | recopie le contenu d'un dossier dans le FS dès sa création |
| `-G ‹taille flex-group›` | nombre de groupes de blocs regroupés (flex_bg) |
| `-g ‹blocs par groupe›` | nombre de blocs par groupe (rarement modifié) |
| `-e ‹remount-ro/continue/panic›` | comportement du noyau en cas d'erreur du FS |
| `-o ‹OS créateur›` | identifiant du système créateur inscrit dans le superbloc |
| `-r ‹révision›` | révision du système de fichiers (0 ou 1) |
| `-z ‹fichier undo›` | écrit un fichier d'annulation permettant de revenir en arrière |
| `-l ‹fichier›` | lit la liste des blocs défectueux depuis un fichier |
| `-C ‹taille cluster›` | taille de cluster (avec bigalloc) |
| `-n` | SIMULATION : montre ce qui serait fait sans rien écrire |
| ⚠️ `-F` | force même si le périphérique est monté ou n'est pas un disque : destructeur |
| `-q` | mode silencieux |
| `-v` | mode verbeux |
| `-D` | écrit directement sur le disque (contourne le cache) |
| `-S` | reconstruit UNIQUEMENT les superblocs (sauvetage, ne recrée pas les données) |
| `-V` | affiche la version de mke2fs |

> [!WARNING]
> Options à manier avec précaution : `-F`. Elles contournent une protection, détruisent des données ou agissent sans confirmation.

## Exemples

**Formater en ext4**

```bash
mkfs.ext4 /dev/sdb1
```

**Avec 2048 inodes**

```bash
mkfs.ext4 -N 2048 /dev/vdc
```

*Mots-clés : formater ext4 mkfs système fichiers filesystem inodes mkfs.ext4*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
