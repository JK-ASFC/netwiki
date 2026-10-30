---
title: Active Directory — aide-mémoire des commandes
description: Toutes les commandes utiles d'Active Directory avec exemples — installation et promotion (Install-ADDSForest, Install-ADDSDomainController), utilisateurs, groupes, ordinateurs et unités d'organisation (module ActiveDirectory), mots de passe et comptes verrouillés, recherches LDAP, GPO (GroupPolicy, gpupdate, gpresult), réplication et santé (repadmin, dcdiag, nltest), rôles FSMO, sauvegarde et restauration (ntdsutil, wbadmin, corbeille AD), DNS intégré, comptes de service gérés et outils en ligne de commande classiques.
tags: [aide-mémoire, active directory, powershell, repadmin, dcdiag, gpo, ntdsutil]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation|Active Directory]]. Les cmdlets nécessitent le module **ActiveDirectory** (RSAT sur un poste : `Add-WindowsCapability -Online -Name Rsat.ActiveDirectory.DS-LDS.Tools~~~~0.0.1.0`).

## Installation et promotion

```powershell
# Installer le rôle et les outils
Install-WindowsFeature AD-Domain-Services -IncludeManagementTools
# Nouvelle forêt
Install-ADDSForest -DomainName "corp.exemple.fr" -DomainNetbiosName "CORP" -ForestMode WinThreshold -DomainMode WinThreshold -InstallDns -SafeModeAdministratorPassword (Read-Host -AsSecureString "DSRM")
# Contrôleur supplémentaire dans un domaine existant
Install-ADDSDomainController -DomainName "corp.exemple.fr" -InstallDns -SiteName "Paris" -Credential (Get-Credential CORP\admin-jdupont) -SafeModeAdministratorPassword (Read-Host -AsSecureString "DSRM")
# Contrôleur en lecture seule (RODC)
Install-ADDSDomainController -DomainName "corp.exemple.fr" -ReadOnlyReplica -SiteName "Agence-Lyon" -InstallDns -Credential (Get-Credential)
# Rétrograder un contrôleur
Uninstall-ADDSDomainController -LocalAdministratorPassword (Read-Host -AsSecureString "Admin local") -DemoteOperationMasterRole
# Vérifier les prérequis avant promotion
Test-ADDSDomainControllerInstallation -DomainName "corp.exemple.fr" -InstallDns
```

## Utilisateurs

```powershell
# Créer un utilisateur
New-ADUser -Name "Alice Martin" -GivenName Alice -Surname Martin -SamAccountName amartin -UserPrincipalName amartin@corp.exemple.fr -Path "OU=Utilisateurs,OU=Paris,DC=corp,DC=exemple,DC=fr" -AccountPassword (Read-Host -AsSecureString "Mot de passe") -Enabled $true -ChangePasswordAtLogon $true
# Afficher un utilisateur avec toutes ses propriétés
Get-ADUser amartin -Properties *
# Rechercher (filtre PowerShell)
Get-ADUser -Filter "Surname -like 'Mart*'" -Properties Department, LastLogonDate | Select-Object Name, Department, LastLogonDate
# Rechercher (filtre LDAP)
Get-ADUser -LDAPFilter "(&(objectCategory=person)(mail=*@exemple.fr))"
# Modifier des attributs
Set-ADUser amartin -Department "Réseau" -Title "Architecte" -Office "Paris"
Set-ADUser amartin -Replace @{extensionAttribute1 = "Badge-1234"}
# Réinitialiser un mot de passe et forcer le changement
Set-ADAccountPassword amartin -Reset -NewPassword (Read-Host -AsSecureString "Nouveau")
Set-ADUser amartin -ChangePasswordAtLogon $true
# Déverrouiller / désactiver / activer
Unlock-ADAccount amartin
Disable-ADAccount amartin
Enable-ADAccount amartin
# Comptes verrouillés, désactivés, expirés, inactifs depuis 90 jours
Search-ADAccount -LockedOut
Search-ADAccount -AccountDisabled -UsersOnly
Search-ADAccount -AccountExpired
Search-ADAccount -AccountInactive -TimeSpan 90.00:00:00 -UsersOnly
# Date d'expiration du mot de passe
Get-ADUser amartin -Properties "msDS-UserPasswordExpiryTimeComputed" | Select-Object Name, @{n="Expire";e={[datetime]::FromFileTime($_."msDS-UserPasswordExpiryTimeComputed")}}
# Déplacer, renommer, supprimer
Get-ADUser amartin | Move-ADObject -TargetPath "OU=Utilisateurs,OU=Lyon,DC=corp,DC=exemple,DC=fr"
Rename-ADObject (Get-ADUser amartin).DistinguishedName -NewName "Alice Martin-Durand"
Remove-ADUser amartin -Confirm:$false
# Création en masse depuis un CSV (Prenom;Nom;Login;OU)
Import-Csv .\comptes.csv -Delimiter ';' | ForEach-Object {
  New-ADUser -Name "$($_.Prenom) $($_.Nom)" -GivenName $_.Prenom -Surname $_.Nom -SamAccountName $_.Login -UserPrincipalName "$($_.Login)@corp.exemple.fr" -Path $_.OU -AccountPassword (ConvertTo-SecureString "Provisoire!2026-$(Get-Random)" -AsPlainText -Force) -Enabled $true -ChangePasswordAtLogon $true
}
```

