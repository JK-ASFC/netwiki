---
title: Présentation, installation et exploitation
description: Lustre et BeeGFS — systèmes de fichiers parallèles pour le calcul haute performance (HPC), l'IA et le traitement de gros fichiers : architecture (Lustre : MGS, MDS/MDT, OSS/OST, clients noyau ; BeeGFS : management, métadonnées, stockage, clients, helperd), réseaux (Ethernet, InfiniBand, LNet/RDMA), installation (dépôts Whamcloud, dépôts BeeGFS pour RHEL et Debian), montage client, répartition (striping), quotas, supervision (lfs, beegfs-ctl, beegfs-df) et choix entre les deux.
tags: [lustre, beegfs, hpc, système de fichiers parallèle, infiniband, striping]
icon: info
---

Un **système de fichiers parallèle** découpe chaque fichier en bandes réparties sur de nombreux serveurs de stockage : des milliers de nœuds de calcul lisent et écrivent simultanément à des dizaines de Go/s. On les trouve dans les supercalculateurs, les clusters d'IA et le traitement sismique ou génomique.

| | **Lustre** | **BeeGFS** |
| --- | --- | --- |
| Licence | GPL v2 | Serveurs : licence BeeGFS EULA (gratuite, fonctions entreprise payantes) ; client GPL |
| Composants | MGS, MDS (MDT), OSS (OST), clients noyau | Management, métadonnées, stockage, clients |
| Facilité | Plus complexe, noyau patché côté serveur (ldiskfs) ou ZFS | Plus simple à installer, serveurs en espace utilisateur |
| Usage | Grands centres HPC (la majorité du Top500) | Clusters de taille moyenne, IA |

## Lustre (aperçu)

```bash
# Serveurs RHEL/Rocky avec les dépôts Whamcloud (version alignée sur le noyau), backend ldiskfs ou ZFS
mkfs.lustre --fsname=scratch --mgs --mdt --index=0 /dev/nvme0n1          # MGS + MDT
mount -t lustre /dev/nvme0n1 /mnt/mdt
mkfs.lustre --fsname=scratch --ost --index=0 --mgsnode=10.0.40.11@tcp /dev/sdb   # sur chaque OSS
mount -t lustre /dev/sdb /mnt/ost0
# Client
mount -t lustre 10.0.40.11@tcp:/scratch /scratch
lfs df -h ; lfs setstripe -c 8 -S 4M /scratch/gros-fichiers ; lfs getstripe /scratch/gros-fichiers/donnees.bin
lfs quota -u jk /scratch
```

## BeeGFS

```bash
# Dépôt BeeGFS (RHEL, Debian, Ubuntu) puis, selon le rôle :
sudo dnf install beegfs-mgmtd                          # management
sudo dnf install beegfs-meta                           # métadonnées
sudo dnf install beegfs-storage                        # stockage
sudo dnf install beegfs-client beegfs-helperd beegfs-utils   # clients
/opt/beegfs/sbin/beegfs-setup-mgmtd -p /srv/beegfs/mgmtd
/opt/beegfs/sbin/beegfs-setup-meta -p /srv/beegfs/meta -s 1 -m bgfs-mgmt
/opt/beegfs/sbin/beegfs-setup-storage -p /srv/beegfs/stor1 -s 1 -i 101 -m bgfs-mgmt
/opt/beegfs/sbin/beegfs-setup-client -m bgfs-mgmt
sudo systemctl start beegfs-mgmtd beegfs-meta beegfs-storage beegfs-helperd beegfs-client
beegfs-df ; beegfs-ctl --listnodes --nodetype=storage --details ; beegfs-ctl --setpattern --chunksize=1m --numtargets=4 /mnt/beegfs/projet
```

Les versions récentes de BeeGFS (8.x) remplacent `beegfs-ctl` par la commande `beegfs` et ajoutent l'authentification par défaut : suivez le guide de la version installée.

Commandes : [[90-aide-memoire|aide-mémoire]].
