---
title: Déduplication des données
description: Déduplication de Windows Server — fonctionnement post-traitement par blocs de taille variable et magasin de blocs, volumes NTFS et ReFS (déduplication et compression ReFS de Windows Server 2025), types d'usage (Par défaut, Hyper-V/VDI, Sauvegarde), évaluation avec DDPEval, activation, tâches d'optimisation, de nettoyage et de vérification, planification, exclusions, interactions avec la sauvegarde et les antivirus, supervision et problèmes fréquents.
tags: [déduplication, windows server, ntfs, refs, stockage, optimisation, ddpeval, sauvegarde]
icon: layers
---

La **déduplication des données** réduit l'espace occupé en stockant une seule fois les blocs identiques d'un volume. Elle fonctionne en **post-traitement** : les fichiers sont écrits normalement, puis une tâche planifiée les découpe en blocs de taille variable (32–128 Ko), déplace les blocs uniques dans un **magasin de blocs** (`System Volume Information\Dedup`) et remplace les fichiers par des points d'analyse.

| Données | Gain typique |
| --- | --- |
| Partages de fichiers utilisateurs | 30–50 % |
| Bibliothèques logicielles, ISO | 70–80 % |
| VHDX de VDI (même système) | 80–95 % |
| Cibles de sauvegarde (fichiers de sauvegarde non chiffrés) | 50–90 % |
| Bases de données actives, vidéos, fichiers déjà compressés ou chiffrés | Faible ou nul : **ne pas** dédupliquer |

## NTFS ou ReFS

| Système de fichiers | Remarques |
| --- | --- |
| **NTFS** | Déduplication classique (Windows Server 2012+), types d'usage ci-dessous |
| ReFS (Windows Server 2019+) | Déduplication prise en charge sur ReFS |
| **ReFS — Windows Server 2025** | Nouvelle **déduplication et compression ReFS** (`Enable-ReFSDedup`), conçue pour les volumes actifs (Hyper-V, Azure Local) |

## Types d'usage

| Type | Paramètres | Pour |
| --- | --- | --- |
| **Par défaut** (*Default*) | Fichiers de plus de 3 jours, optimisation en arrière-plan | Serveurs de fichiers généraux |
| **Hyper-V** | Fichiers ouverts optimisés, réglages pour VHDX | **VDI** (bureaux virtuels), pas les VM serveurs génériques |
| **Sauvegarde** (*Backup*) | Optimisation agressive en priorité | Cibles de sauvegarde (DPM, Veeam sur volume Windows : suivre les recommandations de l'éditeur) |

## Évaluer, activer, planifier

```powershell
Install-WindowsFeature FS-Data-Deduplication
# Estimer le gain sur des données existantes (outil installé avec la fonctionnalité)
C:\Windows\System32\DDPEval.exe D:\Partages\

Enable-DedupVolume -Volume D: -UsageType Default
Set-DedupVolume -Volume D: -MinimumFileAgeDays 3 -ExcludeFolder "D:\Partages\Bases","D:\Partages\Video" -ExcludeFileType "zip","7z","mp4","pst"
Start-DedupJob -Volume D: -Type Optimization -Memory 50       # première optimisation manuelle
Get-DedupJob
Get-DedupStatus -Volume D: | Format-List SavedSpace, OptimizedFilesCount, InPolicyFilesCount, LastOptimizationTime
Get-DedupVolume -Volume D: | Format-List SavingsRate, SavedSpace
```

| Tâche | Rôle | Planification par défaut |
| --- | --- | --- |
| **Optimisation** | Déduplique les nouveaux fichiers | Toutes les heures en arrière-plan + hebdomadaire |
| **Nettoyage de la mémoire** (*Garbage Collection*) | Libère les blocs qui ne sont plus référencés (fichiers supprimés) | Hebdomadaire |
| **Vérification** (*Scrubbing*) | Contrôle l'intégrité du magasin, répare depuis les copies de blocs populaires | Hebdomadaire |

```powershell
New-DedupSchedule -Name "OptimisationNuit" -Type Optimization -Start 22:00 -DurationHours 8 -Days Monday,Tuesday,Wednesday,Thursday,Friday -Priority High -Memory 50
Get-DedupSchedule
Start-DedupJob -Volume D: -Type GarbageCollection -Full       # récupère l'espace après une grosse suppression
```

> [!NOTE]
> L'espace libéré par la suppression de fichiers n'apparaît qu'**après** la tâche de nettoyage de la mémoire. Prévoyez une marge d'espace libre (au moins 10 à 20 %) : l'optimisation a besoin d'espace de travail.

## Interactions

| Élément | Point d'attention |
| --- | --- |
| **Sauvegarde** | Un outil compatible sauvegarde le volume **optimisé** (magasin de blocs) ; une sauvegarde fichier par fichier réhydrate les données (plus de volume, plus long). Vérifiez la prise en charge par votre logiciel ([[07-windows-server-backup/01-sauvegarde-restauration\|Windows Server Backup]] la gère) |
| Restauration de fichiers | Restaurer un fichier dédupliqué nécessite les blocs du magasin |
| Antivirus | Exclure `System Volume Information\Dedup` si l'éditeur le recommande |
| Quotas FSRM | Calculés sur la taille logique |
| Réplication DFS-R | Compatible (DFS-R lit les fichiers réhydratés) |
| Déplacement du volume vers un serveur sans la fonctionnalité | Les fichiers optimisés sont **illisibles** : installer la fonctionnalité ou désoptimiser (`Start-DedupJob -Type Unoptimization`) avant |

## Supervision et problèmes fréquents

| Contrôle / symptôme | Cause | Solution |
| --- | --- | --- |
| `SavingsRate` faible | Données incompressibles (médias, chiffrées) | Exclure ces dossiers ou types de fichiers |
| Optimisation jamais terminée | Fenêtre trop courte, mémoire limitée | Planification plus longue, `-Memory`, plus de RAM |
| Espace non libéré | Nettoyage pas encore exécuté | `Start-DedupJob -Type GarbageCollection` |
| Erreurs de corruption (événements Dedup 12xxx) | Défaut du stockage | Tâche de vérification, restauration depuis sauvegarde, contrôler les disques |
| Performances de lecture dégradées | Fragmentation du magasin, disques lents | SSD/cache, défragmentation planifiée par la fonctionnalité |
| Journaux | *Microsoft-Windows-Deduplication/Operational* et *Diagnostic* | Envoyer les erreurs à la supervision |