## Groupes

```powershell
New-ADGroup -Name "GG-Reseau" -GroupScope Global -GroupCategory Security -Path "OU=Groupes,DC=corp,DC=exemple,DC=fr"
New-ADGroup -Name "DL-Partage-Reseau-RW" -GroupScope DomainLocal -GroupCategory Security -Path "OU=Groupes,DC=corp,DC=exemple,DC=fr"
Add-ADGroupMember "GG-Reseau" -Members amartin, bpetit
Add-ADGroupMember "DL-Partage-Reseau-RW" -Members "GG-Reseau"
Remove-ADGroupMember "GG-Reseau" -Members bpetit -Confirm:$false
# Membres (y compris imbriqués)
Get-ADGroupMember "GG-Reseau" -Recursive | Select-Object Name, SamAccountName
# Groupes d'un utilisateur
Get-ADPrincipalGroupMembership amartin | Select-Object Name
# Groupes vides
Get-ADGroup -Filter * -Properties Members | Where-Object { -not $_.Members } | Select-Object Name
# Membres des groupes privilégiés
Get-ADGroupMember "Admins du domaine" -Recursive
```

## Ordinateurs et unités d'organisation

```powershell
New-ADOrganizationalUnit -Name "Paris" -Path "DC=corp,DC=exemple,DC=fr" -ProtectedFromAccidentalDeletion $true
Get-ADOrganizationalUnit -Filter * | Select-Object DistinguishedName
Get-ADComputer -Filter "OperatingSystem -like '*Server*'" -Properties OperatingSystem, IPv4Address | Select-Object Name, OperatingSystem, IPv4Address
Get-ADComputer -Filter * -Properties LastLogonDate | Where-Object LastLogonDate -lt (Get-Date).AddDays(-90)
# Prédéfinir un compte ordinateur
New-ADComputer -Name "PC-PARIS-042" -Path "OU=Postes,OU=Paris,DC=corp,DC=exemple,DC=fr"
# Joindre un poste au domaine (sur le poste)
Add-Computer -DomainName corp.exemple.fr -OUPath "OU=Postes,OU=Paris,DC=corp,DC=exemple,DC=fr" -Credential CORP\admin-jdupont -Restart
# Réparer la relation d'approbation d'un poste (sur le poste)
Test-ComputerSecureChannel -Repair -Credential CORP\admin-jdupont
# Redirection des conteneurs par défaut
redircmp "OU=Postes,DC=corp,DC=exemple,DC=fr"
redirusr "OU=Utilisateurs,DC=corp,DC=exemple,DC=fr"
```

## Stratégies de groupe (GPO)

```powershell
New-GPO -Name "SEC - Pare-feu postes" | New-GPLink -Target "OU=Postes,DC=corp,DC=exemple,DC=fr"
Get-GPO -All | Select-Object DisplayName, GpoStatus, ModificationTime
Get-GPInheritance -Target "OU=Postes,DC=corp,DC=exemple,DC=fr"
Set-GPRegistryValue -Name "SEC - Pare-feu postes" -Key "HKLM\Software\Policies\Microsoft\WindowsFirewall\DomainProfile" -ValueName EnableFirewall -Type DWord -Value 1
Backup-GPO -All -Path "D:\Sauvegardes\GPO"
Restore-GPO -Name "SEC - Pare-feu postes" -Path "D:\Sauvegardes\GPO"
Get-GPOReport -Name "SEC - Pare-feu postes" -ReportType Html -Path C:\Temp\gpo.html
# Côté poste
gpupdate /force
gpresult /r
gpresult /h C:\Temp\rsop.html /f
# Forcer la mise à jour à distance sur toute une OU
Get-ADComputer -SearchBase "OU=Postes,DC=corp,DC=exemple,DC=fr" -Filter * | ForEach-Object { Invoke-GPUpdate -Computer $_.Name -Force -RandomDelayInMinutes 0 }
```

## Réplication et santé

