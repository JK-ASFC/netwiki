---
title: Présentation, déploiement et exploitation
description: Storage Replica de Windows Server — réplication de volumes au niveau bloc, synchrone (RPO nul, latence ≤ 5 ms) ou asynchrone, scénarios serveur à serveur, cluster étendu et cluster à cluster, prérequis (édition Datacenter ou limites de Standard, volumes de journaux, réseau SMB 3), test de topologie, création du partenariat, inversion du sens, compression, supervision et problèmes fréquents.
tags: [storage replica, réplication, windows server, synchrone, asynchrone, cluster étendu, reprise après sinistre]
icon: copy
---

**Storage Replica** (SR) réplique un **volume** bloc par bloc vers un autre serveur ou cluster, généralement sur un site distant. Contrairement à [[14-dfs/02-replication-dfsr|DFS-R]] (fichiers, multimaître), SR copie tout le volume, quel que soit son contenu (machines virtuelles, bases, fichiers), dans **un seul sens** : la destination reste **démontée** tant que le sens n'est pas inversé.

## Modes

| Mode | Fonctionnement | RPO | Contrainte |
| --- | --- | --- | --- |
| **Synchrone** | L'écriture n'est acquittée à l'application qu'après écriture sur la destination | **Zéro** perte | Latence aller-retour ≤ **5 ms** (même métropole), bande passante suffisante pour toutes les écritures |
| **Asynchrone** | Acquittement local, envoi au plus vite | Quelques secondes à minutes | Longues distances |

## Scénarios

| Scénario | Description |
| --- | --- |
| **Serveur à serveur** | Deux serveurs autonomes, stockage local ou SAN chacun ; bascule manuelle |
| **Cluster étendu** (*stretch cluster*) | Un cluster de basculement sur deux sites, chaque site avec son stockage ; basculement automatique des rôles |
| **Cluster à cluster** | Deux clusters, réplication entre leurs volumes CSV ; reprise manuelle ou orchestrée |

## Prérequis

- Windows Server **Datacenter** ; l'édition **Standard** est limitée à **un** partenariat, **un** groupe de réplication, et un volume de **2 To** maximum
- Deux volumes par groupe de réplication de chaque côté : **données** (taille identique) et **journal** (SSD recommandé, ≥ 9 Go — 8 Go par défaut pour le journal, plus si fortes écritures)
- Partitions **GPT**, même lettre ou point de montage, mêmes tailles des deux côtés
- Réseau : SMB 3 (445/TCP) et WS-MAN (5985) entre les serveurs, idéalement des liens dédiés (RDMA possible) ; ICMP pour le test
- Fonctionnalité installée et redémarrage

```powershell
Install-WindowsFeature Storage-Replica -IncludeManagementTools -Restart   # sur chaque serveur
```

## Tester la topologie

```powershell
Test-SRTopology -SourceComputerName srv-fic-01 -SourceVolumeName D: -SourceLogVolumeName L: `
  -DestinationComputerName srv-fic-secours -DestinationVolumeName D: -DestinationLogVolumeName L: `
  -DurationInMinutes 30 -ResultPath C:\Temp
```

Lancez le test **pendant une période d'activité représentative** : le rapport HTML mesure latence, débit et écritures, et conclut si le mode synchrone est réaliste.

## Créer le partenariat (serveur à serveur)

```powershell
New-SRPartnership -SourceComputerName srv-fic-01 -SourceRGName RG-Fichiers -SourceVolumeName D: -SourceLogVolumeName L: `
  -DestinationComputerName srv-fic-secours -DestinationRGName RG-Fichiers-Secours -DestinationVolumeName D: -DestinationLogVolumeName L: `
  -ReplicationMode Synchronous -LogSizeInBytes 16GB

Get-SRGroup | Select-Object Name, ReplicationMode, @{n='État';e={$_.Replicas.ReplicationStatus}}
(Get-SRGroup).Replicas | Select-Object DataVolume, ReplicationStatus, NumOfBytesRemaining
Get-SRPartnership
```

La **synchronisation initiale** copie tout le volume (seuls les blocs utilisés si la destination est vierge) ; suivez `NumOfBytesRemaining`. Pour de très gros volumes, un amorçage par sauvegarde/restauration est possible (`-Seeded`).

Options utiles à la création du partenariat : `-EnableCompression` (Windows Server 2025 : compression du flux, utile en asynchrone sur lien WAN) et `-EnableEncryption` (chiffrement SMB des échanges).

## Basculer (inverser le sens)

```powershell
# Site principal perdu ou maintenance : la destination devient source (volume monté)
Set-SRPartnership -NewSourceComputerName srv-fic-secours -SourceRGName RG-Fichiers-Secours `
  -DestinationComputerName srv-fic-01 -DestinationRGName RG-Fichiers
```

Après bascule : remettre en ligne les partages/applications sur le serveur de secours (noms DNS, cibles DFS-N), puis inverser à nouveau au retour du site principal. Documentez et **testez** la procédure (au moins une fois par an).

Supprimer la réplication : `Get-SRPartnership | Remove-SRPartnership` puis `Get-SRGroup | Remove-SRGroup` des deux côtés.

## Supervision

| Indicateur | Source |
| --- | --- |
| État de réplication | `(Get-SRGroup).Replicas.ReplicationStatus` = `ContinuouslyReplicating` |
| Retard (asynchrone) | Compteurs *Storage Replica Statistics* : `Number of bytes remaining`, RPO effectif |
| Débit et latence | Compteurs *Storage Replica Partition I/O Statistics*, `Avg. Network Send Latency` |
| Événements | *Microsoft-Windows-StorageReplica/Admin* et *Operational* (perte de connexion, journal plein) |

## Problèmes fréquents

| Symptôme | Cause | Solution |
| --- | --- | --- |
| `Test-SRTopology` en échec | Pare-feu (445, 5985, ICMP), tailles de volumes différentes, GPT | Ouvrir les ports, partitions identiques |
| Lenteur des applications en synchrone | Latence ou bande passante insuffisantes | Mode asynchrone, lien dédié plus rapide |
| Réplication suspendue, journal plein | Rafale d'écritures, coupure réseau prolongée | Journal plus grand (`Set-SRGroup -LogSizeInBytes`), lien |
| Volume de destination inaccessible | Normal : démonté tant qu'il est destination | Inverser le sens (`Set-SRPartnership`) pour y accéder |
| Limite atteinte sur l'édition Standard | 1 partenariat, 2 To | Datacenter |
