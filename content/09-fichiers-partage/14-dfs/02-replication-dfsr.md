---
title: Réplication DFS (DFS-R)
description: DFS Replication — réplication multimaître asynchrone par compression différentielle (RDC), groupes de réplication et dossiers répliqués, topologies maillée et en étoile, réplication initiale et clonage de base, quota de transit et dossiers ConflictAndDeleted, planification et bande passante, conflits, lecture seule, SYSVOL, rapports d'intégrité, dfsrdiag et problèmes fréquents.
tags: [dfs, dfs-r, réplication, windows server, staging, conflits, sysvol, dépannage]
icon: refresh-cw
---

**DFS-R** réplique le contenu de dossiers entre plusieurs serveurs, dans tous les sens (multimaître), de façon **asynchrone**. Seuls les blocs modifiés des fichiers sont transmis (*Remote Differential Compression*). Usages : distribution de données vers des sites distants, copie de secours sur un autre site, **SYSVOL** des contrôleurs de domaine.

> [!IMPORTANT]
> DFS-R n'est **pas** une sauvegarde (une suppression ou un chiffrement se réplique) ni un système de fichiers partagé : il ne gère pas le verrouillage entre serveurs. Le dernier écrivain gagne, l'autre version part dans `ConflictAndDeleted`.

## Groupe de réplication

```powershell
Install-WindowsFeature FS-DFS-Replication -IncludeManagementTools

New-DfsReplicationGroup -GroupName "RG-Compta" | New-DfsReplicatedFolder -FolderName "Compta"
Add-DfsrMember -GroupName "RG-Compta" -ComputerName srv-fic-01, srv-fic-lyon
Add-DfsrConnection -GroupName "RG-Compta" -SourceComputerName srv-fic-01 -DestinationComputerName srv-fic-lyon

# Le membre « principal » fait autorité lors de la réplication initiale
Set-DfsrMembership -GroupName "RG-Compta" -FolderName "Compta" -ComputerName srv-fic-01 -ContentPath D:\Partages\Compta -PrimaryMember $true -StagingPathQuotaInMB 32768 -Force
Set-DfsrMembership -GroupName "RG-Compta" -FolderName "Compta" -ComputerName srv-fic-lyon -ContentPath D:\Partages\Compta -StagingPathQuotaInMB 32768 -Force

Update-DfsrConfigurationFromAD -ComputerName srv-fic-01, srv-fic-lyon
Get-DfsrMembership -GroupName "RG-Compta"
```

| Topologie | Usage |
| --- | --- |
| **Étoile** (*hub and spoke*) | Siège (concentrateur) ↔ sites ; évite les connexions entre tous les sites |
| Maillage complet | ≤ 10 membres |
| Lecture seule | Membres d'agence qui ne doivent jamais renvoyer de modifications (`-ReadOnly $true`) |

## Réplication initiale

Le **membre principal** fait autorité : les fichiers différents chez les autres membres sont déplacés dans `PreExisting`. Pour de gros volumes, **préamorcez** les données (robocopy avec ACL, ou sauvegarde restaurée) puis laissez DFS-R comparer les empreintes ; le **clonage de base de données** (`Export-DfsrClone` / `Import-DfsrClone`) évite la reconstruction complète.

Tant que l'événement **4104** (réplication initiale terminée) n'est pas apparu sur un membre, ne mettez pas sa cible DFS-N en ligne.

## Quota de transit (*staging*)

Les fichiers sont préparés dans `DfsrPrivate\Staging` avant envoi. Un quota trop petit ralentit tout (événements 4202/4204).

```powershell
# Taille conseillée : au moins la somme des 32 plus gros fichiers du dossier
Get-ChildItem D:\Partages\Compta -Recurse -File | Sort-Object Length -Descending | Select-Object -First 32 |
  Measure-Object -Property Length -Sum | ForEach-Object { [math]::Ceiling($_.Sum / 1MB) }
```

## Planification et bande passante

```powershell
Set-DfsrGroupSchedule -GroupName "RG-Compta" -Day Monday, Tuesday, Wednesday, Thursday, Friday -BandwidthDetail "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF"
Set-DfsrConnectionSchedule -GroupName "RG-Compta" -SourceComputerName srv-fic-01 -DestinationComputerName srv-fic-lyon -ScheduleType Custom -Day Monday -BandwidthDetail "…"
```

Une chaîne de 96 caractères hexadécimaux décrit chaque quart d'heure (0 = pas de réplication, F = pleine vitesse, valeurs intermédiaires = débit limité). Plus simple : planification dans la console *Gestion du système de fichiers distribués DFS*. La **QoS** réseau (DSCP) est une alternative.

## Conflits et suppressions

| Dossier | Contenu |
| --- | --- |
| `DfsrPrivate\ConflictAndDeleted` | Versions perdantes et fichiers supprimés (quota 4 Go par défaut) — restaurables (`Restore-DfsrPreservedFiles`) |
| `DfsrPrivate\PreExisting` | Fichiers écartés lors de la réplication initiale |

## SYSVOL

Les domaines récents répliquent **SYSVOL** par DFS-R (FRS est supprimé depuis Windows Server 2019). Pour un domaine ancien encore en FRS, migrez avec `dfsrmig /setglobalstate 1` → `2` → `3` avant d'ajouter des DC récents. Voir [[01-active-directory/06-sites-replication|sites et réplication AD]].

## Supervision et diagnostic

```powershell
Get-DfsrBacklog -GroupName "RG-Compta" -FolderName "Compta" -SourceComputerName srv-fic-01 -DestinationComputerName srv-fic-lyon -Verbose | Measure-Object
Get-DfsrState -ComputerName srv-fic-lyon | Group-Object UpdateState
Write-DfsrHealthReport -GroupName "RG-Compta" -ReferenceComputerName srv-fic-01 -Path C:\Rapports
dfsrdiag replicationstate /member:srv-fic-lyon
dfsrdiag pollad /member:srv-fic-lyon
```

| Indicateur | Seuil |
| --- | --- |
| **Backlog** (fichiers en attente) | Doit revenir à 0 ; alerte s'il croît durablement |
| Événements 2212/2213 | Arrêt incorrect, réplication suspendue (reprise manuelle `wmic … ResumeReplication` selon l'événement) |
| 4012 | Membre déconnecté au-delà de `MaxOfflineTimeInDays` (60 jours) : réplication bloquée pour éviter la réintroduction d'anciennes données |

## Problèmes fréquents

| Symptôme | Cause | Solution |
| --- | --- | --- |
| Backlog qui ne diminue pas | Staging trop petit, fichiers verrouillés, bande passante | Augmenter le quota, identifier les fichiers ouverts |
| Fichiers « disparus » | Conflit ou suppression répliquée | `ConflictAndDeleted`, sauvegarde |
| Événement 2213 après coupure | Base DFS-R non arrêtée proprement | Reprise indiquée dans l'événement, vérifier l'onduleur |
| Fichiers temporaires non répliqués | Attribut temporaire, filtre par défaut `~*, *.bak, *.tmp` | Normal ; adapter les filtres si nécessaire |
| Réplication jamais commencée | Configuration AD non lue | `dfsrdiag pollad`, réplication AD |
