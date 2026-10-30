---
title: Clusters de basculement
description: Clustering de basculement Windows Server — principes (nœuds, rôles, ressources, battements de cœur), quorum et témoins (disque, partage de fichiers, cloud, USB), réseaux du cluster, stockage partagé et volumes partagés de cluster (CSV), validation, création, rôles hautement disponibles (Hyper-V, serveur de fichiers, SQL Server AG), objets AD, cluster de groupe de travail, mise à jour adaptée aux clusters, maintenance et dépannage.
tags: [cluster, failover clustering, quorum, csv, windows server, haute disponibilité, cau]
icon: boxes
---

Un **cluster de basculement** regroupe plusieurs serveurs (**nœuds**) qui hébergent des **rôles** (VM Hyper-V, serveur de fichiers, instance SQL Server, DHCP…). Si un nœud tombe, ses rôles redémarrent sur un autre nœud ; pour une maintenance, ils sont déplacés sans interruption (migration dynamique des VM).

## Notions

| Notion | Description |
| --- | --- |
| **Nœud** | Serveur membre du cluster (jusqu'à 64) |
| **Rôle** (groupe) | Ensemble de ressources qui basculent ensemble (adresse IP, nom réseau, disque, service) |
| **Quorum** | Majorité nécessaire pour que le cluster fonctionne (évite le *split-brain*) |
| **Témoin** | Vote supplémentaire : disque, partage de fichiers, **cloud** (Azure Storage) ou clé USB (2019+) |
| **CSV** | *Cluster Shared Volume* : volume accessible simultanément en lecture/écriture par tous les nœuds (`C:\ClusterStorage\Volume1`) |
| CNO / VCO | Objet ordinateur du cluster et des rôles dans AD |

### Quorum

Chaque nœud a une voix ; le **quorum dynamique** ajuste les voix lors des arrêts successifs. Ajoutez **toujours un témoin** (le cluster décide de l'utiliser) :

| Nombre de nœuds | Témoin |
| --- | --- |
| 2 | **Indispensable** (partage de fichiers sur un 3ᵉ site, cloud, disque) |
| 3 et plus | Recommandé |
| Cluster étendu sur 2 sites | Témoin sur un **3ᵉ site** (ou cloud) |

## Réseaux

| Réseau | Rôle du cluster |
| --- | --- |
| Gestion / clients | *Autoriser le cluster et les clients* |
| Cluster (battements de cœur, CSV) | *Cluster uniquement* |
| Migration dynamique | Réseau dédié (préférence dans les paramètres de migration) |
| Stockage iSCSI | **Aucun** (le cluster ne l'utilise pas) |

Avec SET (voir [[09-hyper-v/02-reseau-stockage|réseau Hyper-V]]), ces réseaux sont des cartes virtuelles de l'hôte dans des VLAN distincts.

## Création

```powershell
# Sur chaque nœud
Install-WindowsFeature Failover-Clustering -IncludeManagementTools

# Validation (indispensable, conservez le rapport : prérequis du support Microsoft)
# Les noms de catégories sont localisés selon la langue du système
Test-Cluster -Node srv-hv-01, srv-hv-02, srv-hv-03 -Include "Inventory", "Network", "System Configuration", "Storage", "Hyper-V Configuration"

New-Cluster -Name clu-hv-01 -Node srv-hv-01, srv-hv-02, srv-hv-03 -StaticAddress 10.0.10.30 -NoStorage
Set-ClusterQuorum -Cluster clu-hv-01 -FileShareWitness \\srv-temoin.site3.exemple.fr\TemoinCluster
# ou : Set-ClusterQuorum -CloudWitness -AccountName <compte de stockage> -AccessKey <clé>

# Stockage partagé (LUN iSCSI/FC visibles par tous les nœuds) → CSV
Get-ClusterAvailableDisk | Add-ClusterDisk
Add-ClusterSharedVolume -Name "Disque de cluster 1"
Get-ClusterSharedVolume
```

Prérequis : nœuds de même version et niveau de mise à jour, matériel identique de préférence, joints au **même domaine** (ou cluster de **groupe de travail** depuis 2016, avec limites), le compte qui crée le cluster doit pouvoir créer le CNO dans l'OU (ou CNO pré-créé). Le stockage peut être SAN ([[16-iscsi-mpio/02-initiateur-mpio|iSCSI + MPIO]]), FC, SAS partagé, ou **Storage Spaces Direct** (disques locaux agrégés, hyperconvergé).

## Rôles

```powershell
# VM hautement disponible
Add-ClusterVirtualMachineRole -VMName "srv-app-01" -Cluster clu-hv-01
# Serveur de fichiers à usage général
Add-ClusterFileServerRole -Name fic-clu -Storage "Disque de cluster 2" -StaticAddress 10.0.10.35
# DHCP en cluster (alternative : basculement DHCP natif, plus simple)
Get-ClusterGroup | Format-Table Name, OwnerNode, State
```

| Paramètre de rôle | Usage |
| --- | --- |
| Propriétaires préférés | Ordre des nœuds pour ce rôle |
| Priorité | Élevée, moyenne, basse, pas de démarrage automatique (ordre de redémarrage : AD/DNS, bases, applications) |
| Restauration automatique | Revenir sur le nœud préféré (souvent désactivée ou planifiée hors heures) |
| Propriétés d'antiaffinité / règles d'affinité (2022+) | Séparer deux VM redondantes (deux DC) sur des nœuds différents |

## Maintenance

```powershell
Suspend-ClusterNode -Name srv-hv-02 -Drain          # vide le nœud (migration dynamique des VM)
# … mises à jour, redémarrage …
Resume-ClusterNode -Name srv-hv-02 -Failback Immediate

# Mise à jour adaptée aux clusters (CAU) : un nœud à la fois, automatiquement
Add-CauClusterRole -ClusterName clu-hv-01 -DaysOfWeek Tuesday -WeeksOfMonth 3 -MaxFailedNodes 0 -RequireAllNodesOnline -EnableFirewallRules -Force
Invoke-CauScan -ClusterName clu-hv-01
```

Suite : [[02-nlb-exploitation-depannage|NLB, exploitation et dépannage]].
