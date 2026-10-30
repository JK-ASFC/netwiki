---
title: Storage Replica — aide-mémoire des commandes
description: Commandes Storage Replica avec exemples — installation, test de topologie (Test-SRTopology et rapport), partenariat serveur à serveur (New-SRPartnership, synchrone ou asynchrone, compression), état et progression (Get-SRGroup, Get-SRPartnership, compteurs), bascule de sens (Set-SRPartnership), suppression, réplication de cluster étendu, contraintes réseau (SMB 445, 5445), journaux.
tags: [aide-mémoire, storage replica, réplication, pra, windows server]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-deploiement|Storage Replica]].

## Installation et test

```powershell
Install-WindowsFeature Storage-Replica, FS-FileServer -IncludeManagementTools -Restart -ComputerName srv-a, srv-b
Test-SRTopology -SourceComputerName srv-a -SourceVolumeName D: -SourceLogVolumeName L: `
  -DestinationComputerName srv-b -DestinationVolumeName D: -DestinationLogVolumeName L: `
  -DurationInMinutes 30 -ResultPath C:\Temp\sr-test
# Ouvrir le rapport HTML généré dans C:\Temp\sr-test (débit, latence, recommandations de taille du journal)
```

## Partenariat

```powershell
New-SRPartnership -SourceComputerName srv-a -SourceRGName rg-a -SourceVolumeName D: -SourceLogVolumeName L: `
  -DestinationComputerName srv-b -DestinationRGName rg-b -DestinationVolumeName D: -DestinationLogVolumeName L: `
  -ReplicationMode Synchronous -LogSizeInBytes 16GB
# Asynchrone (longue distance) et compression (Windows Server 2025, Datacenter)
New-SRPartnership -SourceComputerName srv-a -SourceRGName rg-a -SourceVolumeName D: -SourceLogVolumeName L: -DestinationComputerName srv-dr -DestinationRGName rg-dr -DestinationVolumeName D: -DestinationLogVolumeName L: -ReplicationMode Asynchronous -AsyncRPO 30 -EnableCompression
```

## État et suivi

```powershell
Get-SRGroup | Format-Table Name, ReplicationMode, ReplicationStatus
(Get-SRGroup -Name rg-b).Replicas | Select-Object DataVolume, ReplicationStatus, NumOfBytesRemaining
Get-SRPartnership
Get-SRAccess
Get-Counter -Counter "\Storage Replica Statistics(*)\Total Bytes Received"
Get-WinEvent -LogName "Microsoft-Windows-StorageReplica/Admin" -MaxEvents 20 | Format-Table TimeCreated, Id, Message -Wrap
```

| Événement | Sens |
| --- | --- |
| 5015 | Début de la synchronisation initiale |
| 1237 | Synchronisation initiale terminée |
| 5002 | Réplication interrompue (réseau) |

## Bascule et retour

```powershell
# Inverser le sens : la destination devient source (volume D: monté sur srv-b)
Set-SRPartnership -NewSourceComputerName srv-b -SourceRGName rg-b -DestinationComputerName srv-a -DestinationRGName rg-a
# Revenir au sens initial
Set-SRPartnership -NewSourceComputerName srv-a -SourceRGName rg-a -DestinationComputerName srv-b -DestinationRGName rg-b
```

## Suppression

```powershell
Get-SRPartnership | Remove-SRPartnership -Force
Get-SRGroup | Remove-SRGroup -Force               # sur chaque serveur
```

## Réseau

```powershell
Test-NetConnection srv-b -Port 445
Test-NetConnection srv-b -Port 5445               # SMB sur RDMA (iWARP) si utilisé
Set-SRNetworkConstraint -SourceComputerName srv-a -SourceRGName rg-a -SourceNWInterface 2 -DestinationComputerName srv-b -DestinationRGName rg-b -DestinationNWInterface 2
Get-SRNetworkConstraint
```
