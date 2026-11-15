---
title: Active Directory — aide-mémoire des commandes
description: Référence complète des commandes Active Directory avec exemples — installation et promotion (forêt, domaine enfant, contrôleur supplémentaire, RODC et réplication des mots de passe, IFM, Server Core), utilisateurs (recherche, mots de passe, verrouillages et leur origine, expiration, export), groupes (portées, membres temporaires PAM), ordinateurs (jonction, jonction hors ligne djoin, canal sécurisé), unités d'organisation et délégation (dsacls), GPO (liens, filtrage, sauvegarde, RSAT, GPO orphelines), DNS intégré (module DnsServer), sites et réplication (repadmin, métadonnées, objets persistants), FSMO, temps (w32tm), sauvegarde et restauration (wbadmin, DSRM, restauration autoritaire, instantanés et dsamain, corbeille), maintenance NTDS, sécurité (audit des comptes sensibles, Protected Users, Windows LAPS, signature LDAP, auditpol), Kerberos et délégations, approbations, niveaux fonctionnels et schéma, AD CS (certutil, certreq), événements et diagnostic.
tags: [aide-mémoire, active directory, powershell, repadmin, dcdiag, nltest, ntdsutil, gpo, dns, laps, certutil, kerberos]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation|Active Directory]] et les articles de la fiche. Les cmdlets nécessitent le module **ActiveDirectory** (sur un serveur : `Install-WindowsFeature RSAT-AD-PowerShell` ; sur un poste Windows 10/11 : `Add-WindowsCapability -Online -Name Rsat.ActiveDirectory.DS-LDS.Tools~~~~0.0.1.0`). Exemples : domaine `corp.exemple.fr` (NetBIOS `CORP`), contrôleurs `DC01`, `DC02`, sites `Paris` et `Agence-Lyon`.

> [!TIP]
> Dans un filtre `-Filter`, utilisez des guillemets simples autour du filtre et des variables développées avant : `$nom = 'amartin'; Get-ADUser -Filter "SamAccountName -eq '$nom'"`. Pour cibler un contrôleur précis, ajoutez `-Server DC02` à toute cmdlet AD.

## Installation et promotion

```powershell
# Rôle et outils
Install-WindowsFeature AD-Domain-Services -IncludeManagementTools
Get-WindowsFeature AD-Domain-Services, DNS, RSAT-AD-Tools

# Vérifier les prérequis sans rien installer
Test-ADDSForestInstallation -DomainName "corp.exemple.fr" -InstallDns
Test-ADDSDomainControllerInstallation -DomainName "corp.exemple.fr" -InstallDns

# Nouvelle forêt (niveaux fonctionnels 2016 = WinThreshold)
Install-ADDSForest -DomainName "corp.exemple.fr" -DomainNetbiosName "CORP" -ForestMode WinThreshold -DomainMode WinThreshold -InstallDns -DatabasePath "C:\Windows\NTDS" -LogPath "C:\Windows\NTDS" -SysvolPath "C:\Windows\SYSVOL" -SafeModeAdministratorPassword (Read-Host -AsSecureString "Mot de passe DSRM")

# Domaine enfant (paris.corp.exemple.fr)
Install-ADDSDomain -NewDomainName "paris" -ParentDomainName "corp.exemple.fr" -DomainType ChildDomain -NewDomainNetbiosName "PARIS" -InstallDns -CreateDnsDelegation -Credential (Get-Credential CORP\admin-jdupont) -SafeModeAdministratorPassword (Read-Host -AsSecureString "Mot de passe DSRM")

# Contrôleur supplémentaire, catalogue global, dans le site Paris
Install-ADDSDomainController -DomainName "corp.exemple.fr" -SiteName "Paris" -InstallDns -NoGlobalCatalog:$false -Credential (Get-Credential CORP\admin-jdupont) -SafeModeAdministratorPassword (Read-Host -AsSecureString "Mot de passe DSRM")

# Installation depuis un support (IFM) : 1) sur un DC existant, 2) sur le futur DC
ntdsutil "activate instance ntds" ifm "create sysvol full C:\IFM" quit quit
Install-ADDSDomainController -DomainName "corp.exemple.fr" -InstallationMediaPath "C:\IFM" -SiteName "Agence-Lyon" -InstallDns -Credential (Get-Credential) -SafeModeAdministratorPassword (Read-Host -AsSecureString "Mot de passe DSRM")

# Rétrograder un contrôleur (transfère les rôles FSMO qu'il détient)
Uninstall-ADDSDomainController -DemoteOperationMasterRole -LocalAdministratorPassword (Read-Host -AsSecureString "Admin local")

# Vérifications après promotion
Get-Service ADWS, DNS, Kdc, Netlogon, NTDS, W32Time | Select-Object Name, Status
Get-SmbShare SYSVOL, NETLOGON
dcdiag /q
```

### RODC (contrôleur en lecture seule)

```powershell
# Pré-créer le compte du RODC et déléguer son administration locale
Add-ADDSReadOnlyDomainControllerAccount -DomainControllerAccountName "RODC-LYON" -DomainName "corp.exemple.fr" -SiteName "Agence-Lyon" -DelegatedAdministratorAccountName "CORP\GG-Admins-Lyon"
# Sur le serveur de l'agence : rattacher au compte pré-créé
Install-ADDSDomainController -DomainName "corp.exemple.fr" -UseExistingAccount -InstallDns -Credential (Get-Credential CORP\GG-Admins-Lyon-membre) -SafeModeAdministratorPassword (Read-Host -AsSecureString "Mot de passe DSRM")

# Stratégie de réplication des mots de passe (PRP)
Add-ADDomainControllerPasswordReplicationPolicy -Identity "RODC-LYON" -AllowedList "GG-Utilisateurs-Lyon", "GG-Postes-Lyon"
Get-ADDomainControllerPasswordReplicationPolicy -Identity "RODC-LYON" -Allowed
Get-ADDomainControllerPasswordReplicationPolicyUsage -Identity "RODC-LYON" -RevealedAccounts
# Pré-remplir le cache des mots de passe d'un utilisateur
repadmin /rodcpwdrepl RODC-LYON DC01 "CN=Alice Martin,OU=Utilisateurs,OU=Lyon,DC=corp,DC=exemple,DC=fr"
```

### Server Core

