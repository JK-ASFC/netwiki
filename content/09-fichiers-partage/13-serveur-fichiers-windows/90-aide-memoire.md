---
title: Serveur de fichiers Windows — aide-mémoire des commandes
description: Commandes du serveur de fichiers Windows avec exemples — partages SMB (New-SmbShare, droits de partage, énumération basée sur l'accès, chiffrement), configuration SMB (SMB1, signature, chiffrement), droits NTFS (icacls, Get-Acl/Set-Acl, propriété), sessions et fichiers ouverts, clichés instantanés (vssadmin), quotas NTFS, robocopy (migration, miroir, journal), réparation de volumes.
tags: [aide-mémoire, smb, ntfs, icacls, robocopy, partages, windows server]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-partages-ntfs-smb|serveur de fichiers Windows]].

## Partages SMB

```powershell
New-Item -ItemType Directory D:\Partages\Reseau
New-SmbShare -Name "Reseau" -Path "D:\Partages\Reseau" -FullAccess "CORP\GG-Admins-Fichiers" -ChangeAccess "CORP\GG-Reseau" -FolderEnumerationMode AccessBased -CachingMode None -EncryptData $true
Get-SmbShare | Where-Object Special -eq $false | Format-Table Name, Path, EncryptData, FolderEnumerationMode
Get-SmbShareAccess -Name "Reseau"
Grant-SmbShareAccess -Name "Reseau" -AccountName "CORP\GG-Direction" -AccessRight Read -Force
Revoke-SmbShareAccess -Name "Reseau" -AccountName "Tout le monde" -Force
Set-SmbShare -Name "Reseau" -Description "Équipe réseau" -Force
Remove-SmbShare -Name "Ancien" -Force
net share
```

## Configuration SMB

```powershell
Get-SmbServerConfiguration | Select-Object EnableSMB1Protocol, EnableSMB2Protocol, RequireSecuritySignature, EncryptData, RejectUnencryptedAccess
Set-SmbServerConfiguration -EnableSMB1Protocol $false -RequireSecuritySignature $true -Force
Disable-WindowsOptionalFeature -Online -FeatureName SMB1Protocol -NoRestart
Get-SmbConnection          # côté client : dialecte négocié (3.1.1)
```

## Sessions et fichiers ouverts

```powershell
Get-SmbSession | Select-Object ClientComputerName, ClientUserName, NumOpens
Get-SmbOpenFile | Where-Object Path -like "*budget*" | Select-Object ClientUserName, Path
Get-SmbOpenFile | Where-Object Path -like "*budget.xlsx" | Close-SmbOpenFile -Force
Close-SmbSession -ClientUserName "CORP\bpetit" -Force
openfiles /query /s srv-fichiers /fo table
```

## Droits NTFS (icacls)

```powershell
icacls D:\Partages\Reseau
icacls D:\Partages\Reseau /inheritance:r
icacls D:\Partages\Reseau /grant "CORP\GG-Admins-Fichiers:(OI)(CI)F" "SYSTEM:(OI)(CI)F" "CORP\GG-Reseau:(OI)(CI)M"
icacls D:\Partages\Reseau\Direction /grant "CORP\GG-Direction:(OI)(CI)RX" /remove "CORP\GG-Reseau"
icacls D:\Partages /save C:\Temp\acl-partages.txt /t /c     # sauvegarder les ACL
icacls D:\ /restore C:\Temp\acl-partages.txt                 # restaurer
icacls D:\Partages\Reseau /reset /t /c                        # rétablir l'héritage
takeown /f D:\Partages\Orphelin /r /d o                       # reprendre la propriété
icacls D:\Partages\Reseau /findsid "CORP\bpetit" /t /c        # où ce compte a-t-il des droits ?
(Get-Acl D:\Partages\Reseau).Access | Format-Table IdentityReference, FileSystemRights, IsInherited
```

## Clichés instantanés (versions précédentes)

```powershell
vssadmin list shadows /for=D:
vssadmin list shadowstorage
vssadmin add shadowstorage /for=D: /on=D: /maxsize=15%
vssadmin create shadow /for=D:          # Windows Server
# Planification : tâche planifiée « ShadowCopyVolume… » ou propriétés du volume → Clichés instantanés
```

## robocopy

```powershell
# Migration avec ACL, propriétaires et horodatages, journal, nouvelles tentatives limitées
robocopy \\ancien\partage D:\Partages\Reseau /E /COPYALL /DCOPY:DAT /R:1 /W:1 /MT:32 /LOG:C:\Temp\migration.log /TEE /NP
# Synchronisation miroir (supprime à destination ce qui n'existe plus à la source !)
robocopy D:\Partages\Reseau \\srv-pra\Reseau /MIR /COPY:DATSOU /R:1 /W:1 /MT:16 /LOG+:C:\Temp\miroir.log
# Simulation
robocopy D:\Source E:\Cible /MIR /L /NJH /NJS
```

| Code retour | Sens |
| --- | --- |
| 0 | Rien à copier |
| 1 | Fichiers copiés avec succès |
| 2, 3 | Fichiers supplémentaires (et copiés) |
| ≥ 8 | Échecs : consulter le journal |

## Volumes

```powershell
Get-Volume | Format-Table DriveLetter, FileSystemLabel, FileSystem, SizeRemaining, Size
Repair-Volume -DriveLetter D -Scan
Repair-Volume -DriveLetter D -SpotFix
fsutil quota query D:
fsutil behavior query disablelastaccess
```
