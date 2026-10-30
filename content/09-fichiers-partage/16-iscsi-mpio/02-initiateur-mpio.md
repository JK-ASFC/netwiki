---
title: Initiateur iSCSI, MPIO et dépannage
description: Connecter Windows Server à un SAN iSCSI — service initiateur, portails et sessions persistantes, liaison aux interfaces dédiées, fonctionnalité Multipath I/O (DSM Microsoft ou constructeur, revendication automatique des périphériques iSCSI), stratégies d'équilibrage (Round Robin, Least Queue Depth, basculement), vérification des chemins, réglages (délais, trames étendues, RSS) et problèmes fréquents.
tags: [iscsi, mpio, multipath, windows server, san, round robin, initiateur, dépannage]
icon: split
---

## Initiateur iSCSI

```powershell
Set-Service MSiSCSI -StartupType Automatic; Start-Service MSiSCSI
(Get-InitiatorPort).NodeAddress              # IQN de ce serveur (à déclarer sur la cible)

# Un portail par chemin, lié à l'interface iSCSI correspondante
New-IscsiTargetPortal -TargetPortalAddress 10.10.1.20 -InitiatorPortalAddress 10.10.1.11
New-IscsiTargetPortal -TargetPortalAddress 10.10.2.20 -InitiatorPortalAddress 10.10.2.11
Get-IscsiTarget
```

Les interfaces iSCSI : IP fixes, **sans passerelle** ni enregistrement DNS, NetBIOS désactivé, liaisons inutiles décochées (partage de fichiers, client Microsoft), pilotes et micrologiciels à jour.

## MPIO

Sans MPIO, deux sessions vers la même LUN font apparaître **deux disques** (risque de corruption) ou aucune redondance.

```powershell
Install-WindowsFeature Multipath-IO        # redémarrage requis
# Revendiquer automatiquement les périphériques iSCSI par le DSM Microsoft
Enable-MSDSMAutomaticClaim -BusType iSCSI
# Ou ajouter l'identifiant d'une baie : New-MSDSMSupportedHW -VendorId "VENDOR" -ProductId "PRODUIT"
Restart-Computer

# Connexions : une session par chemin, persistantes, MPIO activé
$cible = (Get-IscsiTarget | Where-Object NodeAddress -like "*cluster-hv*").NodeAddress
Connect-IscsiTarget -NodeAddress $cible -TargetPortalAddress 10.10.1.20 -InitiatorPortalAddress 10.10.1.11 -IsMultipathEnabled $true -IsPersistent $true
Connect-IscsiTarget -NodeAddress $cible -TargetPortalAddress 10.10.2.20 -InitiatorPortalAddress 10.10.2.11 -IsMultipathEnabled $true -IsPersistent $true

Get-IscsiSession | Format-Table TargetNodeAddress, InitiatorPortalAddress, IsConnected, IsPersistent
```

Si la baie fournit son propre **DSM** (module spécifique) ou recommande des réglages particuliers, suivez la documentation du constructeur (beaucoup utilisent le DSM Microsoft avec une stratégie imposée).

## Stratégies d'équilibrage

| Stratégie | Comportement | Usage |
| --- | --- | --- |
| **Round Robin** (RR) | Alterne les E/S sur tous les chemins actifs | Baies actif/actif |
| **Least Queue Depth** (LQD) | Chemin avec le moins d'E/S en attente | Bon choix général, chemins de performances inégales |
| Round Robin with Subset | RR sur des chemins actifs, autres en secours | Baies ALUA (chemins optimisés / non optimisés) |
| Failover Only | Un chemin actif, les autres en secours | Baies actif/passif |
| Weighted Paths | Poids par chemin | Cas particuliers |

```powershell
Set-MSDSMGlobalDefaultLoadBalancePolicy -Policy LQD
Get-MSDSMGlobalDefaultLoadBalancePolicy
mpclaim -s -d                # disques MPIO et stratégie
mpclaim -s -d 0              # chemins d'un disque (actif/en veille)
```

## Mise en service du disque

```powershell
Get-Disk | Where-Object BusType -eq iSCSI
Initialize-Disk -Number 3 -PartitionStyle GPT
New-Partition -DiskNumber 3 -UseMaximumSize -AssignDriveLetter | Format-Volume -FileSystem NTFS -AllocationUnitSize 65536 -NewFileSystemLabel "Donnees-iSCSI"
```

En cluster, n'initialisez le disque que sur **un** nœud, puis ajoutez-le au cluster (CSV) ; les autres nœuds le verront hors ligne. Le système de fichiers ReFS ou NTFS en unités de 64 Ko est courant pour Hyper-V et SQL Server.

## Réglages

| Réglage | Recommandation |
| --- | --- |
| Délais iSCSI (`MaxRequestHoldTime`, `LinkDownTime`) | Selon le constructeur (ex. 60 s / 35 s) : laisser le temps aux basculements de la baie |
| Trames étendues | `Set-NetAdapterAdvancedProperty -DisplayName "Jumbo Packet" -DisplayValue 9014` sur les deux chemins ; vérifier `ping -f -l 8972 10.10.1.20` |
| RSS, déchargements | Activés selon le pilote ; interruption de modération selon les tests |
| Délestage iSCSI matériel (HBA, iSOE) | Si cartes compatibles et validées par la baie |

## Dépannage

| Symptôme | Cause | Solution |
| --- | --- | --- |
| Disque visible deux fois | MPIO absent ou périphérique non revendiqué | Installer MPIO, `Enable-MSDSMAutomaticClaim`, redémarrer |
| Un seul chemin actif | Seconde session non créée ou réseau B en panne | `Get-IscsiSession`, `mpclaim -s -d <n>` |
| Déconnexions fréquentes (événements iScsiPrt 20, 39, 129) | MTU incohérente, commutateur saturé, pilote | Test MTU de bout en bout, statistiques des ports, mises à jour |
| Latence élevée | Chemins mal équilibrés, baie saturée, réseau partagé | Stratégie LQD, réseau dédié, compteurs *Disque physique* |
| Cible injoignable après redémarrage | Sessions non persistantes, ordre de démarrage | `-IsPersistent $true`, dépendance des services (MSiSCSI avant les applications) |
| `Authentication failure` | CHAP différent, IQN non autorisé | Vérifier secret et `InitiatorIds` de la cible |