```powershell
sconfig                                           # menu texte : réseau, nom, mises à jour, bureau à distance
Rename-Computer -NewName DC03 -Restart
New-NetIPAddress -InterfaceAlias "Ethernet" -IPAddress 10.0.10.13 -PrefixLength 24 -DefaultGateway 10.0.10.1
Set-DnsClientServerAddress -InterfaceAlias "Ethernet" -ServerAddresses 10.0.10.11, 10.0.10.12
```

## Utilisateurs

```powershell
# Créer
New-ADUser -Name "Alice Martin" -GivenName Alice -Surname Martin -SamAccountName amartin -UserPrincipalName amartin@corp.exemple.fr -DisplayName "Alice Martin" -EmailAddress alice.martin@exemple.fr -Department "Réseau" -Title "Architecte réseau" -Path "OU=Utilisateurs,OU=Paris,DC=corp,DC=exemple,DC=fr" -AccountPassword (Read-Host -AsSecureString "Mot de passe") -Enabled $true -ChangePasswordAtLogon $true

# Lire
Get-ADUser amartin -Properties *
Get-ADUser amartin -Properties MemberOf, LastLogonDate, PasswordLastSet, LockedOut, badPwdCount | Format-List
Get-ADUser -Identity "amartin@corp.exemple.fr"                               # par UPN (GUID, SID et DN acceptés)

# Rechercher : filtre PowerShell, filtre LDAP, limite à une OU
Get-ADUser -Filter "Surname -like 'Mart*'" -Properties Department, LastLogonDate | Select-Object Name, Department, LastLogonDate
Get-ADUser -LDAPFilter "(&(objectCategory=person)(objectClass=user)(mail=*@exemple.fr))"
Get-ADUser -Filter * -SearchBase "OU=Paris,DC=corp,DC=exemple,DC=fr" -SearchScope OneLevel
Get-ADUser -Filter "Department -eq 'Réseau' -and Enabled -eq 'True'" -ResultSetSize 50

# Modifier des attributs
Set-ADUser amartin -Department "Réseau" -Title "Architecte" -Office "Paris" -OfficePhone "+33 1 23 45 67 89"
Set-ADUser amartin -Replace @{extensionAttribute1 = "Badge-1234"}
Set-ADUser amartin -Add @{proxyAddresses = "smtp:a.martin@exemple.fr"}
Set-ADUser amartin -Clear extensionAttribute1
Set-ADUser amartin -Manager bpetit

# Mots de passe
Set-ADAccountPassword amartin -Reset -NewPassword (Read-Host -AsSecureString "Nouveau mot de passe")
Set-ADUser amartin -ChangePasswordAtLogon $true
Set-ADAccountControl amartin -PasswordNeverExpires $false -CannotChangePassword $false
Get-ADUser amartin -Properties "msDS-UserPasswordExpiryTimeComputed", PasswordLastSet | Select-Object Name, PasswordLastSet, @{n="Expire";e={[datetime]::FromFileTime($_."msDS-UserPasswordExpiryTimeComputed")}}

# État du compte
Unlock-ADAccount amartin
Disable-ADAccount amartin
Enable-ADAccount amartin
Set-ADAccountExpiration amartin -DateTime "2026-12-31"
Clear-ADAccountExpiration amartin

# Comptes à surveiller
Search-ADAccount -LockedOut | Select-Object Name, LastLogonDate
Search-ADAccount -AccountDisabled -UsersOnly
Search-ADAccount -AccountExpired
Search-ADAccount -AccountExpiring -TimeSpan 15.00:00:00
Search-ADAccount -PasswordExpired -UsersOnly
Search-ADAccount -AccountInactive -TimeSpan 90.00:00:00 -UsersOnly
Get-ADUser -Filter "PasswordNeverExpires -eq 'True' -and Enabled -eq 'True'" | Select-Object Name, SamAccountName
Get-ADUser -LDAPFilter "(&(objectCategory=person)(objectClass=user)(!(lastLogonTimestamp=*)))"   # jamais connectés

# Déplacer, renommer, supprimer
Get-ADUser amartin | Move-ADObject -TargetPath "OU=Utilisateurs,OU=Lyon,DC=corp,DC=exemple,DC=fr"
Rename-ADObject (Get-ADUser amartin).DistinguishedName -NewName "Alice Martin-Durand"
Remove-ADUser amartin -Confirm:$false

# Création en masse depuis un CSV (Prenom;Nom;Login;OU)
Import-Csv .\comptes.csv -Delimiter ';' -Encoding UTF8 | ForEach-Object {
  New-ADUser -Name "$($_.Prenom) $($_.Nom)" -GivenName $_.Prenom -Surname $_.Nom -SamAccountName $_.Login -UserPrincipalName "$($_.Login)@corp.exemple.fr" -Path $_.OU -AccountPassword (ConvertTo-SecureString "Provisoire!2026-$(Get-Random)" -AsPlainText -Force) -Enabled $true -ChangePasswordAtLogon $true
}

# Désactiver et isoler les comptes inactifs depuis 120 jours
Search-ADAccount -AccountInactive -TimeSpan 120.00:00:00 -UsersOnly -SearchBase "OU=Paris,DC=corp,DC=exemple,DC=fr" | ForEach-Object {
  Disable-ADAccount $_
  Set-ADUser $_ -Description "Désactivé le $(Get-Date -Format yyyy-MM-dd) (inactif)"
  Move-ADObject $_ -TargetPath "OU=Desactives,DC=corp,DC=exemple,DC=fr"
}

# Export pour un audit
Get-ADUser -Filter * -Properties mail, Department, Title, LastLogonDate, PasswordLastSet, Enabled | Select-Object Name, SamAccountName, mail, Department, Title, Enabled, LastLogonDate, PasswordLastSet | Export-Csv C:\Temp\utilisateurs.csv -NoTypeInformation -Delimiter ';' -Encoding UTF8
```

### Verrouillages de compte : trouver l'origine

