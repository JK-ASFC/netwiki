---
title: AD LDS — aide-mémoire des commandes
description: Référence complète des commandes AD LDS avec exemples — installation d'une instance par fichier de réponses, service et ports, suppression d'instance, schémas et import LDIF, objets et comptes AD LDS (mot de passe, désactivation), rôles de partition, autorisations dsacls, outils graphiques, réplication, sauvegarde, instantanés et dsamain, IFM, journaux et diagnostic.
tags: [aide-mémoire, ad lds, ldap, adam, ldifde, windows server]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-installation-exploitation|AD LDS]]. Instance d'exemple `AppAnnuaire`, ports 50389/50636, partition `O=Annuaire,C=FR`.

## Installation et instance

```powershell
Install-WindowsFeature ADLDS -IncludeManagementTools
# Fichier de réponses pour une instance sans assistant
@"
[ADAMInstall]
InstallType=Unique
InstanceName=AppAnnuaire
LocalLDAPPortToListenOn=50389
LocalSSLPortToListenOn=50636
NewApplicationPartitionToCreate=O=Annuaire,C=FR
DataFilesPath=D:\ADLDS\AppAnnuaire\data
LogFilesPath=D:\ADLDS\AppAnnuaire\logs
Administrator=CORP\GG-Admins-ADLDS
ImportLDIFFiles="MS-User.LDF" "MS-InetOrgPerson.LDF"
"@ | Set-Content C:\Temp\adlds.txt -Encoding ASCII
& "$env:SystemRoot\ADAM\adaminstall.exe" /answer:C:\Temp\adlds.txt
Get-Service ADAM_AppAnnuaire
```

## Schémas et import

```powershell
# Importer un schéma fourni (dans %SystemRoot%\ADAM)
ldifde -i -f "$env:SystemRoot\ADAM\MS-UserProxy.LDF" -s localhost:50389 -c "CN=Configuration,DC=X" "#ConfigurationNamingContext" -k
# Exporter / importer des objets
ldifde -f C:\Temp\export.ldf -s localhost:50389 -d "O=Annuaire,C=FR"
ldifde -i -f C:\Temp\import.ldf -s localhost:50389 -k
```

## Objets (module ActiveDirectory avec -Server)

```powershell
New-ADOrganizationalUnit -Name "Utilisateurs" -Path "O=Annuaire,C=FR" -Server localhost:50389
New-ADUser -Name "app-portail" -Path "OU=Utilisateurs,O=Annuaire,C=FR" -Server localhost:50389 -AccountPassword (Read-Host -AsSecureString) -Enabled $true
Get-ADObject -Filter * -SearchBase "O=Annuaire,C=FR" -Server localhost:50389 | Select-Object Name, ObjectClass
Set-ADObject "CN=app-portail,OU=Utilisateurs,O=Annuaire,C=FR" -Replace @{description="Compte du portail"} -Server localhost:50389
# Ajouter un membre au rôle Readers de la partition
Add-ADGroupMember -Identity "CN=Readers,CN=Roles,O=Annuaire,C=FR" -Members "CN=app-portail,OU=Utilisateurs,O=Annuaire,C=FR" -Server localhost:50389
```

## Outils graphiques et tests

```powershell
adsiedit.msc        # connexion : localhost:50389, contexte O=Annuaire,C=FR
ldp.exe             # Connexion → Liaison → Parcourir
```

## Réplication et sauvegarde

```powershell
# Ajouter une réplique sur un autre serveur : fichier de réponses avec InstallType=Replica, ReplicationSecurityRepresentation, SourceServer=srv1:50389
repadmin /showrepl localhost:50389
repadmin /syncall localhost:50389 "O=Annuaire,C=FR"
# Instantané de la base (puis sauvegarde de fichiers)
dsdbutil "activate instance AppAnnuaire" snapshot create quit quit
wbadmin start backup -backupTarget:E: -include:D:\ADLDS\AppAnnuaire -quiet
# Supprimer l'instance : Paramètres → Applications → « Instance AD LDS AppAnnuaire »
```

## Instances et service

```powershell
Get-Service ADAM_* | Select-Object Name, Status, StartType
Restart-Service ADAM_AppAnnuaire
Get-ChildItem HKLM:\SYSTEM\CurrentControlSet\Services | Where-Object PSChildName -like "ADAM_*" | Select-Object PSChildName
Get-NetTCPConnection -State Listen | Where-Object LocalPort -in 50389, 50636
Test-NetConnection localhost -Port 50636
# Supprimer une instance
& "$env:SystemRoot\ADAM\adamuninstall.exe" /i:AppAnnuaire
```

## Comptes AD LDS

```powershell
New-ADUser -Name "svc-intranet" -Path "OU=Utilisateurs,O=Annuaire,C=FR" -Server localhost:50389 -AccountPassword (Read-Host -AsSecureString "Mot de passe") -Enabled $true
Set-ADAccountPassword -Identity "CN=svc-intranet,OU=Utilisateurs,O=Annuaire,C=FR" -Reset -NewPassword (Read-Host -AsSecureString "Nouveau") -Server localhost:50389
Set-ADObject "CN=svc-intranet,OU=Utilisateurs,O=Annuaire,C=FR" -Replace @{"msDS-UserAccountDisabled" = $true} -Server localhost:50389    # désactiver
Get-ADObject -LDAPFilter "(objectClass=user)" -SearchBase "O=Annuaire,C=FR" -Server localhost:50389 -Properties "msDS-UserAccountDisabled", whenCreated
# Rôles de la partition (Readers, Users, Administrators)
Get-ADGroupMember -Identity "CN=Administrators,CN=Roles,O=Annuaire,C=FR" -Server localhost:50389
Get-ADGroupMember -Identity "CN=Readers,CN=Roles,O=Annuaire,C=FR" -Server localhost:50389
```

## Autorisations

```powershell
dsacls "\\localhost:50389\O=Annuaire,C=FR"
dsacls "\\localhost:50389\OU=Utilisateurs,O=Annuaire,C=FR" /G "CN=GG-App-Lecture,CN=Roles,O=Annuaire,C=FR:GR" /I:T
```

## Sauvegarde, instantanés, IFM

```powershell
dsdbutil "activate instance AppAnnuaire" snapshot create quit quit
dsdbutil "activate instance AppAnnuaire" snapshot "list all" quit quit
dsdbutil "activate instance AppAnnuaire" snapshot "mount 1" quit quit
dsamain -dbpath "C:\`$SNAP_202611150200_VOLUMED`$\ADLDS\AppAnnuaire\data\adamntds.dit" -ldapport 51389
dsdbutil "activate instance AppAnnuaire" snapshot "unmount *" quit quit
# Support d'installation pour une nouvelle réplique
dsdbutil "activate instance AppAnnuaire" ifm "create full D:\IFM-ADLDS" quit quit
```

## Diagnostic

```powershell
repadmin /showrepl localhost:50389
repadmin /replsummary localhost:50389
Get-WinEvent -LogName "ADAM (AppAnnuaire)" -MaxEvents 30 | Select-Object TimeCreated, Id, LevelDisplayName, Message
ldifde -f C:\Temp\rootdse.ldf -s localhost:50389 -d "" -p Base           # contexte racine (partitions, contrôles)
```
