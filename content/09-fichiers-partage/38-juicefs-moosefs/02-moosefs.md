---
title: MooseFS
description: MooseFS — système de fichiers distribué POSIX tolérant aux pannes (GPLv2 pour l'édition Community) : architecture (serveur maître/metadata, serveurs de chunks, metaloggers, clients mfsmount via FUSE), objectif de réplication (goal) par fichier ou dossier, corbeille, instantanés, installation Debian/Ubuntu et RHEL depuis les dépôts MooseFS, configuration (mfsmaster.cfg, mfshdd.cfg, mfsexports.cfg), interface web mfscgiserv, commandes mfssetgoal, mfsgetgoal, mfsfileinfo, mfsdirinfo, maintenance et comparaison avec MooseFS Pro et LizardFS.
tags: [moosefs, système de fichiers distribué, posix, réplication, fuse, tolérance aux pannes]
icon: info
---

**MooseFS** répartit les fichiers en morceaux (*chunks* de 64 Mio) sur plusieurs **serveurs de chunks**, avec un **objectif de réplication** (*goal*) réglable par fichier ou par dossier (par ex. 2 ou 3 copies). Un **serveur maître** tient l'arborescence et les métadonnées en mémoire ; les clients montent le volume en POSIX via FUSE. C'est une solution simple pour un stockage partagé évolutif et tolérant aux pannes sur du matériel ordinaire.

| Composant | Rôle |
| --- | --- |
| **Master** (`mfsmaster`) | Métadonnées (en RAM), placement des *chunks*, coordination ; point central |
| **Chunkservers** (`mfschunkserver`) | Stockent les morceaux sur leurs disques ; plus on en ajoute, plus la capacité et le débit augmentent |
| **Metaloggers** (`mfsmetalogger`) | Copient en continu le journal des métadonnées (secours du maître) |
| **Clients** (`mfsmount`) | Montent le système de fichiers (FUSE) |

> [!NOTE]
> L'édition **Community** (GPLv2) a un **seul maître** (point de défaillance unique, à relancer depuis un metalogger). La **bascule automatique du maître** (plusieurs maîtres) relève de l'édition **MooseFS Pro**. LizardFS était un fork, aujourd'hui peu actif.

## Installation

```bash
# Debian/Ubuntu : dépôt officiel ppa.moosefs.com (clé + sources selon la documentation), puis
sudo apt install moosefs-master moosefs-cgiserv       # sur le serveur maître
sudo apt install moosefs-chunkserver                   # sur chaque serveur de chunks
sudo apt install moosefs-client                        # sur les clients
# RHEL/Rocky/Alma : dépôt .repo MooseFS puis dnf install moosefs-*
```

Résolvez le nom `mfsmaster` (DNS ou `/etc/hosts`) sur tous les nœuds — les chunkservers et clients s'y connectent par ce nom.

## Maître

```bash
sudo cp /etc/mfs/mfsmaster.cfg.sample /etc/mfs/mfsmaster.cfg      # selon le paquet
sudo cp /etc/mfs/mfsexports.cfg.sample /etc/mfs/mfsexports.cfg
```

```text /etc/mfs/mfsexports.cfg
# client(s)            point de montage    options
10.0.20.0/24           /                   rw,alldirs,maproot=0
```

```bash
sudo systemctl enable --now moosefs-master moosefs-cgiserv       # interface web : http://mfsmaster:9425
```

## Serveurs de chunks

```text /etc/mfs/mfshdd.cfg
# Un disque/point de montage dédié par ligne (idéalement un système de fichiers par disque)
/mnt/chunk1
/mnt/chunk2
```

```bash
sudo systemctl enable --now moosefs-chunkserver
```

## Clients et objectifs de réplication

```bash
sudo mfsmount /mnt/mfs -H mfsmaster                 # monter (FUSE)
echo 'mfsmount /mnt/mfs fuse mfsdelayedinit,_netdev 0 0' | sudo tee -a /etc/fstab

# Objectif (nombre de copies) par fichier ou dossier
mfssetgoal -r 3 /mnt/mfs/important       # 3 copies, récursif
mfsgetgoal   /mnt/mfs/important
mfsfileinfo  /mnt/mfs/important/base.dump   # où sont les chunks
mfsdirinfo   /mnt/mfs/projets               # taille réelle, nb de fichiers/chunks

# Corbeille et instantanés
mfsgettrashtime /mnt/mfs/projets ; mfssettrashtime 86400 /mnt/mfs/projets   # rétention corbeille (s)
mfsmakesnapshot /mnt/mfs/projets /mnt/mfs/projets-instantane
```

## Exploitation

- **Interface web** `mfscgiserv` (port **9425**) : état des chunkservers, disques, objectifs sous/sur-répliqués, opérations en cours.
- **Ajout de capacité** : installer un chunkserver de plus → MooseFS rééquilibre automatiquement.
- **Perte d'un chunkserver** : les copies manquantes sont recréées à partir des autres (si le *goal* ≥ 2) ; surveillez les chunks « undergoal ».
- **Sauvegarde du maître** : le dossier de métadonnées (`/var/lib/mfs/metadata.mfs`) et les metaloggers ; pour restaurer, promouvoir un metalogger.
- **Supervision** : `mfscli -SIN` (état), interface web, ou export des compteurs.

Comparé à [[01-juicefs|JuiceFS]] (données sur objet) ou [[24-ceph/01-presentation-installation|Ceph]] (sans maître unique), MooseFS est **simple et efficace** sur disques locaux, au prix d'un maître unique en édition Community.

Commandes : [[90-aide-memoire|aide-mémoire]].
