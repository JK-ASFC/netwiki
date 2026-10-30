---
title: Ciblage par GPO, approbations, maintenance et dépannage
description: Exploiter WSUS — configuration des clients par GPO (serveur intranet, ciblage côté client, comportement d'installation, échéances, redémarrages), groupes d'ordinateurs et anneaux de déploiement, règles d'approbation automatique, rapports, nettoyage et réindexation de la base, refus des mises à jour remplacées, supervision et problèmes fréquents côté serveur et côté client.
tags: [wsus, gpo, approbations, anneaux, nettoyage, susdb, windows update, dépannage]
icon: settings-2
---

## GPO des clients

*Configuration ordinateur → Modèles d'administration → Composants Windows → Windows Update* (sous-dossier *Gérer les mises à jour proposées depuis Windows Server Update Services* et *Gérer l'expérience de l'utilisateur final*) :

| Paramètre | Valeur |
| --- | --- |
| **Spécifier l'emplacement intranet du service de mise à jour** | `https://srv-wsus-01.corp.exemple.fr:8531` (détection et statistiques) |
| **Autoriser le ciblage côté client** | Nom du groupe : `Postes-Pilote`, `Postes-Production`, `Serveurs-Vague1`… |
| Configurer les mises à jour automatiques | 4 – Téléchargement automatique et planification de l'installation (postes) ; 3 – Téléchargement et notification (serveurs gérés manuellement) |
| Spécifier les échéances | Délai avant installation forcée et redémarrage (postes) |
| Ne pas se connecter à des emplacements Internet Windows Update | Activé (forcer WSUS) |
| Ne pas inclure de pilotes | Activé |

Une GPO **par anneau** liée aux OU ou filtrée par groupe de sécurité ; pour les serveurs, préférez une installation contrôlée (fenêtres de maintenance, ordre des redémarrages) via un outil d'orchestration ou des tâches planifiées.

## Groupes et anneaux

| Groupe | Approbation | Délai |
| --- | --- | --- |
| `Pilote` (informatique, quelques postes par service) | Automatique (règle) | J+0 |
| `Postes-Production` | Manuelle après validation | J+7 |
| `Serveurs-Vague1` (non critiques, préproduction) | Manuelle | J+3 à J+7 |
| `Serveurs-Vague2` (critiques, contrôleurs de domaine en dernier) | Manuelle | J+10 à J+14 |

```powershell
$wsus = Get-WsusServer
$wsus.CreateComputerTargetGroup("Pilote")
# Règle d'approbation automatique (définitions antivirus et mises à jour critiques/sécurité pour le pilote)
$regle = $wsus.CreateInstallApprovalRule("Pilote - Sécurité et critiques")
$classes = New-Object Microsoft.UpdateServices.Administration.UpdateClassificationCollection
$classes.AddRange(($wsus.GetUpdateClassifications() | Where-Object Title -in "Security Updates", "Critical Updates", "Definition Updates"))
$regle.SetUpdateClassifications($classes)
$groupes = New-Object Microsoft.UpdateServices.Administration.ComputerTargetGroupCollection
$groupes.Add(($wsus.GetComputerTargetGroups() | Where-Object Name -eq "Pilote"))
$regle.SetComputerTargetGroups($groupes)
$regle.Enabled = $true; $regle.Save(); $regle.ApplyRule()

# Approbation manuelle des mises à jour de sécurité non refusées pour la production
Get-WsusUpdate -Classification Security -Approval Unapproved -Status FailedOrNeeded |
  Approve-WsusUpdate -Action Install -TargetGroupName "Postes-Production"
```

## Maintenance

Sans entretien, la base **SUSDB** grossit et la console devient inutilisable.

```powershell
# Mensuel : assistant de nettoyage en PowerShell
Invoke-WsusServerCleanup -CleanupObsoleteComputers -CleanupObsoleteUpdates -CleanupUnneededContentFiles `
  -CompressUpdates -DeclineExpiredUpdates -DeclineSupersededUpdates

# Refuser les mises à jour inutiles (ex. architectures absentes)
Get-WsusUpdate -Approval AnyExceptDeclined | Where-Object { $_.Update.Title -match "ARM64|Itanium" } | Deny-WsusUpdate
```

**Réindexation** de SUSDB (script de réindexation fourni par Microsoft, exécuté avec `sqlcmd` sur l'instance WID `np:\\.\pipe\MICROSOFT##WID\tsql\query` ou l'instance SQL) : mensuelle, avant le nettoyage.

## Rapports et supervision

| Contrôle | Méthode |
| --- | --- |
| Conformité | Console WSUS (rapports, *Microsoft Report Viewer*), requêtes PowerShell `Get-WsusComputer` |
| Postes qui ne remontent plus | `LastReportedStatusTime` > 14 jours |
| Synchronisation | Dernière synchronisation réussie (`$wsus.GetSubscription().GetLastSynchronizationInfo()`) |
| Pool IIS, espace disque | Supervision du pool `WsusPool`, volume de contenu |

```powershell
Get-WsusComputer -ToLastReportedStatusTime (Get-Date).AddDays(-14) | Select-Object FullDomainName, LastReportedStatusTime
```

## Côté client

```powershell
# Forcer détection et rapport (Windows 10/11, Server 2016+)
UsoClient StartScan
# Journal Windows Update (ETW → texte)
Get-WindowsUpdateLog -LogPath C:\Temp\WindowsUpdate.log
# Paramètres reçus
Get-ItemProperty HKLM:\SOFTWARE\Policies\Microsoft\Windows\WindowsUpdate
Get-ItemProperty HKLM:\SOFTWARE\Policies\Microsoft\Windows\WindowsUpdate\AU
```

## Problèmes fréquents

| Symptôme | Cause | Solution |
| --- | --- | --- |
| Console : « Erreur de connexion », délais | SUSDB fragmentée, pool IIS saturé | Réindexation, nettoyage, limites du `WsusPool` |
| Clients en erreur `0x8024401C` / `0x80244022` | Délai ou 503 du pool IIS | Pool IIS (mémoire, file), nettoyage |
| `0x80072EE2` / `0x80244010` | Serveur injoignable, proxy, port | URL de la GPO, pare-feu 8530/8531, certificat |
| Clients absents de la console | Image clonée sans Sysprep (même `SusClientId`) | Supprimer `SusClientId` du registre, redémarrer le service, `UsoClient StartScan` |
| Postes dans « Ordinateurs non attribués » | Ciblage côté client désactivé ou nom de groupe erroné | GPO, nom exact du groupe |
| Synchronisation en échec | Proxy, TLS 1.2, accès à Microsoft Update | Paramètres de proxy WSUS, journaux `SoftwareDistribution.log` |
| Espace disque saturé | Produits/langues inutiles, contenu non nettoyé | Revoir le périmètre, `Invoke-WsusServerCleanup` |
