---
title: "tune2fs"
description: "Bash — tune2fs (Systèmes de fichiers) : Affiche et modifie les paramètres d'un système de fichiers ext2/3/4 SANS le reformater ni perdre les données."
tags: [bash, commande, disques-stockage]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Disques & stockage |
| **Contexte** | Systèmes de fichiers |
| **Commande type** | `tune2fs -l /dev/sda1` |

## Rôle

Affiche et modifie les paramètres d'un système de fichiers ext2/3/4 SANS le reformater ni perdre les données.

## Options

| Option | Rôle |
| --- | --- |
| `-l` | liste tout le superbloc : label, UUID, nombre de montages, état, blocs réservés, fonctionnalités |
| `-L ‹label›` | change l'étiquette du volume (réutilisable comme LABEL=... dans /etc/fstab) |
| `-U ‹UUID›` | change l'UUID du FS ('random' pour en générer un) : à répercuter dans /etc/fstab |
| `-m ‹pourcent›` | pourcentage de blocs réservés à root (5 % par défaut) : 1 ou 0 libère de l'espace sur un disque de données |
| `-c ‹nb de montages›` | nombre de montages avant vérification forcée au démarrage (0 ou -1 = jamais) |
| `-i ‹intervalle (30d)›` | délai maximal entre deux vérifications : 30d, 6m, ou 0 pour désactiver |
| `-e ‹remount-ro/continue/panic›` | comportement du noyau en cas d'erreur du FS : remonter en lecture seule, continuer, ou paniquer |
| `-O ‹fonctionnalité›` | active une fonctionnalité du FS ; préfixer par ^ pour la retirer (^has_journal, metadata_csum, 64bit) |
| `-j` | ajoute un journal : convertit un ext2 en ext3 |
| `-C ‹nb›` | force la valeur du compteur de montages |
| `-r ‹nb de blocs›` | fixe le nombre EXACT de blocs réservés (au lieu d'un pourcentage) |
| `-M ‹chemin›` | inscrit le dernier point de montage dans le superbloc |

## Exemples

**Tout voir**

```bash
sudo tune2fs -l /dev/sda1
```

**Libérer la réserve root**

```bash
sudo tune2fs -m 1 /dev/sdb1
```

**Changer l'étiquette**

```bash
sudo tune2fs -L donnees /dev/sdb1
```

**Désactiver le fsck périodique**

```bash
sudo tune2fs -c 0 -i 0 /dev/sdb1
```

*Mots-clés : tune2fs ext4 superbloc label uuid réservé fsck paramètres ajuster*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
