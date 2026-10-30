---
title: Partages, droits NTFS et SMB
description: Serveur de fichiers Windows — installation du rôle, création de partages (PowerShell, profils SMB), droits de partage et droits NTFS (héritage, groupes AGDLP, propriétaire, droits effectifs), énumération basée sur l'accès, partages masqués et administratifs, versions SMB et fonctions SMB 3 (multicanal, transparence de basculement, chiffrement, signature), SMB sur QUIC, clichés instantanés.
tags: [windows server, serveur de fichiers, smb, ntfs, partages, abe, smb over quic, clichés instantanés]
icon: folder-lock
---

Le rôle **Serveur de fichiers** (`FS-FileServer`) est présent sur tout Windows Server. Il s'enrichit des fonctions [[14-dfs/01-espaces-noms|DFS]], [[15-fsrm/01-quotas-filtrage-classification|FSRM]], [[18-deduplication/01-deduplication|déduplication]] et des clichés instantanés. Côté Linux, l'équivalent est [[01-samba/01-presentation|Samba]].

## Installation et partages

```powershell
Install-WindowsFeature FS-FileServer, FS-Resource-Manager, FS-DFS-Namespace, FS-DFS-Replication -IncludeManagementTools

New-Item -ItemType Directory -Path D:\Partages\Compta
New-SmbShare -Name "Compta" -Path "D:\Partages\Compta" -FullAccess "CORP\GG-Admins-Fichiers" -ChangeAccess "CORP\Utilisateurs authentifiés" `
  -FolderEnumerationMode AccessBased -CachingMode None -Description "Service comptabilité"

Get-SmbShare | Where-Object Special -eq $false
Get-SmbShareAccess -Name "Compta"
```

| Paramètre | Rôle |
| --- | --- |
| `FolderEnumerationMode AccessBased` | **ABE** : l'utilisateur ne voit que les dossiers auxquels il a accès |
| `CachingMode` | Fichiers hors connexion (`None` pour les données sensibles ou les postes nomades non gérés) |
| `EncryptData` | Chiffrement SMB 3 obligatoire pour ce partage |
| `ContinuouslyAvailable` | Partage à disponibilité continue (cluster) |
| Nom terminé par `$` | Partage masqué (non listé, mais pas sécurisé pour autant) |

## Droits : partage et NTFS

L'accès effectif est le **plus restrictif** des deux : droits de **partage** et droits **NTFS**. Pratique courante : partage en « Utilisateurs authentifiés : Modifier » (ou Contrôle total pour les administrateurs) et **toute** la finesse dans NTFS.

```powershell
# Désactiver l'héritage à la racine du partage et poser des ACL explicites
$acl = Get-Acl D:\Partages\Compta
$acl.SetAccessRuleProtection($true, $false)
$regles = @(
  New-Object System.Security.AccessControl.FileSystemAccessRule("BUILTIN\Administrateurs", "FullControl", "ContainerInherit,ObjectInherit", "None", "Allow"),
  New-Object System.Security.AccessControl.FileSystemAccessRule("NT AUTHORITY\SYSTEM", "FullControl", "ContainerInherit,ObjectInherit", "None", "Allow"),
  New-Object System.Security.AccessControl.FileSystemAccessRule("CORP\DL-Compta-Modification", "Modify", "ContainerInherit,ObjectInherit", "None", "Allow"),
  New-Object System.Security.AccessControl.FileSystemAccessRule("CORP\DL-Compta-Lecture", "ReadAndExecute", "ContainerInherit,ObjectInherit", "None", "Allow")
)
$regles | ForEach-Object { $acl.AddAccessRule($_) }
Set-Acl D:\Partages\Compta $acl
icacls D:\Partages\Compta
```

| Bonne pratique | Explication |
| --- | --- |
| **AGDLP** | Comptes → groupes **G**lobaux (rôle métier) → groupes de domaine **L**ocal (droit sur la ressource, ex. `DL-Compta-Lecture`) → **P**ermission |
| Jamais d'utilisateur nommé dans une ACL | Les droits suivent les groupes, les départs se gèrent dans AD |
| « Modifier » plutôt que « Contrôle total » | Les utilisateurs ne doivent pas changer les ACL |
| Peu de ruptures d'héritage | Arborescence lisible : droits sur les 2–3 premiers niveaux |
| Propriétaire `Administrateurs` | Évite qu'un créateur garde des droits implicites (`CREATOR OWNER` limité) |

Vérification : onglet *Accès effectif* des propriétés avancées de sécurité, ou `Get-NTFSAccess` (module NTFSSecurity).

## SMB

| Version | Système | Apports |
| --- | --- | --- |
| SMB 1 | Obsolète | **À désactiver** (WannaCry, absence de chiffrement) — retiré par défaut depuis Windows 10 1709 / Server 2019 |
| SMB 2.x | Vista / 2008 | Performances, moins de messages |
| **SMB 3.x** | 2012 et suivants | Multicanal, basculement transparent, **chiffrement** AES-GCM, signature AES-GMAC, SMB Direct (RDMA), compression (3.1.1, 2022+) |

```powershell
Get-SmbServerConfiguration | Select-Object EnableSMB1Protocol, EnableSMB2Protocol, RequireSecuritySignature, EncryptData, RejectUnencryptedAccess
Set-SmbServerConfiguration -EnableSMB1Protocol $false -Force
Get-SmbConnection          # côté client : version négociée (Dialect), signature, chiffrement
Get-SmbMultichannelConnection
```

**Windows Server 2025** et Windows 11 24H2 exigent par défaut la **signature SMB** (client et serveur) et bloquent l'invité non authentifié ; mesurez l'impact sur les anciens NAS et copieurs avant de généraliser.

### SMB sur QUIC

**SMB sur QUIC** (port **443/UDP**, TLS 1.3) permet l'accès aux partages depuis Internet **sans VPN**, avec certificat serveur et authentification Kerberos/NTLM dans le tunnel. Disponible sur toutes les éditions de Windows Server 2025 (auparavant Azure Edition seulement) ; contrôle d'accès client par certificats possible.

```powershell
New-SmbServerCertificateMapping -Name fichiers.exemple.fr -Thumbprint <empreinte> -StoreName My
```

## Clichés instantanés

Les **clichés instantanés des dossiers partagés** (VSS) permettent aux utilisateurs de restaurer eux-mêmes une version précédente (*Propriétés → Versions précédentes*).

```powershell
vssadmin add shadowstorage /for=D: /on=E: /maxsize=15%
# Planification : propriétés du volume → Clichés instantanés → deux par jour (7 h, 12 h) ; ou tâche planifiée
vssadmin create shadow /for=D:
vssadmin list shadows /for=D:
```

Les clichés instantanés **ne sont pas une sauvegarde** (même volume, supprimés en premier par un rançongiciel) : voir [[07-windows-server-backup/01-sauvegarde-restauration|sauvegarde Windows Server]] et les solutions de [[01-restic/01-presentation-installation|sauvegarde]].

Suite : [[02-securite-migration-depannage|sécurité, audit, migration et dépannage]].
