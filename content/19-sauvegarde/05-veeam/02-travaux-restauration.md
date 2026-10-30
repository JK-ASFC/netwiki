---
title: Travaux de sauvegarde et restauration
description: Configurer les travaux Veeam — sauvegarde de VM (CBT, modes de transport, traitement applicatif VSS, troncature des journaux SQL/Exchange, indexation), rétention et GFS, sauvegardes synthétiques, travaux de copie vers un second site, agents, réplication, SureBackup ; restaurer une VM entière, Instant Recovery, fichiers, objets applicatifs avec les Veeam Explorers, et vers une autre plateforme ; PowerShell.
tags: [veeam, travaux, gfs, backup copy, surebackup, instant recovery, explorers, powershell]
icon: archive-restore
---

## Travail de sauvegarde de VM

*Home → Backup Job → Virtual machine* :

| Étape | Réglages conseillés |
| --- | --- |
| Objets | Conteneurs (dossiers vCenter, étiquettes **tags**) plutôt que VM une à une : les nouvelles VM sont incluses automatiquement |
| Stockage | Dépôt / SOBR, **rétention** en jours ou points de restauration ; GFS (hebdomadaire, mensuel, annuel) |
| Avancé | Synthétique complet hebdomadaire (Fast Clone), vérification d'intégrité (*health check*) mensuelle, chiffrement des sauvegardes |
| Traitement invité | **Application-aware processing** : VSS cohérent pour AD, SQL, Exchange, SharePoint, Oracle ; troncature des journaux (SQL en mode complet : sauvegarde de journaux toutes les 15 min possible) ; indexation des fichiers invités |
| Planification | Quotidienne hors production, ou plusieurs fois par jour ; enchaînement après un autre travail |

| Mode de transport | Principe | Quand |
| --- | --- | --- |
| **Direct SAN / NFS** | Le proxy lit directement le stockage | Proxys physiques reliés au SAN, débit maximal |
| **HotAdd** | Le proxy (VM) monte les disques des VM | Proxys virtuels, cas général |
| **NBD / NBDSSL** | Lecture via le réseau de gestion de l'ESXi | Repli, petits volumes |

> [!TIP]
> Placez les **VM du serveur Veeam, des contrôleurs de domaine et de vCenter** dans des travaux séparés, et documentez l'ordre de restauration (AD et DNS d'abord).

## Copie et externalisation (règle 3-2-1)

| Travail | Usage |
| --- | --- |
| **Backup Copy** | Copie des points de restauration vers un **second dépôt** (autre site, cloud, S3 immuable), avec sa propre rétention et GFS |
| SOBR niveau capacité (copie) | Copie automatique de chaque sauvegarde vers l'objet |
| Bande | Travaux *Backup to Tape* (copie hors ligne) |
| Veeam Cloud Connect | Dépôt chez un fournisseur de services |

## Autres travaux

- **Agents** (Windows/Linux/macOS) gérés depuis la console : *Protection groups* (découverte AD, liste, CSV), sauvegarde de volume, de fichiers ou de la machine entière.
- **Réplication** : copie de VM vers un hôte de secours (basculement, retour), **CDP** (réplication continue, RPO de quelques secondes, vSphere).
- **SureBackup** : démarre automatiquement les VM sauvegardées dans un **laboratoire virtuel isolé** et vérifie (ping, scripts, analyse antivirus/YARA) qu'elles fonctionnent — preuve du « 0 erreur ».

## Restauration

| Besoin | Fonction |
| --- | --- |
| Remettre une VM en service en quelques minutes | **Instant Recovery** : la VM démarre depuis le dépôt (vPower NFS), puis migration à chaud vers la production |
| VM complète | *Entire VM restore* (emplacement d'origine ou autre, *quick rollback* : seulement les blocs modifiés) |
| Disques | *Virtual disks restore*, *Instant disk recovery* |
| Fichiers | *Guest files restore* (Windows, Linux, autres FS) : navigateur de fichiers, restauration en place ou copie |
| Objets applicatifs | **Veeam Explorers** : Active Directory (objets, attributs, GPO, DNS), Exchange, SQL Server (base à une heure précise), SharePoint, Oracle, PostgreSQL, Microsoft 365 |
| Autre plateforme | Restauration vers Hyper-V, Proxmox, AWS, Azure, GCP (*Restore to …*) |
| Restauration sûre | *Secure Restore* : analyse antivirus des disques avant la remise en production |

## PowerShell

```powershell
Import-Module Veeam.Backup.PowerShell
Connect-VBRServer -Server srv-veeam-01
Get-VBRJob | Select-Object Name, JobType, @{n='Dernier';e={$_.FindLastSession().Result}}
Start-VBRJob -Job (Get-VBRJob -Name "VM-Production")
Get-VBRBackupSession | Where-Object { $_.CreationTime -gt (Get-Date).AddDays(-1) -and $_.Result -ne 'Success' } |
  Select-Object JobName, Result, CreationTime
$point = Get-VBRRestorePoint -Backup (Get-VBRBackup -Name "VM-Production") -Name "srv-web-01" | Sort-Object CreationTime | Select-Object -Last 1
Start-VBRInstantRecovery -RestorePoint $point -VMName "srv-web-01-restaure" -Reason "Test de restauration"
```

Une **API REST** (port 9419) permet aussi l'automatisation et l'intégration (supervision, ITSM).
