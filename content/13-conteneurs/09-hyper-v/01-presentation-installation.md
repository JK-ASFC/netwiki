---
title: Présentation, installation et machines virtuelles
description: Hyper-V, l'hyperviseur de type 1 de Windows Server et Windows 11 — architecture (partition parente, partitions enfants, VMBus), éditions et licences des invités (Standard, Datacenter), prérequis matériels, installation (Server, Server Core, Windows 11), machines virtuelles de génération 2, démarrage sécurisé et vTPM, mémoire dynamique, processeurs virtuels, services d'intégration, virtualisation imbriquée et gestion (Hyper-V Manager, PowerShell, Windows Admin Center).
tags: [hyper-v, virtualisation, windows server, machines virtuelles, génération 2, vtpm, powershell]
icon: info
---

**Hyper-V** est un hyperviseur de **type 1** : une fois le rôle installé, l'hyperviseur s'exécute directement sur le matériel et le Windows d'origine devient la **partition parente** (gestion, pilotes), les VM étant des **partitions enfants** qui communiquent par le **VMBus**. Il équipe Windows Server, Windows 11 Pro/Entreprise et **Azure Local** (ex-Azure Stack HCI).

## Éditions et licences

| Édition | Invités Windows Server couverts |
| --- | --- |
| **Standard** | 2 VM Windows Server par licence complète de l'hôte (cumulable par tranches) |
| **Datacenter** | VM Windows Server **illimitées** sur l'hôte licencié |
| Hyper-V Server (gratuit) | Abandonné après 2019 |

Les invités Linux (Ubuntu, RHEL, Debian, SUSE…) sont **pris en charge** avec les services d'intégration inclus dans le noyau.

## Prérequis

- Processeur 64 bits avec **SLAT** (EPT/RVI), virtualisation matérielle (VT-x/AMD-V) et **DEP** activées dans l'UEFI
- RAM : celle de l'hôte (4 Go+) + somme des VM ; disques SSD/NVMe ou SAN pour les VM
- Réseau : interfaces séparées ou convergées (gestion, VM, migration dynamique, stockage/cluster)

## Installation

```powershell
# Windows Server (y compris Server Core)
Install-WindowsFeature Hyper-V -IncludeManagementTools -Restart
# Windows 11 (poste d'administration ou de laboratoire)
Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V-All
# Outils seuls sur un poste d'administration
Install-WindowsFeature RSAT-Hyper-V-Tools          # serveur ; sur Windows 11 : fonctionnalités facultatives

Get-VMHost | Format-List VirtualHardDiskPath, VirtualMachinePath, MaximumStorageMigrations, VirtualMachineMigrationEnabled
Set-VMHost -VirtualHardDiskPath "D:\Hyper-V\Disques" -VirtualMachinePath "D:\Hyper-V\VM"
```

Préférez **Server Core** pour les hôtes : surface d'attaque et mises à jour réduites ; administration à distance (Hyper-V Manager, [[10-windows-admin-center/01-presentation-installation|Windows Admin Center]], PowerShell).

## Créer une VM

```powershell
New-VM -Name "srv-app-01" -Generation 2 -MemoryStartupBytes 4GB -NewVHDPath "D:\Hyper-V\Disques\srv-app-01.vhdx" -NewVHDSizeBytes 80GB -SwitchName "vSwitch-Prod"
Set-VMProcessor -VMName "srv-app-01" -Count 2
Set-VMMemory -VMName "srv-app-01" -DynamicMemoryEnabled $true -MinimumBytes 2GB -StartupBytes 4GB -MaximumBytes 8GB
Set-VMNetworkAdapterVlan -VMName "srv-app-01" -Access -VlanId 20
Add-VMDvdDrive -VMName "srv-app-01" -Path "D:\ISO\WindowsServer2025.iso"
Set-VMFirmware -VMName "srv-app-01" -FirstBootDevice (Get-VMDvdDrive -VMName "srv-app-01") -EnableSecureBoot On -SecureBootTemplate MicrosoftWindows
Set-VMKeyProtector -VMName "srv-app-01" -NewLocalKeyProtector
Enable-VMTPM -VMName "srv-app-01"
Set-VM -Name "srv-app-01" -AutomaticStartAction Start -AutomaticStartDelay 60 -AutomaticStopAction ShutDown -CheckpointType Production
Start-VM -Name "srv-app-01"
```

| Réglage | Recommandation |
| --- | --- |
| **Génération 2** | UEFI, démarrage sécurisé, vTPM, démarrage réseau sur carte synthétique ; génération 1 seulement pour d'anciens systèmes |
| Démarrage sécurisé Linux | Modèle `MicrosoftUEFICertificateAuthority` |
| **vTPM** | Requis pour Windows 11, BitLocker dans l'invité ; clés protégées par le *Key Protector* local ou un service de protection d'hôte |
| Mémoire dynamique | Utile pour les serveurs peu chargés ; à éviter pour SQL Server, Exchange et charges sensibles à la mémoire |
| vCPU | Ne pas surdimensionner ; respecter les nœuds NUMA pour les grosses VM |
| Arrêt automatique | `ShutDown` (arrêt propre via les services d'intégration) plutôt que `Save` sur les serveurs |

## Services d'intégration

Pilotes synthétiques (stockage, réseau), arrêt propre, synchronisation de l'heure, échange de données (KVP), pulsation, **VSS** (sauvegardes cohérentes), services invités (copie de fichiers). Intégrés aux systèmes Windows récents et aux noyaux Linux ; mis à jour par Windows Update dans l'invité.

> [!TIP]
> Désactivez la **synchronisation de l'heure** Hyper-V pour les **contrôleurs de domaine** virtualisés (ils doivent suivre la hiérarchie NTP), ou configurez chrony/W32Time pour qu'ils l'ignorent — voir [[01-chrony/02-serveur-nts-exploitation|chrony]].

## Virtualisation imbriquée

```powershell
Set-VMProcessor -VMName "lab-hv-01" -ExposeVirtualizationExtensions $true
Get-VMNetworkAdapter -VMName "lab-hv-01" | Set-VMNetworkAdapter -MacAddressSpoofing On
```

Permet d'exécuter Hyper-V (ou des conteneurs isolés) dans une VM : laboratoires, formations, Azure Local en VM.

Suite : [[02-reseau-stockage|réseau virtuel et stockage]].