```powershell
# État du compte sur chaque contrôleur (badPwdCount n'est pas répliqué)
Get-ADDomainController -Filter * | ForEach-Object {
  $dc = $_.HostName
  Get-ADUser amartin -Server $dc -Properties LockedOut, badPwdCount, LastBadPasswordAttempt |
    Select-Object @{n='DC';e={$dc}}, LockedOut, badPwdCount, LastBadPasswordAttempt
}
# Événement 4740 sur l'émulateur PDC : quel poste a provoqué le verrouillage ?
$pdc = (Get-ADDomain).PDCEmulator
Get-WinEvent -ComputerName $pdc -FilterHashtable @{LogName='Security'; Id=4740; StartTime=(Get-Date).AddDays(-1)} |
  Select-Object TimeCreated, @{n='Compte';e={$_.Properties[0].Value}}, @{n='Poste appelant';e={$_.Properties[1].Value}}
# Échecs Kerberos (4771) et NTLM (4776) pour ce compte
Get-WinEvent -ComputerName $pdc -FilterHashtable @{LogName='Security'; Id=4771,4776; StartTime=(Get-Date).AddHours(-4)} |
  Where-Object { $_.Message -match 'amartin' } | Select-Object TimeCreated, Id, Message -First 20
```

## Groupes

```powershell
New-ADGroup -Name "GG-Reseau" -GroupScope Global -GroupCategory Security -Path "OU=Groupes,DC=corp,DC=exemple,DC=fr" -Description "Équipe réseau"
New-ADGroup -Name "DL-Partage-Reseau-RW" -GroupScope DomainLocal -GroupCategory Security -Path "OU=Groupes,DC=corp,DC=exemple,DC=fr"
New-ADGroup -Name "Liste-Reseau" -GroupScope Universal -GroupCategory Distribution -Path "OU=Listes,DC=corp,DC=exemple,DC=fr"

Add-ADGroupMember "GG-Reseau" -Members amartin, bpetit
Add-ADGroupMember "DL-Partage-Reseau-RW" -Members "GG-Reseau"          # AGDLP
Add-ADPrincipalGroupMembership amartin -MemberOf "GG-Reseau", "GG-VPN"
Remove-ADGroupMember "GG-Reseau" -Members bpetit -Confirm:$false

Get-ADGroupMember "GG-Reseau" -Recursive | Select-Object Name, SamAccountName, objectClass
(Get-ADGroup "GG-Gros-Groupe" -Properties Member).Member.Count        # plus de 5 000 membres : Get-ADGroupMember échoue
Get-ADPrincipalGroupMembership amartin | Select-Object Name
Get-ADUser -LDAPFilter "(memberOf:1.2.840.113556.1.4.1941:=CN=GG-Reseau,OU=Groupes,DC=corp,DC=exemple,DC=fr)"   # membres imbriqués, via LDAP
Get-ADGroup -Filter * -Properties Members | Where-Object { -not $_.Members } | Select-Object Name          # groupes vides
Set-ADGroup "GG-Reseau" -GroupScope Universal                          # changement de portée (Global → Universel)

# Groupes privilégiés (noms français ; SID bien connus en commentaire)
Get-ADGroupMember "Admins du domaine" -Recursive                       # S-1-5-21-…-512
Get-ADGroupMember "Administrateurs de l'entreprise" -Recursive         # …-519
Get-ADGroupMember "Administrateurs du schéma" -Recursive               # …-518
Get-ADGroupMember -Identity "S-1-5-32-544" -Recursive                  # Administrateurs (intégré), quelle que soit la langue

# Appartenance temporaire (fonction PAM, niveau fonctionnel de forêt 2016)
Enable-ADOptionalFeature "Privileged Access Management Feature" -Scope ForestOrConfigurationSet -Target "corp.exemple.fr"
Add-ADGroupMember "Admins du domaine" -Members admin-jdupont -MemberTimeToLive (New-TimeSpan -Hours 2)
Get-ADGroup "Admins du domaine" -Properties Member -ShowMemberTimeToLive | Select-Object -ExpandProperty Member
```

## Ordinateurs

```powershell
Get-ADComputer -Filter "OperatingSystem -like '*Server*'" -Properties OperatingSystem, OperatingSystemVersion, IPv4Address | Select-Object Name, OperatingSystem, OperatingSystemVersion, IPv4Address
Get-ADComputer -Filter * -Properties LastLogonDate | Where-Object LastLogonDate -lt (Get-Date).AddDays(-90) | Select-Object Name, LastLogonDate
Get-ADComputer -Filter * -Properties OperatingSystem | Group-Object OperatingSystem | Sort-Object Count -Descending | Select-Object Count, Name

# Prédéfinir le compte, puis joindre le poste (sur le poste)
New-ADComputer -Name "PC-PARIS-042" -Path "OU=Postes,OU=Paris,DC=corp,DC=exemple,DC=fr"
Add-Computer -DomainName corp.exemple.fr -OUPath "OU=Postes,OU=Paris,DC=corp,DC=exemple,DC=fr" -Credential CORP\admin-jdupont -Restart
Rename-Computer -NewName PC-PARIS-043 -DomainCredential CORP\admin-jdupont -Restart
Remove-Computer -UnjoinDomainCredential CORP\admin-jdupont -WorkgroupName WORKGROUP -Restart

# Jonction hors ligne (poste sans accès à un DC) : 1) sur un poste du domaine, 2) sur le nouveau poste
djoin /provision /domain corp.exemple.fr /machine PC-PARIS-050 /machineou "OU=Postes,OU=Paris,DC=corp,DC=exemple,DC=fr" /savefile C:\Temp\PC-PARIS-050.txt
djoin /requestODJ /loadfile C:\Temp\PC-PARIS-050.txt /windowspath $env:SystemRoot /localos

# Canal sécurisé (relation d'approbation du poste) — sur le poste
Test-ComputerSecureChannel -Verbose
Test-ComputerSecureChannel -Repair -Credential CORP\admin-jdupont
Reset-ComputerMachinePassword -Server DC01 -Credential CORP\admin-jdupont
nltest /sc_verify:corp.exemple.fr
nltest /sc_reset:corp.exemple.fr

# Qui peut joindre des postes ? (10 par utilisateur par défaut : à mettre à 0)
Get-ADObject (Get-ADDomain).DistinguishedName -Properties "ms-DS-MachineAccountQuota"
Set-ADDomain corp.exemple.fr -Replace @{"ms-DS-MachineAccountQuota" = "0"}
```

## Unités d'organisation et délégation

