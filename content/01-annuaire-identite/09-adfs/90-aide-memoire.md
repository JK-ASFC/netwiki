---
title: AD FS — aide-mémoire des commandes
description: Référence complète des commandes AD FS avec exemples — prérequis (gMSA, SPN, enregistrement DNS, certificat SSL), installation de la ferme (WID ou SQL, nœuds, rôles de synchronisation, niveau de comportement), proxy d'application web et publications, propriétés de la ferme, authentification globale et MFA Microsoft Entra, verrouillage extranet intelligent, points de terminaison et durcissement, parties de confiance SAML et WS-Fed (règles de revendications), applications et API OpenID Connect, certificats SSL et de signature (rotation), audit et traces, sauvegarde, diagnostic.
tags: [aide-mémoire, adfs, saml, oidc, powershell, fédération]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-installation|AD FS]].

## Installation

```powershell
Install-WindowsFeature ADFS-Federation -IncludeManagementTools
# Premier serveur (compte gMSA recommandé)
Install-AdfsFarm -CertificateThumbprint "A1B2C3..." -FederationServiceName "sts.exemple.fr" -FederationServiceDisplayName "Connexion Exemple" -GroupServiceAccountIdentifier "CORP\gmsa-adfs$"
# Serveur supplémentaire
Add-AdfsFarmNode -CertificateThumbprint "A1B2C3..." -PrimaryComputerName "adfs01.corp.exemple.fr" -GroupServiceAccountIdentifier "CORP\gmsa-adfs$"
# Proxy d'application web (DMZ)
Install-WindowsFeature Web-Application-Proxy -IncludeManagementTools
Install-WebApplicationProxy -FederationServiceName "sts.exemple.fr" -CertificateThumbprint "A1B2C3..." -FederationServiceTrustCredential (Get-Credential)
```

## Ferme et propriétés

```powershell
Get-AdfsProperties | Select-Object HostName, Identifier, AutoCertificateRollover, ExtranetLockoutEnabled
Set-AdfsProperties -EnableIdPInitiatedSignonPage $true          # page de test /adfs/ls/idpinitiatedsignon.aspx
Set-AdfsProperties -EnableExtranetLockout $true -ExtranetLockoutThreshold 10 -ExtranetObservationWindow (New-TimeSpan -Minutes 30)
Get-AdfsFarmInformation
Get-AdfsSyncProperties
Get-AdfsEndpoint | Where-Object Enabled | Select-Object FullUrl
```

## Parties de confiance (SAML / WS-Fed)

```powershell
Add-AdfsRelyingPartyTrust -Name "Intranet" -MetadataUrl "https://intranet.exemple.fr/saml/metadata" -AccessControlPolicyName "Permit everyone"
Get-AdfsRelyingPartyTrust | Select-Object Name, Enabled, Identifier
Update-AdfsRelyingPartyTrust -TargetName "Intranet"            # relire les métadonnées
Set-AdfsRelyingPartyTrust -TargetName "Intranet" -AccessControlPolicyName "Permit everyone and require MFA"
Disable-AdfsRelyingPartyTrust -TargetName "Intranet"
# Règles de revendications : e-mail en NameID + groupes
$regles = @'
@RuleTemplate = "LdapClaims"
@RuleName = "Attributs AD"
c:[Type == "http://schemas.microsoft.com/ws/2008/06/identity/claims/windowsaccountname", Issuer == "AD AUTHORITY"]
 => issue(store = "Active Directory", types = ("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress", "http://schemas.xmlsoap.org/claims/Group"), query = ";mail,tokenGroups;{0}", param = c.Value);
'@
Set-AdfsRelyingPartyTrust -TargetName "Intranet" -IssuanceTransformRules $regles
(Get-AdfsRelyingPartyTrust -Name "Intranet").IssuanceTransformRules
```

## Applications OpenID Connect

```powershell
New-AdfsApplicationGroup -Name "Portail" -ApplicationGroupIdentifier "portail"
Add-AdfsServerApplication -Name "Portail - serveur" -ApplicationGroupIdentifier "portail" -Identifier "https://portail.exemple.fr" -RedirectUri "https://portail.exemple.fr/signin-oidc" -GenerateClientSecret
Get-AdfsApplicationGroup | Select-Object Name, ApplicationGroupIdentifier
Get-AdfsServerApplication -Name "Portail - serveur"
```

## Certificats

```powershell
Get-AdfsCertificate | Select-Object CertificateType, IsPrimary, Thumbprint, @{n="Expire";e={$_.Certificate.NotAfter}}
# Certificat SSL (sur chaque serveur et proxy)
Set-AdfsSslCertificate -Thumbprint "D4E5F6..."
Set-WebApplicationProxySslCertificate -Thumbprint "D4E5F6..."
# Signature / déchiffrement : rotation automatique ou manuelle
Set-AdfsProperties -AutoCertificateRollover $true
Update-AdfsCertificate -CertificateType Token-Signing -Urgent
```

