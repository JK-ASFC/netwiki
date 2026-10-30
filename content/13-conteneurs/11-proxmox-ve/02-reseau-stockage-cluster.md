---
title: Réseau, stockage, cluster et haute disponibilité
description: Infrastructure Proxmox VE — réseau (ponts Linux VLAN-aware, agrégats LACP, réseaux séparés gestion/cluster/stockage/migration, SDN : zones VLAN, VXLAN, EVPN), stockage (local, LVM-thin, ZFS et réplication, Ceph hyperconvergé, NFS, SMB, iSCSI), cluster (corosync, quorum, QDevice pour deux nœuds), migration à chaud, haute disponibilité (groupes, fencing par chien de garde), pare-feu intégré.
tags: [proxmox, réseau, vlan, zfs, ceph, cluster, corosync, haute disponibilité]
icon: network
---

## Réseau

```interfaces /etc/network/interfaces (extrait d'un nœud)
auto bond0
iface bond0 inet manual
    bond-slaves enp65s0f0 enp65s0f1
    bond-mode 802.3ad
    bond-miimon 100
    bond-xmit-hash-policy layer3+4

auto vmbr0
iface vmbr0 inet manual
    bridge-ports bond0
    bridge-stp off
    bridge-fd 0
    bridge-vlan-aware yes
    bridge-vids 2-4094

# Gestion de l'hôte dans le VLAN 10
auto vmbr0.10
iface vmbr0.10 inet static
    address 10.0.10.21/24
    gateway 10.0.10.1

# Réseau de cluster (corosync) dédié, sur une interface séparée
auto enp1s0
iface enp1s0 inet static
    address 10.99.0.21/24
```

| Réseau | Recommandation |
| --- | --- |
| Gestion | VLAN d'administration, interface web 8006 accessible seulement depuis ce réseau |
| **Cluster (corosync)** | Lien **dédié** à faible latence (< 5 ms), idéalement deux liens (`link0`, `link1`) ; ne pas le saturer avec du stockage ou des migrations |
| Stockage (Ceph, NFS, iSCSI) | Réseau dédié 10/25 Gbit/s et plus |
| Migration | Réseau désigné dans *Centre de données → Options → Migration* |
| VM | Pont VLAN-aware en trunk vers les commutateurs ; l'étiquette VLAN se règle sur chaque carte de VM |

Les modifications réseau s'appliquent à chaud (`ifreload -a`, bouton *Appliquer la configuration*). Côté commutateur : ports en **trunk**, LACP si agrégat.

### SDN

Le **SDN** de Proxmox (*Centre de données → SDN*) définit des **zones** (Simple, VLAN, QinQ, **VXLAN**, **EVPN**) et des **VNets** au niveau du cluster : un réseau créé une fois est disponible sur tous les nœuds, avec IPAM et DHCP intégrés selon les versions. EVPN (BGP) permet un routage distribué entre nœuds et sites.

## Stockage

| Type | Partagé | Instantanés | Usage |
| --- | --- | --- | --- |
| Répertoire local | Non | qcow2 | ISO, sauvegardes, petits besoins |
| **LVM-thin** | Non | Oui | Disques locaux, provisionnement fin |
| **ZFS** (local) | Non (mais **réplication** entre nœuds) | Oui | Défaut recommandé sur disques locaux : intégrité, compression, instantanés |
| **Ceph RBD / CephFS** | Oui | Oui | **Hyperconvergé** : stockage distribué sur les nœuds (3 nœuds minimum, réseau 10 Gbit/s+) |
| NFS / SMB | Oui | qcow2 | NAS existant |
| iSCSI / FC + LVM | Oui | Non (LVM partagé) | SAN existant ([[16-iscsi-mpio/01-cible-iscsi\|iSCSI]]) ; instantanés limités |

**Réplication ZFS** : copie planifiée (toutes les 15 min par ex.) des disques d'une VM vers un autre nœud ; en cas de panne, la VM redémarre ailleurs avec la dernière réplique (perte de quelques minutes, sans stockage partagé).

```bash
zpool status
pvesm status
pvesr list                      # tâches de réplication
ceph -s                         # état de Ceph (si utilisé)
```

## Cluster

```bash
# Sur le premier nœud
pvecm create cluster-paris --link0 10.99.0.21 --link1 10.98.0.21
# Sur chaque nœud à joindre (vide de VM)
pvecm add 10.99.0.21 --link0 10.99.0.22 --link1 10.98.0.22
pvecm status
pvecm nodes
```

| Point | Détail |
| --- | --- |
| **Quorum** | Majorité des votes nécessaire : 3 nœuds minimum pour un cluster tolérant une panne |
| Deux nœuds | Ajouter un **QDevice** (vote externe sur une petite machine ou VM hors cluster : `pvecm qdevice setup 10.0.10.30`) |
| Fichiers de configuration | `/etc/pve` (pmxcfs) répliqué sur tous les nœuds ; perte de quorum = `/etc/pve` en lecture seule |
| Heure | NTP fiable sur tous les nœuds |

## Migration et haute disponibilité

- **Migration à chaud** (stockage partagé) ou avec stockage local (`qm migrate 120 pve-02 --online --with-local-disks`).
- **HA** (*Centre de données → HA*) : la VM est redémarrée sur un autre nœud si le sien tombe. Les nœuds isolés se **clôturent** eux-mêmes (chien de garde *watchdog*, matériel ou `softdog`) avant que la ressource soit relancée ailleurs, ce qui évite les doubles démarrages.
- **Groupes / règles d'affinité** HA : nœuds préférés, séparation de VM redondantes.
- Mode **maintenance** d'un nœud : `ha-manager crm-command node-maintenance enable pve-02` migre les ressources HA.

## Pare-feu intégré

Pare-feu à trois niveaux (centre de données, nœud, VM/conteneur), basé sur nftables/iptables : groupes de sécurité, alias et ensembles d'adresses (IPSet), règles par carte réseau de VM (micro-segmentation), protection contre l'usurpation d'adresses IP/MAC. Activez-le d'abord au niveau du centre de données avec une règle autorisant la gestion (8006, 22) depuis le réseau d'administration, sinon vous perdez l'accès.

Suite : [[03-sauvegarde-securite-exploitation|sauvegarde, sécurité et exploitation]].
