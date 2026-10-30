---
title: Sauvegarde, corbeille AD et restauration
description: Sauvegarder l'état système des DC, activer et utiliser la corbeille Active Directory, restaurations non autoritaire et autoritaire (objet, OU), instantanés AD montés avec dsamain, restauration autoritaire de SYSVOL (DFSR) et reprise après sinistre de forêt.
tags: [active directory, sauvegarde, restauration, corbeille ad, dsrm, ntdsutil, wbadmin, pra]
icon: archive-restore
---

## Ce qu'il faut sauvegarder

| Élément | Comment |
| --- | --- |
| **État système** de **chaque** DC (au minimum deux par domaine) | Windows Server Backup (`wbadmin`) ou un logiciel compatible AD (*VSS writer NTDS*) |
| GPO | `Backup-GPO -All` (complément pratique pour restaurer une GPO isolée) |
| Mot de passe DSRM | Coffre-fort |
| Documentation | Topologie, IP, rôles FSMO, procédures |

> [!IMPORTANT]
> Une sauvegarde AD n'est utilisable que pendant la **durée de vie des tombstones** (180 jours) : au-delà, la restaurer réintroduirait des objets persistants. Fréquence minimale : **quotidienne**.

## Windows Server Backup

```powershell
Install-WindowsFeature Windows-Server-Backup
# Sauvegarde ponctuelle de l'état système vers un volume dédié
wbadmin start systemstatebackup -backupTarget:E: -quiet
# Sauvegarde vers un partage (une seule version conservée par dossier)
wbadmin start systemstatebackup -backupTarget:\\nas01\sauvegardes-dc\DC01 -quiet
# Lister les versions
wbadmin get versions
```

Planification : tâche planifiée quotidienne exécutant `wbadmin start systemstatebackup`, ou `wbadmin enable backup -include:C: -systemState -schedule:21:00 -addtarget:<disque>`.

```powershell
repadmin /showbackup *        # date de la dernière sauvegarde reconnue par AD (événement 2089 si trop ancienne)
```

## Corbeille Active Directory

Permet de restaurer un objet supprimé **avec tous ses attributs** (y compris appartenances aux groupes et mot de passe), sans redémarrer ni restaurer de sauvegarde, pendant la *Deleted Object Lifetime* (180 jours par défaut).

```powershell
# Activation (irréversible) — niveau fonctionnel de forêt 2008 R2 minimum
Enable-ADOptionalFeature -Identity "Recycle Bin Feature" -Scope ForestOrConfigurationSet -Target corp.exemple.fr
Get-ADOptionalFeature -Filter 'Name -like "Recycle Bin Feature"' | Select-Object EnabledScopes
```

### Restaurer

```powershell
# Lister les objets supprimés
Get-ADObject -Filter 'isDeleted -eq $true -and Name -like "*Alice*"' -IncludeDeletedObjects -Properties lastKnownParent, whenChanged |
  Select-Object Name, lastKnownParent, whenChanged

# Restaurer un utilisateur
Get-ADObject -Filter 'isDeleted -eq $true -and samAccountName -eq "amartin"' -IncludeDeletedObjects | Restore-ADObject

# Restaurer une OU entière : d'abord l'OU, puis son contenu (du parent vers les enfants)
$ou = Get-ADObject -Filter 'isDeleted -eq $true -and Name -like "Paris*" -and ObjectClass -eq "organizationalUnit"' -IncludeDeletedObjects
$ou | Restore-ADObject
Get-ADObject -Filter "isDeleted -eq `$true -and lastKnownParent -eq '$((Get-ADObject -Filter 'Name -eq "Paris"' -SearchBase 'OU=Utilisateurs,OU=Corp,DC=corp,DC=exemple,DC=fr').DistinguishedName)'" -IncludeDeletedObjects |
  Restore-ADObject
