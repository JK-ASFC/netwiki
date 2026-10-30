---
title: Installation du rôle et des extensions
description: Installer IIS par l'interface, PowerShell ou DISM, choisir les fonctionnalités, ajouter URL Rewrite, ARR, Web Deploy, le Hosting Bundle .NET et activer l'administration à distance.
tags: [iis, installation, powershell, windows server]
icon: download
---

## Prérequis

- Windows Server 2016 / 2019 / 2022 / 2025 (édition Standard ou Datacenter, avec ou sans interface graphique) ou Windows 10/11 Pro/Entreprise pour un poste de développement.
- Compte membre du groupe **Administrateurs** local.
- Adresse IP fixe et nom DNS résolvable si le serveur publie des sites en production.
- Un volume dédié aux contenus web (ex. `D:\Sites`) est recommandé : il sépare les données du système et simplifie les sauvegardes et les ACL.

## Installation par le Gestionnaire de serveur

1. **Gérer → Ajouter des rôles et fonctionnalités**.
2. Type : *Installation basée sur un rôle ou une fonctionnalité*.
3. Rôle : **Serveur Web (IIS)** → accepter l'ajout des outils de gestion.
4. Services de rôle : cocher les fonctionnalités nécessaires (voir tableau ci-dessous).
5. Installer — aucun redémarrage n'est normalement requis.

## Installation en PowerShell

```powershell
# Installation minimale + console de gestion
Install-WindowsFeature -Name Web-Server -IncludeManagementTools

# Profil « serveur d'applications » courant
Install-WindowsFeature -Name `
  Web-Server, Web-WebServer, Web-Common-Http, Web-Default-Doc, Web-Static-Content, Web-Http-Errors, Web-Http-Redirect, `
  Web-Health, Web-Http-Logging, Web-Log-Libraries, Web-Request-Monitor, Web-Http-Tracing, `
  Web-Performance, Web-Stat-Compression, Web-Dyn-Compression, `
  Web-Security, Web-Filtering, Web-Basic-Auth, Web-Windows-Auth, Web-IP-Security, Web-Cert-Auth, Web-Url-Auth, `
  Web-App-Dev, Web-Net-Ext45, Web-Asp-Net45, Web-ISAPI-Ext, Web-ISAPI-Filter, Web-AppInit, Web-WebSockets, Web-CGI, `
  Web-Mgmt-Tools, Web-Mgmt-Console, Web-Scripting-Tools, Web-Mgmt-Service `
  -IncludeManagementTools

# Lister ce qui est disponible / installé
Get-WindowsFeature Web-* | Format-Table Name, DisplayName, InstallState -AutoSize
```

> [!TIP]
> N'installez que ce qui est utilisé : chaque module ajouté augmente la surface d'attaque. Il est toujours possible d'ajouter une fonctionnalité plus tard sans interruption de service notable.

### Principales fonctionnalités

| Nom PowerShell | Fonctionnalité | Quand l'installer |
| --- | --- | --- |
| `Web-Static-Content` | Contenu statique | Toujours (HTML, CSS, JS, images) |
| `Web-Default-Doc` | Document par défaut | Toujours (`index.html`, `default.aspx`…) |
| `Web-Http-Errors` | Erreurs HTTP personnalisées | Toujours |
| `Web-Http-Redirect` | Redirection HTTP | Redirections simples sans URL Rewrite |
| `Web-Dir-Browsing` | Exploration de répertoire | Rarement (déconseillé en production) |
| `Web-Http-Logging` | Journalisation HTTP | Toujours |
| `Web-Http-Tracing` | Suivi des demandes ayant échoué (FREB) | Fortement recommandé pour le dépannage |
| `Web-Stat-Compression` / `Web-Dyn-Compression` | Compression gzip statique / dynamique | Sites publics |
| `Web-Filtering` | Filtrage des demandes | Toujours (durcissement) |
| `Web-Basic-Auth` | Authentification de base | API, intégration simple (sous HTTPS uniquement) |
| `Web-Windows-Auth` | Authentification Windows (Kerberos/NTLM) | Intranet, SSO AD |
| `Web-Cert-Auth` / `Web-Client-Auth` | Mappage de certificats clients (IIS / AD) | Authentification forte par certificat |
| `Web-IP-Security` | Restrictions IP et domaine (+ dynamiques) | Filtrage d'accès, anti-brute force |
| `Web-Url-Auth` | Autorisation d'URL | Règles allow/deny par utilisateur/groupe |
| `Web-Asp-Net45` / `Web-Net-Ext45` | ASP.NET 4.x | Applications .NET Framework |
| `Web-AppInit` | Initialisation d'application | Préchargement des applications lourdes |
| `Web-WebSockets` | Protocole WebSocket | SignalR, applications temps réel, reverse proxy WS |
| `Web-CGI` | CGI / **FastCGI** | PHP, Python (wfastcgi) |
| `Web-Ftp-Server`, `Web-Ftp-Service` | Serveur FTP | Voir [[10-ftp]] |
| `Web-DAV-Publishing` | WebDAV | Cas spécifiques (déconseillé sinon) |
| `Web-Mgmt-Service` | Service de gestion (WMSvc) | Administration distante, Web Deploy |
| `Web-Scripting-Tools` | Module PowerShell `WebAdministration` | Toujours |

## Installation sur Windows 10 / 11

```powershell
# Fonctionnalités optionnelles Windows (noms différents de Windows Server)
Enable-WindowsOptionalFeature -Online -All -FeatureName `
  IIS-WebServerRole, IIS-WebServer, IIS-CommonHttpFeatures, IIS-StaticContent, IIS-DefaultDocument, `
  IIS-HttpErrors, IIS-HttpLogging, IIS-RequestFiltering, IIS-HttpCompressionStatic, `
  IIS-WindowsAuthentication, IIS-ManagementConsole, IIS-ASPNET45, IIS-WebSockets
```