```powershell
New-ADOrganizationalUnit -Name "Paris" -Path "DC=corp,DC=exemple,DC=fr" -ProtectedFromAccidentalDeletion $true
New-ADOrganizationalUnit -Name "Postes" -Path "OU=Paris,DC=corp,DC=exemple,DC=fr"
Get-ADOrganizationalUnit -Filter * | Select-Object DistinguishedName | Sort-Object DistinguishedName
Get-ADOrganizationalUnit -Filter * -Properties ProtectedFromAccidentalDeletion | Where-Object { -not $_.ProtectedFromAccidentalDeletion }
# Supprimer une OU : retirer la protection d'abord
Set-ADOrganizationalUnit "OU=Ancien,DC=corp,DC=exemple,DC=fr" -ProtectedFromAccidentalDeletion $false
Remove-ADOrganizationalUnit "OU=Ancien,DC=corp,DC=exemple,DC=fr" -Recursive -Confirm:$false

# Conteneurs par défaut des nouveaux comptes
redircmp "OU=Postes,DC=corp,DC=exemple,DC=fr"
redirusr "OU=Utilisateurs,DC=corp,DC=exemple,DC=fr"

# Délégation : le support réinitialise les mots de passe et déverrouille les comptes de l'OU
dsacls "OU=Utilisateurs,OU=Paris,DC=corp,DC=exemple,DC=fr" /I:S /G "CORP\GG-Support:CA;Reset Password;user"
dsacls "OU=Utilisateurs,OU=Paris,DC=corp,DC=exemple,DC=fr" /I:S /G "CORP\GG-Support:RPWP;pwdLastSet;user"
dsacls "OU=Utilisateurs,OU=Paris,DC=corp,DC=exemple,DC=fr" /I:S /G "CORP\GG-Support:RPWP;lockoutTime;user"
# Lire les autorisations d'une OU
dsacls "OU=Utilisateurs,OU=Paris,DC=corp,DC=exemple,DC=fr"
(Get-Acl "AD:\OU=Utilisateurs,OU=Paris,DC=corp,DC=exemple,DC=fr").Access | Where-Object IdentityReference -like "CORP\GG-Support" | Select-Object ActiveDirectoryRights, ObjectType, InheritanceType
```

## Stratégies de groupe (GPO)

```powershell
# Créer, lier, ordonner
New-GPO -Name "SEC - Pare-feu postes" -Comment "Pare-feu activé, profils domaine" | New-GPLink -Target "OU=Postes,DC=corp,DC=exemple,DC=fr" -LinkEnabled Yes
Set-GPLink -Name "SEC - Pare-feu postes" -Target "OU=Postes,DC=corp,DC=exemple,DC=fr" -Order 1
Set-GPLink -Name "SEC - Pare-feu postes" -Target "OU=Postes,DC=corp,DC=exemple,DC=fr" -Enforced Yes
Set-GPLink -Name "SEC - Pare-feu postes" -Target "OU=Postes,DC=corp,DC=exemple,DC=fr" -LinkEnabled No
Remove-GPLink -Name "SEC - Pare-feu postes" -Target "OU=Postes,DC=corp,DC=exemple,DC=fr"
Set-GPInheritance -Target "OU=Labo,DC=corp,DC=exemple,DC=fr" -IsBlocked Yes
Get-GPInheritance -Target "OU=Postes,DC=corp,DC=exemple,DC=fr"

# Réglages de registre
Set-GPRegistryValue -Name "SEC - Pare-feu postes" -Key "HKLM\Software\Policies\Microsoft\WindowsFirewall\DomainProfile" -ValueName EnableFirewall -Type DWord -Value 1
Get-GPRegistryValue -Name "SEC - Pare-feu postes" -Key "HKLM\Software\Policies\Microsoft\WindowsFirewall\DomainProfile"

# Filtrage de sécurité : appliquer seulement au groupe pilote
Set-GPPermission -Name "SEC - Pare-feu postes" -TargetName "GG-Postes-Pilote" -TargetType Group -PermissionLevel GpoApply
Set-GPPermission -Name "SEC - Pare-feu postes" -TargetName "Utilisateurs authentifiés" -TargetType Group -PermissionLevel GpoRead -Replace
Get-GPPermission -Name "SEC - Pare-feu postes" -All

# Inventaire
Get-GPO -All | Select-Object DisplayName, GpoStatus, CreationTime, ModificationTime | Sort-Object ModificationTime -Descending
Get-GPO -All | Where-Object GpoStatus -eq "AllSettingsDisabled"
Get-GPO -All | Where-Object { -not ([xml](Get-GPOReport -Guid $_.Id -ReportType Xml)).GPO.LinksTo } | Select-Object DisplayName   # GPO non liées
Get-GPOReport -Name "SEC - Pare-feu postes" -ReportType Html -Path C:\Temp\gpo.html
Get-GPOReport -All -ReportType Html -Path C:\Temp\toutes-les-gpo.html

# Sauvegarde, restauration, copie
Backup-GPO -All -Path "D:\Sauvegardes\GPO" -Comment "Sauvegarde $(Get-Date -Format yyyy-MM-dd)"
Restore-GPO -Name "SEC - Pare-feu postes" -Path "D:\Sauvegardes\GPO"
Import-GPO -BackupGpoName "SEC - Pare-feu postes" -TargetName "SEC - Pare-feu postes (test)" -Path "D:\Sauvegardes\GPO" -CreateIfNeeded
Copy-GPO -SourceName "SEC - Pare-feu postes" -TargetName "SEC - Pare-feu serveurs"

# Magasin central des modèles ADMX
Copy-Item C:\Windows\PolicyDefinitions "\\corp.exemple.fr\SYSVOL\corp.exemple.fr\Policies\" -Recurse -Force

# Côté poste
gpupdate /force
gpupdate /target:computer /force
gpresult /r
gpresult /scope computer /v
gpresult /h C:\Temp\rsop.html /f
Get-WinEvent -LogName "Microsoft-Windows-GroupPolicy/Operational" -MaxEvents 30 | Select-Object TimeCreated, Id, Message

# À distance
Get-GPResultantSetOfPolicy -Computer PC-PARIS-042 -User CORP\amartin -ReportType Html -Path C:\Temp\rsop-pc042.html
Get-ADComputer -SearchBase "OU=Postes,DC=corp,DC=exemple,DC=fr" -Filter * | ForEach-Object { Invoke-GPUpdate -Computer $_.Name -Force -RandomDelayInMinutes 0 }
```

