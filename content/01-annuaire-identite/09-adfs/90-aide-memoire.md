---
title: AD FS — aide-mémoire des commandes
description: Commandes AD FS avec exemples — installation de la ferme (Install-AdfsFarm, Add-AdfsFarmNode), proxy d'application web, approbations de partie de confiance (SAML, WS-Fed), applications OpenID Connect (groupes d'applications), règles de transformation de revendications, certificats (rotation, AutoCertificateRollover), propriétés de la ferme, authentification (MFA, verrouillage extranet), diagnostic (journaux, Test-AdfsServerHealth, page IdpInitiatedSignon).
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