```

Le **Centre d'administration Active Directory** (`dsac.exe`) propose aussi un conteneur *Deleted Objects* avec boutons *Restaurer* / *Restaurer vers…*.

> [!TIP]
> Protégez les OU contre la suppression accidentelle (`ProtectedFromAccidentalDeletion`, activé par défaut à la création via les consoles récentes) :
> ```powershell
> Get-ADOrganizationalUnit -Filter * | Set-ADOrganizationalUnit -ProtectedFromAccidentalDeletion $true
> ```

## Restauration non autoritaire

Cas : un DC est corrompu (base NTDS endommagée, système réinstallé). On restaure sa base à une date passée ; il récupère ensuite **les modifications plus récentes par réplication**.

> [!NOTE]
> Souvent, il est plus simple et plus sûr de **réinstaller et repromouvoir** un DC défaillant (après nettoyage des métadonnées) que de le restaurer.

```powershell
# 1. Démarrer en mode DSRM
bcdedit /set safeboot dsrepair
Restart-Computer
# 2. Ouvrir une session avec le compte .\Administrateur et le mot de passe DSRM
wbadmin get versions
wbadmin start systemstaterecovery -version:01/15/2026-21:00 -quiet
# 3. Revenir au démarrage normal
bcdedit /deletevalue safeboot
Restart-Computer
```

## Restauration autoritaire

Cas : des objets ont été supprimés ou modifiés à tort et la corbeille n'est pas activée (ou la modification n'est pas une suppression). On restaure une sauvegarde puis on **marque** certains objets comme faisant autorité : leur numéro de version est augmenté (+100 000) pour qu'ils écrasent l'état actuel sur les autres DC.

```text
# Après « wbadmin start systemstaterecovery » en DSRM, SANS redémarrer :
ntdsutil
activate instance ntds
authoritative restore
restore object "CN=Alice Martin,OU=Paris,OU=Utilisateurs,OU=Corp,DC=corp,DC=exemple,DC=fr"
restore subtree "OU=Paris,OU=Utilisateurs,OU=Corp,DC=corp,DC=exemple,DC=fr"
quit
quit
```

`ntdsutil` génère des fichiers `.ldf` pour restaurer les **liens** (appartenances aux groupes, *back-links*) : après le redémarrage normal et une réplication, importez-les.

```powershell
ldifde -i -k -f ar_20260115-210000_links_corp.exemple.fr.ldf
```

## Instantanés AD (snapshots) et dsamain

Consulter l'état de l'annuaire à une date passée, **sans restauration**, pour comparer ou récupérer des valeurs d'attributs :

```powershell
# Créer un instantané (planifiable)
ntdsutil snapshot "activate instance ntds" create quit quit
ntdsutil snapshot "list all" quit quit
ntdsutil snapshot "mount {GUID-de-l-instantane}" quit quit      # monté en C:\$SNAP_…
# Exposer la base de l'instantané sur un port LDAP dédié
dsamain -dbpath 'C:\$SNAP_202601152100_VOLUMEC$\Windows\NTDS\ntds.dit' -ldapport 51389
# Interroger l'instantané
Get-ADUser amartin -Server dc01.corp.exemple.fr:51389 -Properties *
```

Les consoles AD (ADUC, ADAC) peuvent aussi se connecter à `dc01:51389`. Arrêtez `dsamain` (Ctrl+C) et démontez l'instantané ensuite.

## Restauration autoritaire de SYSVOL (DFSR)

Cas : SYSVOL corrompu ou GPO supprimées sur tous les DC.

1. Arrêter le service **DFSR** sur **tous** les DC.
2. Sur le DC de référence (le plus sain, souvent l'émulateur PDC), dans `CN=SYSVOL Subscription,CN=Domain System Volume,CN=DFSR-LocalSettings,CN=<DC>,OU=Domain Controllers,…` : `msDFSR-Enabled = FALSE` et `msDFSR-Options = 1`.
3. Sur tous les autres DC : `msDFSR-Enabled = FALSE`.
4. Forcer la réplication AD (`repadmin /syncall /AdeP`).
5. Démarrer DFSR sur le DC de référence (événement **4114**), puis y mettre `msDFSR-Enabled = TRUE`, répliquer, lancer `dfsrdiag pollad` (événement **4602**).
6. Démarrer DFSR sur les autres DC, `msDFSR-Enabled = TRUE`, `dfsrdiag pollad` (événements **4114** puis **4614/4604**).

> [!WARNING]
> Cette procédure est délicate : suivez la documentation Microsoft *« How to force authoritative and non-authoritative synchronization for DFSR-replicated SYSVOL »* et ne l'appliquez qu'après avoir sauvegardé le contenu actuel de SYSVOL.

## Reprise après sinistre de la forêt

Scénario extrême (rançongiciel ayant compromis tous les DC) :

1. Isoler le réseau. Ne **jamais** reconnecter un DC compromis.
2. Restaurer **un seul** DC par domaine depuis une sauvegarde **antérieure à la compromission**, sur un réseau isolé.
3. Saisir tous les rôles FSMO, nettoyer les métadonnées de tous les autres DC, augmenter le pool RID (`rIDAvailablePool` + 100 000), invalider le pool actuel.
4. Réinitialiser **deux fois** le mot de passe de **krbtgt**, des comptes à privilèges et des comptes de service, ainsi que les comptes ordinateurs des DC.
5. Reconstruire les autres DC par promotion, puis rétablir progressivement la connectivité.

Microsoft publie le guide *« Active Directory Forest Recovery Guide »* : à imprimer et à tester annuellement dans un environnement isolé.
