---
title: Sauvegarde et restauration avec Windows Server Backup
description: Fonctionnalité Sauvegarde Windows Server — périmètre et limites (un serveur, pas de catalogue central, pas d'immutabilité), types de sauvegardes (complète, volumes, état du système, récupération complète), cibles (disque dédié, volume, partage réseau), planification avec wbadmin et PowerShell, sauvegarde VSS complète ou copie, restauration de fichiers, de volumes, de l'état du système et du serveur complet depuis WinRE, sauvegarde d'Hyper-V et supervision.
tags: [windows server backup, wbadmin, sauvegarde, état du système, bare metal, restauration, vss]
icon: archive
---

**Sauvegarde Windows Server** (`Windows-Server-Backup`) est l'outil de sauvegarde intégré à Windows Server. Il convient aux **petits environnements**, aux serveurs isolés et aux sauvegardes d'**état du système** des contrôleurs de domaine. Pour un parc, une solution centralisée ([[05-veeam/01-presentation-architecture|Veeam]], [[06-nakivo/01-presentation-installation|NAKIVO]], [[03-bacula/01-presentation-architecture|Bacula]]) apporte catalogue, rétention, copies hors site et immutabilité.

| Atout | Limite |
| --- | --- |
| Gratuit, intégré, VSS natif | Un serveur à la fois, pas de console centrale |
| Récupération complète (*bare metal*) depuis WinRE | Une seule cible planifiée, rétention gérée par l'espace disque |
| Incrémental au niveau bloc sur disque dédié | Partage réseau : une seule version conservée (écrasée) |
| Applications compatibles VSS (AD, Hyper-V, fichiers) | Pas d'immutabilité ni de chiffrement des sauvegardes intégré |

## Installation

```powershell
Install-WindowsFeature Windows-Server-Backup -IncludeManagementTools
# Console : wbadmin.msc ; ligne de commande : wbadmin ; PowerShell : module WindowsServerBackup
```

## Types de sauvegarde

| Élément | Contenu |
| --- | --- |
| **Récupération complète** (*bare metal*) | Volumes critiques (système, démarrage, état du système) : restauration du serveur sur un matériel vierge |
| **État du système** | Registre, base de démarrage, fichiers système protégés, et selon les rôles : **AD DS (NTDS, SYSVOL)**, AD CS, cluster, IIS |
| Volumes / fichiers | Volumes de données entiers ou dossiers choisis |
| Hyper-V | VM individuelles (via VSS de l'hôte) |

## Cibles

| Cible | Remarques |
| --- | --- |
| **Disque dédié** (recommandé) | Formaté et masqué par l'outil ; conserve plusieurs versions (instantanés VSS) jusqu'à saturation ; incrémental bloc |
| Volume existant | Partagé avec d'autres données, moins performant |
| **Partage réseau** | Copie hors du serveur, mais **une seule version** (chaque sauvegarde remplace la précédente) — prévoir une rotation par dossier ou un second outil |

## Planifier

```powershell
$politique = New-WBPolicy
Add-WBBareMetalRecovery -Policy $politique
Add-WBSystemState -Policy $politique
Add-WBVolume -Policy $politique -Volume (Get-WBVolume -VolumePath "D:")
$disque = Get-WBDisk | Where-Object { $_.DiskNumber -eq 2 }
Add-WBBackupTarget -Policy $politique -Target (New-WBBackupTarget -Disk $disque -Label "Sauvegarde-srv-fic-01")
Set-WBSchedule -Policy $politique -Schedule 21:00, 03:00
Set-WBVssBackupOption -Policy $politique -VssFullBackup        # « complète » : tronque les journaux des applications (si aucun autre outil ne sauvegarde)
Set-WBPolicy -Policy $politique -Force
```

```text Équivalent wbadmin
wbadmin enable backup -addtarget:{GUID-du-disque} -schedule:21:00,03:00 -include:D: -allCritical -systemState -vssFull -quiet
```

Sauvegarde ponctuelle vers un partage :

```text
wbadmin start backup -backupTarget:\\srv-sav-01\WSB\srv-fic-01 -include:C:,D: -allCritical -systemState -vssCopy -quiet
wbadmin start systemstatebackup -backupTarget:E: -quiet
```

`-vssCopy` (sauvegarde « copie ») ne tronque pas les journaux : à utiliser si un autre logiciel gère la sauvegarde des applications.

## Consulter et restaurer

```text
wbadmin get versions
wbadmin get items -version:10/29/2026-21:00

# Fichiers ou dossiers
wbadmin start recovery -version:10/29/2026-21:00 -itemType:File -items:D:\Partages\Compta\Budget -recoveryTarget:D:\Restauration -recursive

# Volume complet
wbadmin start recovery -version:10/29/2026-21:00 -itemType:Volume -items:D:

# État du système (contrôleur de domaine : démarrer en mode DSRM pour une restauration d'AD)
wbadmin start systemstaterecovery -version:10/29/2026-21:00
```

Le format de date de `-version` dépend des paramètres régionaux affichés par `wbadmin get versions`. Pour un contrôleur de domaine, la restauration **non autoritaire** puis **autoritaire** (`ntdsutil`) est décrite dans [[01-active-directory/08-sauvegarde-restauration|sauvegarde et restauration AD]].

### Récupération complète

1. Démarrer le serveur (ou le nouveau matériel) sur le **média d'installation** de Windows Server → *Réparer l'ordinateur* → *Dépannage* → **Récupération de l'image système**.
2. Sélectionner la sauvegarde (disque local ou partage réseau, avec pilotes réseau/stockage si nécessaire).
3. Option *Formater et repartitionner les disques*, puis restauration.

Testez cette procédure sur une VM : c'est le seul moyen d'être sûr des pilotes et du démarrage UEFI.

## Hyper-V

L'outil sauvegarde les VM d'un **hôte non clusterisé** (*Add-WBVirtualMachine*), avec restauration d'une VM individuelle. Pour les clusters et les volumes CSV, utilisez une solution dédiée.

## Supervision et problèmes fréquents

| Contrôle / symptôme | Cause | Solution |
| --- | --- | --- |
| Résultat de la dernière sauvegarde | Événements *Microsoft-Windows-Backup* (4 = succès, 5/9/49/517/521 = échecs) | Alerte sur les événements d'échec, `Get-WBSummary` |
| `The backup operation stopped because a required file could not be copied` / erreurs VSS | Rédacteur VSS en échec | `vssadmin list writers`, redémarrer le service concerné, espace pour les clichés |
| Disque de sauvegarde plein, anciennes versions supprimées | Rétention limitée par l'espace | Disque plus grand, rotation de deux disques (un hors site) |
| Partage réseau : une seule version | Comportement normal | Dossiers par jour (script), ou outil centralisé |
| Récupération complète : disque introuvable dans WinRE | Pilote RAID/NVMe absent | Charger le pilote (*Installer un pilote*) |
| État du système trop volumineux / lent | Nombreux fichiers dans les dossiers système | Normal ; planifier hors production |
