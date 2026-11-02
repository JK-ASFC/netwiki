---
title: Présentation, installation et exploitation
description: DRBD et LINSTOR (LINBIT, GPL) — réplication bloc en temps réel entre serveurs Linux pour la haute disponibilité : principes DRBD (ressources, protocoles A/B/C, primaire/secondaire, double primaire), DRBD 9 (plus de 2 nœuds, quorum), installation (module noyau drbd, drbd-utils, dépôts LINBIT et ELRepo), fichier de ressource, création des métadonnées, synchronisation, bascule avec Pacemaker ou drbd-reactor, split-brain et résolution ; LINSTOR (contrôleur, satellites, pools de stockage LVM thin ou ZFS, groupes de ressources, plugins Proxmox VE et Kubernetes CSI).
tags: [drbd, linstor, réplication bloc, haute disponibilité, pacemaker, linbit]
icon: info
---

**DRBD** recopie chaque écriture d'un disque local vers un ou plusieurs autres serveurs : c'est un « RAID 1 réseau ». Associé à Pacemaker ([[05-clustering/01-cluster-basculement|clustering]]), il permet de faire basculer un service (base de données, NFS, VM) sans baie partagée. **LINSTOR** orchestre des centaines de volumes DRBD et les expose à [[11-proxmox-ve/01-presentation-installation|Proxmox VE]], Kubernetes, OpenStack ou OpenNebula.

| Protocole | Écriture acquittée quand… | Usage |
| --- | --- | --- |
| A | Écrite localement et envoyée | Réplication distante asynchrone |
| B | Reçue par le pair (en mémoire) | Rare |
| **C** | Écrite sur les deux disques | Haute disponibilité (par défaut) |

## Installation

```bash
# Ubuntu : PPA LINBIT ; RHEL : ELRepo (kmod-drbd9x) ou dépôts LINBIT (clients)
sudo add-apt-repository ppa:linbit/linbit-drbd9-stack && sudo apt install drbd-dkms drbd-utils
sudo modprobe drbd && cat /proc/drbd
```

## Ressource DRBD à deux nœuds

```text
# /etc/drbd.d/donnees.res (identique sur les deux nœuds)
resource donnees {
  protocol C;
  device /dev/drbd0;
  disk /dev/vg_data/lv_drbd;
  meta-disk internal;
  on nfs1 { address 10.0.31.11:7789; node-id 0; }
  on nfs2 { address 10.0.31.12:7789; node-id 1; }
  connection-mesh { hosts nfs1 nfs2; }
  net { after-sb-0pri discard-zero-changes; after-sb-1pri discard-secondary; }
}
```

```bash
sudo drbdadm create-md donnees && sudo drbdadm up donnees           # sur les deux nœuds
sudo drbdadm primary --force donnees                                 # sur nfs1 uniquement (synchronisation initiale)
sudo drbdadm status donnees
sudo mkfs.xfs /dev/drbd0 && sudo mount /dev/drbd0 /srv/nfs           # sur le primaire
```

Bascule manuelle : démonter, `drbdadm secondary donnees` sur l'ancien primaire, `drbdadm primary donnees` sur l'autre. En production, la bascule est confiée à **Pacemaker** ou **drbd-reactor** avec un **quorum** (3 nœuds, ou un nœud *diskless* arbitre) pour éviter le **split-brain**.

## LINSTOR

```bash
linstor node create nfs1 10.0.31.11 ; linstor node create nfs2 10.0.31.12
linstor storage-pool create lvmthin nfs1 pool_ssd vg_data/thinpool ; linstor storage-pool create lvmthin nfs2 pool_ssd vg_data/thinpool
linstor resource-group create rg-ha --storage-pool pool_ssd --place-count 2
linstor resource-group spawn-resources rg-ha vm-101-disk-0 50G
linstor resource list ; linstor volume list
```

Commandes : [[90-aide-memoire|aide-mémoire]].