## DNS intégré (module DnsServer)

```powershell
Get-DnsServerZone
Get-DnsServerResourceRecord -ZoneName "corp.exemple.fr" -RRType A | Sort-Object HostName
Get-DnsServerResourceRecord -ZoneName "_msdcs.corp.exemple.fr" -RRType SRV
Add-DnsServerResourceRecordA -ZoneName "corp.exemple.fr" -Name "srv-web" -IPv4Address "10.0.20.15" -CreatePtr
Add-DnsServerResourceRecordCName -ZoneName "corp.exemple.fr" -Name "intranet" -HostNameAlias "srv-web.corp.exemple.fr"
Remove-DnsServerResourceRecord -ZoneName "corp.exemple.fr" -RRType A -Name "srv-ancien" -Force

# Zone inverse répliquée dans la forêt, redirecteurs
Add-DnsServerPrimaryZone -NetworkId "10.0.20.0/24" -ReplicationScope Forest
Add-DnsServerForwarder -IPAddress 9.9.9.9, 149.112.112.112
Get-DnsServerForwarder

# Vieillissement et nettoyage des enregistrements dynamiques
Set-DnsServerZoneAging -Name "corp.exemple.fr" -Aging $true -NoRefreshInterval 7.00:00:00 -RefreshInterval 7.00:00:00
Set-DnsServerScavenging -ScavengingState $true -ScavengingInterval 7.00:00:00 -ApplyOnAllZones
Start-DnsServerScavenging -Force

# Contrôles
Resolve-DnsName -Name "_ldap._tcp.dc._msdcs.corp.exemple.fr" -Type SRV
Resolve-DnsName -Name "_kerberos._tcp.Paris._sites.dc._msdcs.corp.exemple.fr" -Type SRV
dcdiag /test:dns /dnsbasic /v
nltest /dsregdns                                  # réenregistrer les SRV du contrôleur
ipconfig /registerdns
Clear-DnsServerCache -Force
```

## Sites et réplication

```powershell
# Topologie
New-ADReplicationSite -Name "Agence-Lyon"
New-ADReplicationSubnet -Name "10.20.0.0/16" -Site "Agence-Lyon" -Location "Lyon"
New-ADReplicationSiteLink -Name "Paris-Lyon" -SitesIncluded Paris, Agence-Lyon -Cost 100 -ReplicationFrequencyInMinutes 15 -InterSiteTransportProtocol IP
Set-ADReplicationSiteLink -Identity "Paris-Lyon" -ReplicationFrequencyInMinutes 15
Move-ADDirectoryServer -Identity DC03 -Site "Agence-Lyon"
Get-ADReplicationSite -Filter * | Select-Object Name
Get-ADReplicationSubnet -Filter * | Select-Object Name, Site
Get-ADDomainController -Filter * | Select-Object HostName, Site, IPv4Address, IsGlobalCatalog, IsReadOnly, OperatingSystem

# Localisation des contrôleurs
nltest /dsgetsite
nltest /dsgetdc:corp.exemple.fr
nltest /dsgetdc:corp.exemple.fr /gc /force
nltest /dclist:corp.exemple.fr
Get-ADDomainController -Discover -SiteName "Paris" -Service GlobalCatalog

# État de la réplication
repadmin /replsummary
repadmin /showrepl DC01
repadmin /showrepl * /csv > C:\Temp\replication.csv
repadmin /queue
repadmin /showbackup *
repadmin /bridgeheads
repadmin /istg
Get-ADReplicationFailure -Target DC01
Get-ADReplicationPartnerMetadata -Target DC01 -Scope Server | Select-Object Partner, LastReplicationSuccess, LastReplicationResult, ConsecutiveReplicationFailures
Get-ADReplicationUpToDatenessVectorTable -Target DC01

# Forcer
repadmin /syncall /AdeP                           # tous les DC, toutes les partitions, inter-sites, notifications
repadmin /syncall DC01 /APed
repadmin /replicate DC02 DC01 "DC=corp,DC=exemple,DC=fr"   # DC02 tire la partition depuis DC01
repadmin /kcc *                                   # recalculer la topologie

# Historique d'un attribut : quel DC l'a modifié et quand
repadmin /showobjmeta DC01 "CN=Alice Martin,OU=Utilisateurs,OU=Paris,DC=corp,DC=exemple,DC=fr"

# Objets persistants (lingering objects) : d'abord en mode simulation
repadmin /removelingeringobjects DC02 <GUID-DSA-de-DC01> "DC=corp,DC=exemple,DC=fr" /advisory_mode

# SYSVOL (DFSR)
dfsrmig /getmigrationstate
dfsrdiag pollad
Get-DfsrBacklog -GroupName "Domain System Volume" -FolderName "SYSVOL Share" -SourceComputerName DC01 -DestinationComputerName DC02
Get-WinEvent -LogName "DFS Replication" -MaxEvents 20 | Select-Object TimeCreated, Id, LevelDisplayName, Message
```

Le GUID DSA d'un contrôleur s'affiche en tête de `repadmin /showrepl DC01` (*DSA object GUID*).

## Rôles FSMO

```powershell
netdom query fsmo
Get-ADForest | Select-Object SchemaMaster, DomainNamingMaster
Get-ADDomain | Select-Object PDCEmulator, RIDMaster, InfrastructureMaster
# Transférer (contrôleur source en ligne)
Move-ADDirectoryServerOperationMasterRole -Identity DC02 -OperationMasterRole PDCEmulator, RIDMaster, InfrastructureMaster
Move-ADDirectoryServerOperationMasterRole -Identity DC02 -OperationMasterRole SchemaMaster, DomainNamingMaster
# Saisir (contrôleur source définitivement perdu : il ne doit jamais revenir sur le réseau)
Move-ADDirectoryServerOperationMasterRole -Identity DC02 -OperationMasterRole PDCEmulator, RIDMaster, InfrastructureMaster -Force
# Réserve de RID restante
dcdiag /test:ridmanager /v
```

Équivalent `ntdsutil` (session interactive) :

```text
ntdsutil
roles
connections
connect to server DC02
quit
transfer pdc
seize schema master
quit
quit
```

## Temps (W32Time)