## Diagnostic

```powershell
Get-WinEvent -LogName "AD FS/Admin" -MaxEvents 30 | Format-Table TimeCreated, Id, Message -Wrap
Get-AdfsAccountActivity -UserPrincipalName amartin@corp.exemple.fr    # verrouillage extranet
Reset-AdfsAccountLockout -UserPrincipalName amartin@corp.exemple.fr -Location Unknown
Invoke-WebRequest https://sts.exemple.fr/FederationMetadata/2007-06/FederationMetadata.xml -UseBasicParsing | Select-Object StatusCode
Invoke-WebRequest http://sts.exemple.fr/adfs/probe -UseBasicParsing        # sonde pour répartiteur de charge
Get-WebApplicationProxyHealth
```

## Prérequis : compte de service, SPN, DNS, certificat

```powershell
# Compte de service géré pour la ferme (voir Active Directory → gMSA)
New-ADServiceAccount -Name gmsa-adfs -DNSHostName sts.exemple.fr -PrincipalsAllowedToRetrieveManagedPassword "GG-Serveurs-ADFS"
setspn -S HOST/sts.exemple.fr CORP\gmsa-adfs$
# Enregistrement A (pas CNAME) pour que l'authentification Windows intégrée fonctionne
Add-DnsServerResourceRecordA -ZoneName "exemple.fr" -Name "sts" -IPv4Address "10.0.10.40"
# Certificat SSL (nom du service + certauth pour l'authentification par certificat)
Get-Certificate -Template "WebServer" -DnsName sts.exemple.fr, certauth.sts.exemple.fr -CertStoreLocation Cert:\LocalMachine\My
Import-PfxCertificate -FilePath C:\Temp\sts.pfx -CertStoreLocation Cert:\LocalMachine\My -Password (Read-Host -AsSecureString "Mot de passe du PFX")
Get-ChildItem Cert:\LocalMachine\My | Select-Object Thumbprint, Subject, NotAfter
```

## Ferme : SQL, rôles, niveau de comportement

```powershell
# Ferme sur SQL Server au lieu de la base interne (WID)
Install-AdfsFarm -CertificateThumbprint "A1B2C3D4E5F6" -FederationServiceName "sts.exemple.fr" -GroupServiceAccountIdentifier "CORP\gmsa-adfs$" -SQLConnectionString "Data Source=srv-sql.corp.exemple.fr;Integrated Security=True"
# WID : promouvoir un nœud secondaire en principal (le principal est perdu)
Set-AdfsSyncProperties -Role PrimaryComputer                                              # sur le nouveau principal
Set-AdfsSyncProperties -Role SecondaryComputer -PrimaryComputerName adfs02.corp.exemple.fr # sur les autres nœuds
# Niveau de comportement après mise à niveau de tous les nœuds
Test-AdfsFarmBehaviorLevelRaise
Invoke-AdfsFarmBehaviorLevelRaise
Get-AdfsFarmInformation | Select-Object CurrentFarmBehavior, FarmNodes
```

## Authentification, MFA et verrouillage intelligent

```powershell
Get-AdfsGlobalAuthenticationPolicy
Set-AdfsGlobalAuthenticationPolicy -PrimaryIntranetAuthenticationProvider WindowsAuthentication, FormsAuthentication -PrimaryExtranetAuthenticationProvider FormsAuthentication
# MFA Microsoft Entra (adaptateur intégré, Windows Server 2016+)
New-AdfsAzureMfaTenantCertificate -TenantId "00000000-0000-0000-0000-000000000000"
Set-AdfsAzureMfaTenant -TenantId "00000000-0000-0000-0000-000000000000" -ClientId 981f26a1-7f43-403b-a875-f8b09b8cd720
Set-AdfsGlobalAuthenticationPolicy -AdditionalAuthenticationProvider AzureMfaAuthentication
Restart-Service adfssrv
# Verrouillage extranet « intelligent » : journaliser d'abord, puis appliquer
Set-AdfsProperties -EnableExtranetLockout $true -ExtranetLockoutThreshold 15 -ExtranetObservationWindow (New-TimeSpan -Minutes 30) -ExtranetLockoutMode AdfsSmartLockoutLogOnly
Set-AdfsProperties -ExtranetLockoutMode AdfsSmartLockoutEnforce
Get-AdfsAccountActivity -UserPrincipalName amartin@corp.exemple.fr
Reset-AdfsAccountLockout -UserPrincipalName amartin@corp.exemple.fr -Location Familiar
Get-AdfsAccessControlPolicy | Select-Object Name
```

