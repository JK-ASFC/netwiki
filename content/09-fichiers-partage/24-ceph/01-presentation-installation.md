---
title: Présentation et installation (cephadm)
description: Ceph — stockage distribué unifié et auto-réparant (LGPL) : architecture (MON, MGR, OSD, MDS, RGW, algorithme CRUSH, placement groups), versions (Reef, Squid, Tentacle), dimensionnement (réseaux public et cluster, disques NVMe/SSD, 3 nœuds minimum), installation avec cephadm (bootstrap, ajout d'hôtes, orchestrateur, OSD sur tous les disques libres), Ceph intégré à Proxmox VE, client ceph-common, état du cluster et premières vérifications.
tags: [ceph, stockage distribué, cephadm, osd, crush, rbd, cephfs, rgw]
icon: info
---

**Ceph** fournit, sur des serveurs standard, trois types de stockage à partir d'un même cluster :

| Interface | Usage |
| --- | --- |
| **RBD** (bloc) | Disques de VM ([[11-proxmox-ve/01-presentation-installation\|Proxmox VE]], OpenStack, Kubernetes) |
| **CephFS** (fichiers) | Système de fichiers partagé POSIX |
| **RGW** (objet) | API compatible **S3** et Swift |

| Démon | Rôle | Nombre conseillé |
| --- | --- | --- |
| **MON** | Carte du cluster, quorum | 3 ou 5 |
| **MGR** | Supervision, tableau de bord, modules | 2 (actif/secours) |
| **OSD** | Un par disque : stockage et réplication | 3 nœuds minimum |
| MDS | Métadonnées CephFS | 2 (actif/secours) |
| RGW | Passerelle S3 | 2 derrière un répartiteur |

Les données sont réparties par **CRUSH** dans des *placement groups* et répliquées (3 copies par défaut) ou codées par effacement : la perte d'un disque ou d'un nœud se répare **automatiquement**.

## Prérequis

- 3 nœuds minimum (Linux récent : Ubuntu, Debian, Rocky, CentOS Stream), synchronisation **NTP** ([[01-chrony/01-presentation-client|Chrony]]), Python 3, Podman ou Docker, LVM.
- Réseau **10 Gbit/s** minimum ; réseau *cluster* séparé pour la réplication recommandé.
- Disques entiers pour les OSD (pas de RAID matériel ; HBA en mode IT), SSD/NVMe avec protection contre les coupures de courant.

## Installation avec cephadm

```bash
# Sur le premier nœud
sudo apt install cephadm            # ou : curl --silent --remote-name --location https://download.ceph.com/rpm-squid/el9/noarch/cephadm && chmod +x cephadm
sudo cephadm bootstrap --mon-ip 10.0.30.11 --cluster-network 10.0.31.0/24
# Affiche l'URL du tableau de bord (https://ceph1:8443) et le mot de passe admin initial
sudo cephadm add-repo --release squid && sudo cephadm install ceph-common
ceph -s
```

```bash
# Ajouter les autres nœuds (clé SSH du cluster copiée pour root)
ssh-copy-id -f -i /etc/ceph/ceph.pub root@ceph2 && ssh-copy-id -f -i /etc/ceph/ceph.pub root@ceph3
ceph orch host add ceph2 10.0.30.12 && ceph orch host add ceph3 10.0.30.13
ceph orch host label add ceph2 _admin
ceph orch apply mon --placement="ceph1,ceph2,ceph3"
ceph orch device ls                         # disques détectés et disponibles
ceph orch apply osd --all-available-devices # un OSD par disque libre
ceph -s ; ceph osd tree
```

Avec **Proxmox VE**, utiliser plutôt l'intégration native (*Datacenter → Ceph*, `pveceph`) qui installe et gère Ceph depuis l'interface Proxmox.

> [!WARNING]
> Ceph a besoin de marge : un OSD plein bloque les écritures du pool. Alertez à 70 % et agissez avant 85 % (`nearfull`/`full`). Ne supprimez jamais plusieurs OSD à la fois sans attendre que le cluster soit revenu à `HEALTH_OK`.

Suite : [[02-rbd-cephfs-rgw|RBD, CephFS et RGW]] · [[03-interface-graphique|tableau de bord]] · [[90-aide-memoire|aide-mémoire]].