```powershell
# Émulateur PDC de la racine de forêt : sources NTP externes
w32tm /config /manualpeerlist:"ntp1.exemple.fr,0x8 ntp2.exemple.fr,0x8" /syncfromflags:manual /reliable:yes /update
Restart-Service W32Time
# Autres contrôleurs et membres : hiérarchie du domaine
w32tm /config /syncfromflags:domhier /update
# Contrôles
w32tm /query /status
w32tm /query /source
w32tm /query /peers
w32tm /query /configuration
w32tm /monitor /domain:corp.exemple.fr
w32tm /stripchart /computer:ntp1.exemple.fr /samples:5 /dataonly
w32tm /resync /rediscover
```

## Sauvegarde et restauration

```powershell
# Sauvegarde de l'état système (base NTDS, SYSVOL, registre)
Install-WindowsFeature Windows-Server-Backup
wbadmin start systemstatebackup -backupTarget:E: -quiet
wbadmin get versions -backupTarget:E:

# Restauration non autoritaire : redémarrer en mode DSRM, restaurer, revenir au démarrage normal
bcdedit /set "{default}" safeboot dsrepair
Restart-Computer
wbadmin start systemstaterecovery -version:11/15/2026-02:00 -backupTarget:E: -quiet
bcdedit /deletevalue "{default}" safeboot
Restart-Computer

# Corbeille AD (irréversible ; niveau fonctionnel de forêt 2008 R2 ou plus)
Enable-ADOptionalFeature "Recycle Bin Feature" -Scope ForestOrConfigurationSet -Target "corp.exemple.fr"
Get-ADOptionalFeature -Filter * | Select-Object Name, EnabledScopes
Get-ADObject -Filter "isDeleted -eq 'True' -and Name -like '*Martin*'" -IncludeDeletedObjects -Properties LastKnownParent, whenChanged | Select-Object Name, LastKnownParent, whenChanged
Get-ADObject -Filter "samAccountName -eq 'amartin'" -IncludeDeletedObjects | Restore-ADObject
# OU supprimée : restaurer l'OU, puis son contenu
Get-ADObject -LDAPFilter "(msDS-LastKnownRDN=Paris)" -IncludeDeletedObjects | Restore-ADObject
Get-ADObject -Filter "LastKnownParent -eq 'OU=Paris,DC=corp,DC=exemple,DC=fr'" -IncludeDeletedObjects | Restore-ADObject
# Durées de conservation des objets supprimés (180 jours par défaut)
Get-ADObject "CN=Directory Service,CN=Windows NT,CN=Services,CN=Configuration,DC=corp,DC=exemple,DC=fr" -Properties tombstoneLifetime, msDS-DeletedObjectLifetime

# Instantané de la base, consultation hors ligne avec dsamain
ntdsutil snapshot "activate instance ntds" create quit quit
ntdsutil snapshot "list all" "mount 1" quit quit
dsamain -dbpath "C:\`$SNAP_202611150200_VOLUMEC`$\Windows\NTDS\ntds.dit" -ldapport 50000
Get-ADUser amartin -Server localhost:50000 -Properties *        # dans une autre console
ntdsutil snapshot "unmount *" quit quit

# Mot de passe DSRM : le synchroniser avec un compte de domaine désactivé dédié
ntdsutil "set dsrm password" "sync from domain account svc-dsrm" quit quit
```

Restauration **autoritaire** d'une OU (après une restauration non autoritaire, toujours en mode DSRM) :

```text
ntdsutil
activate instance ntds
authoritative restore
restore subtree "OU=Paris,DC=corp,DC=exemple,DC=fr"
quit
quit
```

## Maintenance de la base NTDS

```powershell
Stop-Service NTDS -Force                          # services AD redémarrables (2008 et plus)
ntdsutil "activate instance ntds" files info quit quit
ntdsutil "activate instance ntds" files integrity quit quit
ntdsutil "activate instance ntds" "semantic database analysis" go quit quit
# Défragmentation hors ligne : base compactée dans C:\Temp\NTDS, à recopier sur l'original (puis supprimer les *.log)
ntdsutil "activate instance ntds" files "compact to C:\Temp\NTDS" quit quit
Start-Service NTDS

# Nettoyage des métadonnées d'un contrôleur disparu (avant : saisir ses rôles FSMO)
ntdsutil "metadata cleanup" "remove selected server CN=DC03,CN=Servers,CN=Paris,CN=Sites,CN=Configuration,DC=corp,DC=exemple,DC=fr" quit quit
```

## Domaine, forêt, niveaux fonctionnels et schéma

```powershell
Get-ADDomain | Select-Object DNSRoot, NetBIOSName, DomainMode, PDCEmulator
Get-ADForest | Select-Object Name, ForestMode, Domains, GlobalCatalogs, UPNSuffixes
Get-ADRootDSE | Select-Object defaultNamingContext, configurationNamingContext, schemaNamingContext, domainControllerFunctionality

# Version du schéma (88 = Windows Server 2019/2022, 91 = Windows Server 2025)
Get-ADObject (Get-ADRootDSE).schemaNamingContext -Properties objectVersion | Select-Object objectVersion

# Relever les niveaux fonctionnels (irréversible en pratique)
Set-ADDomainMode -Identity "corp.exemple.fr" -DomainMode Windows2016Domain
Set-ADForestMode -Identity "corp.exemple.fr" -ForestMode Windows2016Forest

