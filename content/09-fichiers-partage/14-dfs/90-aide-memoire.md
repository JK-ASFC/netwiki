---
title: DFS (espaces de noms et réplication) — aide-mémoire des commandes
description: Commandes DFS avec exemples — espaces de noms de domaine (New-DfsnRoot, dossiers, cibles, priorités, énumération), dfsutil, réplication DFSR (groupes, dossiers répliqués, membres, connexions, préremplissage, arriéré Get-DfsrBacklog, état, diagnostics dfsrdiag), santé et rapports.
tags: [aide-mémoire, dfs, dfsn, dfsr, réplication, windows server]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-espaces-noms|DFS]].

## Espaces de noms (DFS-N)

```powershell
Install-WindowsFeature FS-DFS-Namespace, FS-DFS-Replication -IncludeManagementTools
New-DfsnRoot -Path "\\corp.exemple.fr\Partages" -TargetPath "\\fs01\Partages" -Type DomainV2 -EnableAccessBasedEnumeration $true
New-DfsnRootTarget -Path "\\corp.exemple.fr\Partages" -TargetPath "\\fs02\Partages"
New-DfsnFolder -Path "\\corp.exemple.fr\Partages\Reseau" -TargetPath "\\fs01\Reseau"
New-DfsnFolderTarget -Path "\\corp.exemple.fr\Partages\Reseau" -TargetPath "\\fs02\Reseau"
Set-DfsnFolderTarget -Path "\\corp.exemple.fr\Partages\Reseau" -TargetPath "\\fs02\Reseau" -ReferralPriorityClass GlobalLow
Set-DfsnFolderTarget -Path "\\corp.exemple.fr\Partages\Reseau" -TargetPath "\\fs01\Reseau" -State Offline     # maintenance
Get-DfsnRoot -Domain corp.exemple.fr
Get-DfsnFolder -Path "\\corp.exemple.fr\Partages\*"
Get-DfsnFolderTarget -Path "\\corp.exemple.fr\Partages\Reseau"
dfsutil diag viewdfsdirs D:
dfsutil cache referral flush          # côté client
```

## Réplication (DFS-R)

```powershell
New-DfsReplicationGroup -GroupName "RG-Reseau" | New-DfsReplicatedFolder -FolderName "Reseau"
Add-DfsrMember -GroupName "RG-Reseau" -ComputerName fs01, fs02
Add-DfsrConnection -GroupName "RG-Reseau" -SourceComputerName fs01 -DestinationComputerName fs02
Set-DfsrMembership -GroupName "RG-Reseau" -FolderName "Reseau" -ContentPath "D:\Reseau" -ComputerName fs01 -PrimaryMember $true -Force
Set-DfsrMembership -GroupName "RG-Reseau" -FolderName "Reseau" -ContentPath "D:\Reseau" -ComputerName fs02 -Force
Set-DfsrMembership -GroupName "RG-Reseau" -FolderName "Reseau" -ComputerName fs01 -StagingPathQuotaInMB 16384 -Force
Get-DfsrMembership -GroupName "RG-Reseau" | Format-Table ComputerName, ContentPath, Enabled
Get-DfsrBacklog -GroupName "RG-Reseau" -FolderName "Reseau" -SourceComputerName fs01 -DestinationComputerName fs02 -Verbose
(Get-DfsrBacklog -GroupName "RG-Reseau" -FolderName "Reseau" -SourceComputerName fs01 -DestinationComputerName fs02 -Verbose 4>&1).Message
Get-DfsrState -ComputerName fs02 | Select-Object -First 10
Update-DfsrConfigurationFromAD -ComputerName fs01, fs02
Write-DfsrHealthReport -GroupName "RG-Reseau" -ReferenceComputerName fs01 -Path C:\Temp\rapport-dfsr
# Préremplissage d'un nouveau membre (copie initiale rapide avec ACL)
robocopy D:\Reseau \\fs02\D$\Reseau /E /B /COPYALL /R:6 /W:5 /MT:64 /XD DfsrPrivate /LOG:C:\Temp\preseed.log
Get-DfsrFileHash -Path D:\Reseau\budget.xlsx          # comparer les empreintes entre membres
dfsrdiag pollad
dfsrdiag replicationstate
```

## Journaux

```powershell
Get-WinEvent -LogName "DFS Replication" -MaxEvents 20 | Format-Table TimeCreated, Id, Message -Wrap
```

| Événement | Sens |
| --- | --- |
| 4012 | Membre déconnecté trop longtemps (MaxOfflineTimeInDays) : réplication arrêtée |
| 2213 | Arrêt non propre, reprise manuelle requise (selon configuration) |
| 4202 / 4204 | Quota de transit (staging) dépassé / nettoyé |
| 5002 / 5008 | Problème de connexion avec un partenaire |