## Installation avec DISM (Server Core, images hors ligne)

```powershell
dism /online /enable-feature /featurename:IIS-WebServerRole /featurename:IIS-WebServer /all
# Sur une image hors ligne montée dans C:\mount
dism /image:C:\mount /enable-feature /featurename:IIS-WebServerRole /all
```

## Vérifications après installation

```powershell
Get-Service W3SVC, WAS | Select-Object Name, Status, StartType
Invoke-WebRequest http://localhost -UseBasicParsing | Select-Object StatusCode
Get-Website
Get-IISAppPool        # module IISAdministration
netsh http show servicestate   # état des files HTTP.sys
```

La page d'accueil par défaut d'IIS (`C:\inetpub\wwwroot\iisstart.htm`) doit s'afficher sur `http://localhost`.

> [!WARNING]
> Pensez au pare-feu : la règle **World Wide Web Services (HTTP Traffic-In)** est activée automatiquement, mais pas forcément celle du HTTPS (`HTTPS Traffic-In`), ni les règles FTP ou WMSvc.

```powershell
Enable-NetFirewallRule -DisplayName "World Wide Web Services (HTTPS Traffic-In)"
New-NetFirewallRule -DisplayName "IIS WMSvc 8172" -Direction Inbound -Protocol TCP -LocalPort 8172 -Action Allow -RemoteAddress 10.0.10.0/24
```

## Extensions incontournables (Web Platform)

Ces modules ne font pas partie de Windows et se téléchargent sur le site IIS de Microsoft (`iis.net/downloads`). Ils s'installent via MSI, silencieusement si besoin.

| Extension | Usage | Installation silencieuse |
| --- | --- | --- |
| **URL Rewrite 2.1** | Réécriture/redirection, règles de reverse proxy | `msiexec /i rewrite_amd64_fr-FR.msi /qn` |
| **Application Request Routing 3.0** (ARR) | Reverse proxy, répartition de charge, fermes de serveurs | `msiexec /i requestRouter_amd64.msi /qn` (installer URL Rewrite avant) |
| **Web Deploy 4** | Publication et synchronisation de sites | `msiexec /i WebDeploy_amd64_fr-FR.msi ADDLOCAL=ALL /qn` |
| **ASP.NET Core Hosting Bundle** | Runtime .NET + module `AspNetCoreModuleV2` | `dotnet-hosting-8.x-win.exe /install /quiet /norestart` |
| **IIS CORS Module** | Gestion des requêtes CORS (pré-vols OPTIONS) | MSI |
| **Advanced Logging / IIS Administration API** | Journalisation étendue / API REST de gestion | MSI (optionnels) |

> [!IMPORTANT]
> Après l'installation du **Hosting Bundle**, redémarrez IIS (`net stop was /y` puis `net start w3svc`) ou le serveur, sinon le module ASP.NET Core n'est pas chargé et les applications renvoient **500.19** ou **500.21**.

## Administration à distance (WMSvc)

Sur Server Core ou pour administrer plusieurs serveurs depuis un poste :

```powershell
Install-WindowsFeature Web-Mgmt-Service
Set-ItemProperty -Path HKLM:\SOFTWARE\Microsoft\WebManagement\Server -Name EnableRemoteManagement -Value 1
Set-Service WMSVC -StartupType Automatic
Start-Service WMSVC
```

Sur le poste d'administration : Gestionnaire IIS → **Fichier → Se connecter à un serveur** → `serveur:8172`. Le service présente un certificat auto-signé : remplacez-le par un certificat de votre PKI via la page *Service de gestion*.

> [!TIP]
> Alternative moderne : **Windows Admin Center** avec l'extension IIS, ou le module PowerShell à distance (`Enter-PSSession -ComputerName web01`).

## Désinstallation

```powershell
Uninstall-WindowsFeature Web-Server -IncludeManagementTools -Remove   # -Remove supprime aussi les binaires (Features on Demand)
```

Le dossier `C:\inetpub` et la configuration sauvegardée dans `%windir%\system32\inetsrv\backup` ne sont pas supprimés.
