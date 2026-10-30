---
title: AD LDS — aide-mémoire des commandes
description: Commandes AD LDS avec exemples — installation du rôle, création d'instance sans assistant (adaminstall et fichier de réponses), import de schémas (ldifde), gestion des objets avec le module ActiveDirectory et ADSI Edit, liaisons et tests (ldp.exe), réplication entre instances (repadmin), service Windows, sauvegarde (dsdbutil), désinstallation d'instance.
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
