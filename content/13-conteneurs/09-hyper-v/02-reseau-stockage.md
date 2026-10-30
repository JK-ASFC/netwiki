---
title: Réseau virtuel et stockage
description: Réseau Hyper-V — commutateurs virtuels externe, interne et privé, Switch Embedded Teaming (SET) et réseau convergé, cartes virtuelles de l'hôte, VLAN d'accès et trunk, protections (DHCP Guard, Router Guard, usurpation MAC), QoS de bande passante, SR-IOV et RDMA ; stockage — VHDX fixes ou dynamiques, disques de différenciation, disques partagés, emplacement sur CSV ou SMB 3, points de contrôle standard et de production.
tags: [hyper-v, vswitch, set, vlan, vhdx, points de contrôle, sr-iov, stockage]
icon: network
---

## Commutateurs virtuels

| Type | Connectivité |
| --- | --- |
| **Externe** | Lié à une carte physique (ou une équipe SET) : VM ↔ réseau physique |
| Interne | VM ↔ hôte uniquement |
| Privé | VM ↔ VM sur le même hôte |

### Switch Embedded Teaming (SET) et réseau convergé

**SET** agrège jusqu'à 8 cartes physiques **dans** le commutateur virtuel (remplace le NIC Teaming LBFO pour Hyper-V, compatible RDMA). Les flux de l'hôte (gestion, migration dynamique, cluster, stockage SMB) passent par des **cartes virtuelles de l'hôte** sur le même commutateur, chacune dans son VLAN.

```powershell
New-VMSwitch -Name "vSwitch-Prod" -NetAdapterName "NIC1","NIC2" -EnableEmbeddedTeaming $true -AllowManagementOS $false -MinimumBandwidthMode Weight
Set-VMSwitchTeam -Name "vSwitch-Prod" -LoadBalancingAlgorithm HyperVPort

# Cartes de l'hôte
Add-VMNetworkAdapter -ManagementOS -Name "Gestion"   -SwitchName "vSwitch-Prod"
Add-VMNetworkAdapter -ManagementOS -Name "Migration" -SwitchName "vSwitch-Prod"
Add-VMNetworkAdapter -ManagementOS -Name "Cluster"   -SwitchName "vSwitch-Prod"
Set-VMNetworkAdapterVlan -ManagementOS -VMNetworkAdapterName "Gestion"   -Access -VlanId 10
Set-VMNetworkAdapterVlan -ManagementOS -VMNetworkAdapterName "Migration" -Access -VlanId 110
Set-VMNetworkAdapterVlan -ManagementOS -VMNetworkAdapterName "Cluster"   -Access -VlanId 111
Set-VMNetworkAdapter -ManagementOS -Name "Migration" -MinimumBandwidthWeight 30
New-NetIPAddress -InterfaceAlias "vEthernet (Gestion)" -IPAddress 10.0.10.21 -PrefixLength 24 -DefaultGateway 10.0.10.1
```

Côté commutateur physique : ports en **trunk** (802.1Q) avec les VLAN des VM et de l'hôte, **sans LACP** (SET est indépendant du commutateur), *PortFast*/edge.

### VLAN des VM

```powershell
Set-VMNetworkAdapterVlan -VMName "srv-app-01" -Access -VlanId 20
Set-VMNetworkAdapterVlan -VMName "fw-virtuel" -Trunk -AllowedVlanIdList "20,30,40" -NativeVlanId 0    # pare-feu/routeur virtuel
Get-VMNetworkAdapterVlan -VMName "srv-app-01"
```

### Protections et performances

| Fonction | Effet |
| --- | --- |
| **DHCP Guard** | Bloque les réponses DHCP émises par la VM (serveur DHCP pirate) |
| **Router Guard** | Bloque les annonces de routeur et redirections ICMP |
| Usurpation d'adresses MAC | Désactivée par défaut ; à activer seulement pour la virtualisation imbriquée, certains équilibreurs |
| Port mirroring | Copie du trafic vers une VM d'analyse (IDS : voir [[05-suricata/01-presentation-installation\|Suricata]]) |
| QoS (poids, limites) | `Set-VMNetworkAdapter -MaximumBandwidth` / `-MinimumBandwidthWeight` |
| **SR-IOV** | La VM accède directement à une fonction virtuelle de la carte (latence minimale ; limite certaines fonctions du vSwitch) |
| **RDMA** (SMB Direct) | Trafic de stockage et de migration à très faible charge CPU (RoCE avec DCB, ou iWARP) |

```powershell
Set-VMNetworkAdapter -VMName "srv-app-01" -DhcpGuard On -RouterGuard On -MacAddressSpoofing Off
```

## Stockage

| Format / option | Usage |
| --- | --- |
| **VHDX** | Format courant (jusqu'à 64 To, résistant aux coupures) |
| Taille **fixe** | Performances prévisibles, pas de dépassement d'espace (bases de données) |
| **Dynamique** | Recommandé en général depuis 2012 R2 (performances proches) ; surveiller l'espace (surallocation) |
| Différenciation | Laboratoires, VDI à partir d'une image parente (ne jamais modifier le parent) |
| **VHD Set** (`.vhds`) | Disque partagé entre VM d'un cluster invité (remplace le VHDX partagé) |
| Disque physique en relais (*pass-through*) | Rarement justifié aujourd'hui |

Emplacements : volumes locaux (ReFS recommandé pour les VHDX : opérations de fusion et création accélérées), **CSV** d'un cluster ([[05-clustering/01-cluster-basculement|clustering]]), partages **SMB 3** (SOFS), SAN iSCSI/FC ([[16-iscsi-mpio/01-cible-iscsi|iSCSI]]).

```powershell
New-VHD -Path "D:\Hyper-V\Disques\donnees-01.vhdx" -SizeBytes 500GB -Dynamic
Add-VMHardDiskDrive -VMName "srv-app-01" -ControllerType SCSI -Path "D:\Hyper-V\Disques\donnees-01.vhdx"
Resize-VHD -Path "D:\Hyper-V\Disques\donnees-01.vhdx" -SizeBytes 800GB        # à chaud sur contrôleur SCSI
Optimize-VHD -Path "D:\Hyper-V\Disques\ancien.vhdx" -Mode Full                # compactage (VM arrêtée)
Set-VMHardDiskDrive -VMName "srv-app-01" -ControllerType SCSI -ControllerNumber 0 -ControllerLocation 1 -MaximumIOPS 5000   # QoS de stockage
```

## Points de contrôle

| Type | Contenu | Usage |
| --- | --- | --- |
| **Production** (défaut) | Cohérent via **VSS** dans l'invité (comme une sauvegarde) ; pas d'état mémoire | Avant une mise à jour ou un changement |
| Standard | État complet y compris mémoire | Laboratoires (dangereux pour les applications distribuées) |

```powershell
Checkpoint-VM -Name "srv-app-01" -SnapshotName "Avant mise à jour 2026-10"
Get-VMSnapshot -VMName "srv-app-01"
Restore-VMSnapshot -VMName "srv-app-01" -Name "Avant mise à jour 2026-10" -Confirm:$false
Remove-VMSnapshot -VMName "srv-app-01" -Name "Avant mise à jour 2026-10"      # fusion des AVHDX
```

> [!WARNING]
> Un point de contrôle n'est **pas une sauvegarde** et dégrade les performances s'il dure (chaîne d'AVHDX). Ne restaurez jamais un point de contrôle **standard** d'un contrôleur de domaine ou d'un nœud de cluster applicatif sans en comprendre l'effet (la génération VM protège AD, pas toutes les applications). Supprimez-les dès que le changement est validé.
