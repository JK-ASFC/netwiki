---
title: Déploiement, collections, certificats et passerelle
description: Déployer RDS en PowerShell (déploiement basé sur les sessions, ajout des rôles, collections, applications RemoteApp), certificats des rôles, Broker hautement disponible avec SQL Server, passerelle des services Bureau à distance (stratégies CAP et RAP, transport UDP, MFA avec NPS), accès web et client HTML5.
tags: [rds, déploiement, collections, remoteapp, rd gateway, certificats, haute disponibilité, mfa]
icon: settings-2
---

## Déploiement de base

```powershell
# Depuis un serveur d'administration du domaine
Import-Module RemoteDesktop
New-RDSessionDeployment -ConnectionBroker srv-rdcb-01.corp.exemple.fr `
  -WebAccessServer srv-rdweb-01.corp.exemple.fr `
  -SessionHost srv-rdsh-01.corp.exemple.fr, srv-rdsh-02.corp.exemple.fr

Add-RDServer -Server srv-rdgw-01.corp.exemple.fr -Role RDS-GATEWAY -ConnectionBroker srv-rdcb-01.corp.exemple.fr -GatewayExternalFqdn bureau.exemple.fr
Add-RDServer -Server srv-rdlic-01.corp.exemple.fr -Role RDS-LICENSING -ConnectionBroker srv-rdcb-01.corp.exemple.fr
Set-RDLicenseConfiguration -LicenseServer srv-rdlic-01.corp.exemple.fr -Mode PerUser -ConnectionBroker srv-rdcb-01.corp.exemple.fr -Force

Get-RDServer -ConnectionBroker srv-rdcb-01.corp.exemple.fr
```

Les hôtes de session redémarrent pendant l'ajout du rôle. Installez les **applications** sur les hôtes en mode installation (`change user /install`, puis `change user /execute`) ou avec un outil de déploiement, de façon **identique** sur chaque hôte.

## Collections et RemoteApp

```powershell
New-RDSessionCollection -CollectionName "Bureautique" -SessionHost srv-rdsh-01.corp.exemple.fr, srv-rdsh-02.corp.exemple.fr `
  -CollectionDescription "Bureau complet" -ConnectionBroker srv-rdcb-01.corp.exemple.fr
Set-RDSessionCollectionConfiguration -CollectionName "Bureautique" -UserGroup "CORP\GG-RDS-Bureautique" `
  -DisconnectedSessionLimitMin 120 -IdleSessionLimitMin 60 -ActiveSessionLimitMin 0 `
  -ClientDeviceRedirectionOptions "Clipboard,AudioVideoPlayBack,AudioRecording,SmartCard" -MaxRedirectedMonitors 2 `
  -ConnectionBroker srv-rdcb-01.corp.exemple.fr

New-RDSessionCollection -CollectionName "Applis-Metier" -SessionHost srv-rdsh-03.corp.exemple.fr -ConnectionBroker srv-rdcb-01.corp.exemple.fr
New-RDRemoteApp -CollectionName "Applis-Metier" -DisplayName "ERP" -FilePath "C:\Program Files\ERP\erp.exe" -UserGroups "CORP\GG-ERP" -ConnectionBroker srv-rdcb-01.corp.exemple.fr
```

La redirection des **lecteurs** et des **imprimantes** est à n'activer que si nécessaire (risque de fuite de données, pilotes d'impression : préférez le pilote *Easy Print*).

## Certificats

```powershell
$mdp = Read-Host -AsSecureString "Mot de passe du PFX"
foreach ($role in "RDGateway", "RDWebAccess", "RDRedirector", "RDPublishing") {
  Set-RDCertificate -Role $role -ImportPath C:\Certs\bureau.exemple.fr.pfx -Password $mdp -ConnectionBroker srv-rdcb-01.corp.exemple.fr -Force
}
Get-RDCertificate -ConnectionBroker srv-rdcb-01.corp.exemple.fr
```

Utilisez un certificat **public** (ou d'une AC approuvée par tous les clients) couvrant le nom externe (`bureau.exemple.fr`) et les noms internes utilisés (broker, web). Un certificat non approuvé ou un nom différent provoque des avertissements à chaque connexion et casse l'authentification unique.

## Broker hautement disponible

```powershell
# Base SQL Server (ou Azure SQL) + nom DNS en tourniquet pour les brokers
Set-RDConnectionBrokerHighAvailability -ConnectionBroker srv-rdcb-01.corp.exemple.fr `
  -DatabaseConnectionString "DRIVER=SQL Server Native Client 11.0;SERVER=srv-sql-01;Trusted_Connection=Yes;APP=Remote Desktop Services Connection Broker;DATABASE=RDCB" `
  -ClientAccessName rdcb.corp.exemple.fr
Add-RDServer -Server srv-rdcb-02.corp.exemple.fr -Role RDS-CONNECTION-BROKER -ConnectionBroker srv-rdcb-01.corp.exemple.fr
```

Prérequis : le client SQL (pilote ODBC) sur chaque broker, les comptes d'ordinateur des brokers dans un groupe ayant les droits sur la base, enregistrement DNS `rdcb` vers chaque broker. Doublez aussi l'**accès web** et la **passerelle** derrière un répartiteur.

## Passerelle (RD Gateway)

*Gestionnaire de passerelle des services Bureau à distance* (`tsgateway.msc`) :

| Stratégie | Rôle |
| --- | --- |
| **CAP** (*Connection Authorization Policy*) | **Qui** peut se connecter : groupes d'utilisateurs (et d'ordinateurs), méthode (mot de passe, carte à puce), redirections autorisées |
| **RAP** (*Resource Authorization Policy*) | **Vers quoi** : groupe d'ordinateurs ou ferme gérée par le broker, port 3389 |

- Activez le **transport UDP** (3391) pour la fluidité.
- Pour la **MFA**, configurez la passerelle pour utiliser un **NPS central** avec l'extension Microsoft Entra MFA (*Stockage des stratégies CAP sur un serveur NPS central*) — voir [[02-nps/02-8021x-vpn-equipements-depannage|NPS]] ; ou publiez l'accès web derrière un proxy d'authentification.
- Limitez l'exposition : seuls 443/TCP et 3391/UDP depuis Internet vers la passerelle, en DMZ ; les hôtes de session restent internes.

## Accès web et clients

| Accès | URL / méthode |
| --- | --- |
| Portail web classique | `https://bureau.exemple.fr/RDWeb` |
| **Client web HTML5** | Module à installer sur le serveur d'accès web : `Install-Module RDWebClientManagement`, `Install-RDWebClientPackage`, `Import-RDWebClientBrokerCert`, `Publish-RDWebClientPackage -Type Production -Latest` → `https://bureau.exemple.fr/RDWeb/webclient` |
| Abonnement au flux | Client *Bureau à distance* / *Windows App* : `https://bureau.exemple.fr/RDWeb/feed/webfeed.aspx` (ou adresse de messagerie avec enregistrement DNS `_msradc`) |

Suite : [[03-licences-securite-exploitation|licences, sécurité et exploitation]].