# Suffixe UPN supplémentaire (connexion avec l'adresse de messagerie)
Set-ADForest -Identity "corp.exemple.fr" -UPNSuffixes @{Add = "exemple.fr"}
```

## Stratégies de mots de passe

```powershell
Get-ADDefaultDomainPasswordPolicy
Set-ADDefaultDomainPasswordPolicy -Identity corp.exemple.fr -MinPasswordLength 14 -PasswordHistoryCount 24 -LockoutThreshold 10 -LockoutDuration 00:15:00 -LockoutObservationWindow 00:15:00
# Stratégie affinée (PSO) pour les administrateurs et les comptes de service
New-ADFineGrainedPasswordPolicy -Name "PSO-Admins" -Precedence 10 -MinPasswordLength 20 -ComplexityEnabled $true -PasswordHistoryCount 24 -LockoutThreshold 5 -LockoutDuration 00:30:00 -LockoutObservationWindow 00:30:00 -MaxPasswordAge 180.00:00:00 -MinPasswordAge 1.00:00:00 -ReversibleEncryptionEnabled $false
Add-ADFineGrainedPasswordPolicySubject "PSO-Admins" -Subjects "Admins du domaine"
Get-ADFineGrainedPasswordPolicy -Filter * | Select-Object Name, Precedence, MinPasswordLength, AppliesTo
Get-ADUserResultantPasswordPolicy amartin
```

## Comptes de service gérés (gMSA)

```powershell
Add-KdsRootKey -EffectiveImmediately              # effectif après 10 h ; en laboratoire : -EffectiveTime ((Get-Date).AddHours(-10))
Get-KdsRootKey
New-ADServiceAccount -Name gmsa-web -DNSHostName gmsa-web.corp.exemple.fr -PrincipalsAllowedToRetrieveManagedPassword "GG-Serveurs-Web" -KerberosEncryptionType AES128, AES256
Set-ADServiceAccount gmsa-web -ServicePrincipalNames @{Add = "HTTP/intranet.corp.exemple.fr"}
Get-ADServiceAccount gmsa-web -Properties PrincipalsAllowedToRetrieveManagedPassword, ServicePrincipalNames
# Sur le serveur membre (après redémarrage ou klist -li 0x3e7 purge pour prendre en compte le groupe)
Install-WindowsFeature RSAT-AD-PowerShell
Install-ADServiceAccount gmsa-web
Test-ADServiceAccount gmsa-web
# Service ou tâche planifiée : compte « CORP\gmsa-web$ », mot de passe vide
cmd /c 'sc.exe config "MonService" obj= "CORP\gmsa-web$" password= ""'
```

## Sécurité : audit des comptes et des réglages sensibles

```powershell
# Comptes protégés par AdminSDHolder (membres actuels ou anciens de groupes privilégiés)
Get-ADUser -Filter "AdminCount -eq 1" -Properties AdminCount, MemberOf | Select-Object Name, SamAccountName
# Comptes sans pré-authentification Kerberos, sans mot de passe requis, avec chiffrement réversible
Get-ADUser -Filter "DoesNotRequirePreAuth -eq 'True'" | Select-Object Name
Get-ADUser -Filter "PasswordNotRequired -eq 'True'" | Select-Object Name
Get-ADUser -Filter "AllowReversiblePasswordEncryption -eq 'True'" | Select-Object Name
# Comptes de service utilisateur avec SPN (privilégier les gMSA, mots de passe longs)
Get-ADUser -Filter "ServicePrincipalName -like '*'" -Properties ServicePrincipalName, PasswordLastSet | Select-Object Name, PasswordLastSet, ServicePrincipalName
# Délégation non contrainte hors contrôleurs de domaine
Get-ADComputer -Filter "TrustedForDelegation -eq 'True' -and PrimaryGroupID -ne 516" | Select-Object Name
Get-ADUser -Filter "TrustedForDelegation -eq 'True'" | Select-Object Name
# Âge du mot de passe du compte krbtgt (le changer deux fois, à intervalle de réplication, avec le script Microsoft New-KrbtgtKeys.ps1)
Get-ADUser krbtgt -Properties PasswordLastSet | Select-Object PasswordLastSet

# Durcir les comptes d'administration
Add-ADGroupMember "Protected Users" -Members admin-jdupont
Set-ADAccountControl admin-jdupont -AccountNotDelegated $true
Set-ADUser svc-sql -KerberosEncryptionType AES128, AES256

# SMBv1
Get-SmbServerConfiguration | Select-Object EnableSMB1Protocol, RequireSecuritySignature
Set-SmbServerConfiguration -EnableSMB1Protocol $false -Force
```

### Windows LAPS

```powershell
Update-LapsADSchema
Set-LapsADComputerSelfPermission -Identity "OU=Postes,DC=corp,DC=exemple,DC=fr"
Set-LapsADReadPasswordPermission -Identity "OU=Postes,DC=corp,DC=exemple,DC=fr" -AllowedPrincipals "CORP\GG-Support"
Set-LapsADResetPasswordPermission -Identity "OU=Postes,DC=corp,DC=exemple,DC=fr" -AllowedPrincipals "CORP\GG-Support"
Get-LapsADPassword -Identity PC-PARIS-042 -AsPlainText
Set-LapsADPasswordExpirationTime -Identity PC-PARIS-042             # rotation au prochain cycle
# Sur le poste
Invoke-LapsPolicyProcessing
Reset-LapsPassword
Get-WinEvent -LogName "Microsoft-Windows-LAPS/Operational" -MaxEvents 20 | Select-Object TimeCreated, Id, Message
```

### Signature et liaison de canal LDAP

```powershell
# Journaliser les liaisons LDAP non signées (événement 2889) avant d'exiger la signature
Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Services\NTDS\Diagnostics" -Name "16 LDAP Interface Events" -Value 2
Get-WinEvent -FilterHashtable @{LogName='Directory Service'; Id=2889} -MaxEvents 50 | Select-Object TimeCreated, Message
# Exiger la signature (2) et la liaison de canal (2) sur les contrôleurs (équivalent des GPO de sécurité)
Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Services\NTDS\Parameters" -Name LDAPServerIntegrity -Value 2
Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Services\NTDS\Parameters" -Name LdapEnforceChannelBinding -Value 2
# LDAPS en place ?
Test-NetConnection DC01 -Port 636
```

### Stratégie d'audit

```powershell
auditpol /get /category:*
auditpol /list /subcategory:* /v                  # GUID des sous-catégories (noms traduits selon la langue)
# Modifications de l'annuaire (événement 5136), quelle que soit la langue du système
auditpol /set /subcategory:"{0CCE923C-69AE-11D9-BED3-505054503030}" /success:enable
```

## Kerberos et délégations

```powershell
klist                                             # tickets de l'utilisateur
klist tgt
klist purge
klist -li 0x3e7 purge                             # tickets du compte ordinateur (après ajout dans un groupe)
klist get HTTP/intranet.corp.exemple.fr           # demander un ticket de service

# SPN
setspn -L svc-sql
setspn -S MSSQLSvc/srv-sql.corp.exemple.fr:1433 CORP\svc-sql   # -S refuse les doublons
setspn -D MSSQLSvc/srv-sql.corp.exemple.fr:1433 CORP\svc-sql
setspn -Q HTTP/intranet.corp.exemple.fr
setspn -X -F                                      # doublons dans toute la forêt