```powershell
# Résumé de la réplication de tous les contrôleurs
repadmin /replsummary
# Partenaires et état détaillé d'un contrôleur
repadmin /showrepl DC01
# Forcer la réplication de toutes les partitions, dans tous les sites
repadmin /syncall /AdeP
# File d'attente de réplication
repadmin /queue
# Diagnostic complet (tests verbeux, enregistrement dans un fichier)
dcdiag /v /c /e /f:C:\Temp\dcdiag.txt
dcdiag /test:dns /v
# Localiser un contrôleur de domaine
nltest /dsgetdc:corp.exemple.fr
nltest /dclist:corp.exemple.fr
nltest /sc_verify:corp.exemple.fr
# Réplication SYSVOL (DFSR)
dfsrmig /getmigrationstate
Get-DfsrBacklog -GroupName "Domain System Volume" -FolderName "SYSVOL Share" -SourceComputerName DC01 -DestinationComputerName DC02
# Sites et sous-réseaux
Get-ADReplicationSite -Filter *
New-ADReplicationSubnet -Name "10.20.0.0/16" -Site "Agence-Lyon"
Get-ADReplicationFailure -Target DC01
```

## Rôles FSMO

```powershell
netdom query fsmo
Get-ADForest | Select-Object SchemaMaster, DomainNamingMaster
Get-ADDomain | Select-Object PDCEmulator, RIDMaster, InfrastructureMaster
# Transférer (contrôleur source en ligne)
Move-ADDirectoryServerOperationMasterRole -Identity DC02 -OperationMasterRole PDCEmulator, RIDMaster, InfrastructureMaster
# Saisir (contrôleur source définitivement perdu)
Move-ADDirectoryServerOperationMasterRole -Identity DC02 -OperationMasterRole SchemaMaster -Force
```

## Sauvegarde, restauration, corbeille

```powershell
# Activer la corbeille AD (irréversible, niveau fonctionnel 2008 R2+)
Enable-ADOptionalFeature "Recycle Bin Feature" -Scope ForestOrConfigurationSet -Target corp.exemple.fr
# Restaurer un objet supprimé
Get-ADObject -Filter "samAccountName -eq 'amartin'" -IncludeDeletedObjects | Restore-ADObject
# Sauvegarde de l'état système
wbadmin start systemstatebackup -backupTarget:E: -quiet
# Instantané de la base (ntdsutil) pour consultation
ntdsutil "activate instance ntds" "snapshot" "create" "quit" "quit"
# Nettoyage des métadonnées d'un contrôleur disparu
ntdsutil "metadata cleanup" "remove selected server CN=DC03,CN=Servers,CN=Paris,CN=Sites,CN=Configuration,DC=corp,DC=exemple,DC=fr" quit quit
# Mot de passe DSRM
ntdsutil "set dsrm password" "reset password on server null" quit quit
```

## Domaine, forêt, stratégies de mots de passe

```powershell
Get-ADDomain; Get-ADForest
Get-ADDefaultDomainPasswordPolicy
Set-ADDefaultDomainPasswordPolicy -Identity corp.exemple.fr -MinPasswordLength 14 -LockoutThreshold 10 -LockoutDuration 00:15:00
# Stratégie affinée (PSO) pour les administrateurs
New-ADFineGrainedPasswordPolicy -Name "PSO-Admins" -Precedence 10 -MinPasswordLength 20 -ComplexityEnabled $true -LockoutThreshold 5 -MaxPasswordAge 180.00:00:00
Add-ADFineGrainedPasswordPolicySubject "PSO-Admins" -Subjects "Admins du domaine"
Get-ADUserResultantPasswordPolicy amartin
# Relations d'approbation
Get-ADTrust -Filter *
netdom trust corp.exemple.fr /domain:partenaire.fr /verify
```

## Comptes de service gérés (gMSA)

```powershell
Add-KdsRootKey -EffectiveImmediately    # en laboratoire : -EffectiveTime ((Get-Date).AddHours(-10))
New-ADServiceAccount -Name gmsa-web -DNSHostName gmsa-web.corp.exemple.fr -PrincipalsAllowedToRetrieveManagedPassword "GG-Serveurs-Web"
# Sur le serveur membre
Install-ADServiceAccount gmsa-web
Test-ADServiceAccount gmsa-web
```

## Outils classiques (invite de commandes)

```powershell
dsquery user -name "Alice*"
dsquery computer -inactive 12
dsget group "CN=GG-Reseau,OU=Groupes,DC=corp,DC=exemple,DC=fr" -members
whoami /groups
whoami /upn
klist
klist purge
setspn -L svc-sql
setspn -Q MSSQLSvc/sql01.corp.exemple.fr:1433
w32tm /query /status
w32tm /config /manualpeerlist:"ntp1.exemple.fr ntp2.exemple.fr" /syncfromflags:manual /reliable:yes /update
csvde -f C:\Temp\export.csv -r "(objectClass=user)" -l "sAMAccountName,mail"
ldifde -f C:\Temp\ou.ldf -d "OU=Paris,DC=corp,DC=exemple,DC=fr"
```