## Points de terminaison et durcissement

```powershell
Get-AdfsEndpoint | Where-Object { $_.Enabled -and $_.Proxy } | Select-Object FullUrl, Protocol
# Ne plus publier WS-Trust « usernamemixed » vers l'extérieur (attaques par pulvérisation de mots de passe)
Set-AdfsEndpoint -TargetAddressPath /adfs/services/trust/2005/usernamemixed -Proxy $false
Set-AdfsEndpoint -TargetAddressPath /adfs/services/trust/13/usernamemixed -Proxy $false
Set-AdfsProperties -EnableIdPInitiatedSignonPage $false                    # page de test à désactiver en production
Get-AdfsProperties | Select-Object ExtranetLockoutEnabled, ExtranetLockoutMode, EnableIdPInitiatedSignonPage, AuditLevel
```

## Proxy d'application web : publications

```powershell
Add-WebApplicationProxyApplication -Name "Intranet" -ExternalPreauthentication ADFS -ADFSRelyingPartyName "Proxy intranet" -ExternalUrl "https://intranet.exemple.fr/" -BackendServerUrl "https://intranet.corp.exemple.fr/" -ExternalCertificateThumbprint "D4E5F6A1B2C3"
Add-WebApplicationProxyApplication -Name "Messagerie" -ExternalPreauthentication PassThrough -ExternalUrl "https://mail.exemple.fr/" -BackendServerUrl "https://mail.corp.exemple.fr/" -ExternalCertificateThumbprint "D4E5F6A1B2C3"
Get-WebApplicationProxyApplication | Select-Object Name, ExternalUrl, BackendServerUrl, ExternalPreauthentication
Get-WebApplicationProxyConfiguration
# Relation d'approbation proxy ↔ ferme expirée (erreur 422 ou 13…) : réexécuter l'installation
Install-WebApplicationProxy -FederationServiceName "sts.exemple.fr" -CertificateThumbprint "D4E5F6A1B2C3" -FederationServiceTrustCredential (Get-Credential CORP\admin-jdupont)
netsh http show sslcert
```

## API web OpenID Connect

```powershell
Add-AdfsWebApiApplication -Name "Portail - API" -ApplicationGroupIdentifier "portail" -Identifier "https://api.exemple.fr" -AccessControlPolicyName "Permit everyone"
Grant-AdfsApplicationPermission -ClientRoleIdentifier "<identifiant-du-client>" -ServerRoleIdentifier "https://api.exemple.fr" -ScopeNames openid, profile
Get-AdfsApplicationPermission | Select-Object ClientRoleIdentifier, ServerRoleIdentifier, ScopeNames
Invoke-RestMethod https://sts.exemple.fr/adfs/.well-known/openid-configuration | Select-Object issuer, authorization_endpoint, token_endpoint
```

## Certificats de signature (rotation manuelle)

```powershell
Set-AdfsProperties -AutoCertificateRollover $false
Add-AdfsCertificate -CertificateType Token-Signing -Thumbprint "C9D8E7F6A5B4"
Set-AdfsCertificate -CertificateType Token-Signing -Thumbprint "C9D8E7F6A5B4" -IsPrimary   # après mise à jour des parties de confiance
Remove-AdfsCertificate -CertificateType Token-Signing -Thumbprint "A1B2C3D4E5F6"
```

## Audit, traces, sauvegarde

```powershell
Set-AdfsProperties -AuditLevel Verbose
# Sous-catégorie « Généré par application » (événements 1200/1201 dans le journal Sécurité)
auditpol /set /subcategory:"{0CCE9222-69AE-11D9-BED3-505054503030}" /success:enable /failure:enable
Get-WinEvent -FilterHashtable @{LogName='Security'; Id=1203; StartTime=(Get-Date).AddHours(-1)} | Select-Object TimeCreated, Message -First 10   # échecs d'identification
wevtutil sl "AD FS Tracing/Debug" /e:true                                  # trace de débogage (journal analytique)
wevtutil sl "AD FS Tracing/Debug" /e:false
# Exporter la configuration des parties de confiance
Get-AdfsRelyingPartyTrust | Export-Clixml C:\Sauvegardes\adfs-parties-de-confiance.xml
Get-AdfsApplicationGroup | Export-Clixml C:\Sauvegardes\adfs-groupes-applications.xml
# Sauvegarde complète : outil « AD FS Rapid Restore » (module ADFSRapidRecreationTool)
Backup-ADFS -StorageType FileSystem -StoragePath C:\Sauvegardes\ADFS -EncryptionPassword (Read-Host "Mot de passe de chiffrement") -BackupDKM
```