# Délégation contrainte classique (Kerberos seulement)
Set-ADComputer srv-web -Add @{"msDS-AllowedToDelegateTo" = "HTTP/srv-app.corp.exemple.fr", "HTTP/srv-app"}
# Délégation contrainte basée sur les ressources : srv-app accepte srv-web
Set-ADComputer srv-app -PrincipalsAllowedToDelegateToAccount (Get-ADComputer srv-web)
Get-ADComputer srv-app -Properties PrincipalsAllowedToDelegateToAccount
```

## Approbations

```powershell
Get-ADTrust -Filter * | Select-Object Name, Direction, TrustType, ForestTransitive, SelectiveAuthentication, SIDFilteringQuarantined
nltest /domain_trusts /all_trusts /v
nltest /sc_query:partenaire.fr
nltest /sc_reset:partenaire.fr
netdom trust corp.exemple.fr /domain:partenaire.fr /verify
netdom trust corp.exemple.fr /domain:partenaire.fr /selectiveauth:yes
netdom trust corp.exemple.fr /domain:partenaire.fr /quarantine:yes
Resolve-DnsName -Name "_ldap._tcp.dc._msdcs.partenaire.fr" -Type SRV
Get-DnsServerZone | Where-Object ZoneType -eq "Forwarder"
Add-DnsServerConditionalForwarderZone -Name "partenaire.fr" -MasterServers 192.0.2.10, 192.0.2.11 -ReplicationScope Forest
```

## AD CS (autorité de certification)

```powershell
certutil -ping                                    # l'AC répond-elle ?
certutil -CAInfo
certutil -CATemplates                             # modèles publiés sur l'AC
Get-CATemplate
Add-CATemplate -Name "WebServer" -Force
certutil -view -restrict "Disposition=20" -out "RequestID,RequesterName,CommonName,NotAfter" csv > C:\Temp\certificats.csv
certutil -view -restrict "NotAfter<=11/30/2026,Disposition=20" -out "RequestID,CommonName,NotAfter"   # expirent avant fin novembre
certutil -revoke 1a2b3c4d5e6f 1                   # n° de série, motif 1 = clé compromise
certutil -crl                                     # publier une nouvelle CRL
certutil -setreg CA\CRLPeriodUnits 7
certutil -setreg CA\CRLPeriod "Days"
Restart-Service certsvc
certutil -verify -urlfetch C:\Temp\srv-web.cer    # chaîne, CRL et AIA accessibles ?
certutil -dump C:\Temp\srv-web.cer
certutil -pulse                                   # déclencher l'auto-inscription sur un poste

# Demande manuelle (fichier .inf), soumission, installation
certreq -new C:\Temp\srv-web.inf C:\Temp\srv-web.req
certreq -submit -config "srv-pki.corp.exemple.fr\CORP-AC-Emettrice" C:\Temp\srv-web.req C:\Temp\srv-web.cer
certreq -accept C:\Temp\srv-web.cer
Get-Certificate -Template "WebServer" -DnsName srv-web.corp.exemple.fr, intranet.corp.exemple.fr -CertStoreLocation Cert:\LocalMachine\My

# Sauvegarde de l'AC (base et clé privée)
Backup-CARoleService -Path "D:\Sauvegardes\PKI" -Password (Read-Host -AsSecureString "Mot de passe de la clé")
certutil -backupDB "D:\Sauvegardes\PKI"
reg export "HKLM\SYSTEM\CurrentControlSet\Services\CertSvc\Configuration" D:\Sauvegardes\PKI\certsvc.reg
```

## Diagnostic

```powershell
# Bilan rapide de toute la forêt (erreurs seulement)
dcdiag /e /q
dcdiag /s:DC02 /test:advertising /test:fsmocheck /test:netlogons /test:services /test:systemlog /v
dcdiag /v /c /e /f:C:\Temp\dcdiag.txt

# Ports d'un contrôleur depuis un poste ou un serveur
foreach ($p in 53, 88, 135, 389, 445, 464, 636, 3268, 3269, 9389) { "{0,5} : {1}" -f $p, (Test-NetConnection DC01 -Port $p -InformationLevel Quiet) }

# Journal de débogage Netlogon (%windir%\debug\netlogon.log), puis désactivation
nltest /dbflag:0x2080ffff
nltest /dbflag:0x0

# Identité et jetons
whoami /all
whoami /groups
whoami /upn
nltest /user:amartin
gpresult /r /scope user

# Recherches LDAP en invite de commandes
dsquery user -name "Alice*"
dsquery computer -inactive 12
dsquery * -filter "(&(objectClass=computer)(operatingSystem=*Server*))" -attr name operatingSystem -limit 0
dsget group "CN=GG-Reseau,OU=Groupes,DC=corp,DC=exemple,DC=fr" -members -expand
csvde -f C:\Temp\export.csv -r "(objectClass=user)" -l "sAMAccountName,mail,department"
ldifde -f C:\Temp\ou.ldf -d "OU=Paris,DC=corp,DC=exemple,DC=fr"
ldifde -i -f C:\Temp\modification.ldf -k          # importer en ignorant les doublons
```

### Événements utiles (journal Sécurité des contrôleurs)

| ID | Événement |
| --- | --- |
| 4624 / 4625 | Ouverture de session réussie / échouée |
| 4740 / 4767 | Compte verrouillé / déverrouillé |
| 4771 / 4776 | Échec de pré-authentification Kerberos / validation NTLM |
| 4720 / 4726 | Utilisateur créé / supprimé |
| 4728 / 4732 / 4756 | Ajout dans un groupe global / local / universel |
| 4724 | Réinitialisation de mot de passe par un tiers |
| 5136 | Objet de l'annuaire modifié (audit « Modifications du service d'annuaire ») |
| 4662 | Opération sur un objet (accès aux attributs sensibles) |

```powershell
Get-WinEvent -ComputerName DC01 -FilterHashtable @{LogName='Security'; Id=4728,4732,4756; StartTime=(Get-Date).AddDays(-7)} | Select-Object TimeCreated, Id, Message
Get-WinEvent -LogName "Directory Service" -MaxEvents 50 | Where-Object LevelDisplayName -in "Erreur", "Error" | Select-Object TimeCreated, Id, Message
```
