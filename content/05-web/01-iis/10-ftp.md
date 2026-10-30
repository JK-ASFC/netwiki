---
title: Serveur FTP / FTPS
description: Installer le service FTP d'IIS, créer un site FTP, FTPS explicite et implicite, isolation des utilisateurs, règles d'autorisation, mode passif et pare-feu, journalisation.
tags: [iis, ftp, ftps, transfert de fichiers]
icon: folder-up
---

> [!NOTE]
> Pour de nouveaux besoins, préférez **SFTP** (OpenSSH Server intégré à Windows : `Add-WindowsCapability -Online -Name OpenSSH.Server~~~~0.0.1.0`). Le FTP d'IIS reste utile pour des équipements ou applications qui ne parlent que FTP/FTPS (imprimantes, scanners, sauvegardes d'équipements réseau, caméras…).

## Installation

```powershell
Install-WindowsFeature Web-Ftp-Server, Web-Ftp-Service, Web-Ftp-Ext -IncludeManagementTools
Get-Service FTPSVC
```

## Créer un site FTP

```powershell
Import-Module WebAdministration
New-Item -ItemType Directory D:\FTP\Racine -Force
New-WebFtpSite -Name "FTP-Equipements" -Port 21 -PhysicalPath "D:\FTP\Racine" -IPAddress "*"

# Authentification de base (comptes Windows / AD), anonyme désactivé
Set-ItemProperty "IIS:\Sites\FTP-Equipements" -Name ftpServer.security.authentication.basicAuthentication.enabled -Value $true
Set-ItemProperty "IIS:\Sites\FTP-Equipements" -Name ftpServer.security.authentication.anonymousAuthentication.enabled -Value $false

# Règle d'autorisation : groupe AD en lecture/écriture
Add-WebConfiguration "/system.ftpServer/security/authorization" -PSPath IIS:\ -Location "FTP-Equipements" `
  -Value @{accessType="Allow"; roles="CORP\GG-FTP-Equipements"; permissions="Read,Write"}
```

## FTPS (FTP sur TLS)

| Mode | Port | Fonctionnement |
| --- | --- | --- |
| **Explicite** (FTPES) | 21 | Le client se connecte en clair puis envoie `AUTH TLS` |
| **Implicite** | 990 | TLS dès l'ouverture (liaison `ftp` sur le port 990) |

```powershell
$thumb = (Get-ChildItem Cert:\LocalMachine\My | Where-Object Subject -like "*ftp.exemple.fr*").Thumbprint
Set-ItemProperty "IIS:\Sites\FTP-Equipements" -Name ftpServer.security.ssl.serverCertHash -Value $thumb
# SslRequire = TLS obligatoire pour le contrôle et les données ; SslAllow = facultatif
Set-ItemProperty "IIS:\Sites\FTP-Equipements" -Name ftpServer.security.ssl.controlChannelPolicy -Value "SslRequire"
Set-ItemProperty "IIS:\Sites\FTP-Equipements" -Name ftpServer.security.ssl.dataChannelPolicy -Value "SslRequire"
```

> [!WARNING]
> En FTPS, le pare-feu ne peut plus inspecter les commandes `PASV` chiffrées : il faut **ouvrir explicitement la plage de ports passifs**. C'est la cause n°1 des « connexion OK mais listing impossible ».

## Mode passif et pare-feu

```powershell
# Plage de ports passifs au niveau serveur
Set-WebConfigurationProperty -PSPath IIS:\ -Filter system.ftpServer/firewallSupport -Name lowDataChannelPort -Value 50000
Set-WebConfigurationProperty -PSPath IIS:\ -Filter system.ftpServer/firewallSupport -Name highDataChannelPort -Value 50100

# IP publique annoncée quand le serveur est derrière du NAT (par site)
Set-ItemProperty "IIS:\Sites\FTP-Equipements" -Name ftpServer.firewallSupport.externalIp4Address -Value "203.0.113.20"

Restart-Service FTPSVC

New-NetFirewallRule -DisplayName "FTP contrôle" -Direction Inbound -Protocol TCP -LocalPort 21,990 -Action Allow
New-NetFirewallRule -DisplayName "FTP passif" -Direction Inbound -Protocol TCP -LocalPort 50000-50100 -Action Allow
```

Le service FTP intègre aussi un filtre de pare-feu Windows (`netsh advfirewall set global StatefulFtp enable`) qui ouvre dynamiquement les ports **uniquement en FTP non chiffré**.

## Isolation des utilisateurs

Chaque utilisateur est enfermé dans son dossier :

| Mode | Dossier racine de l'utilisateur |
| --- | --- |
| `None` | Racine du site (pas d'isolation) |
| `StartInUsersDirectory` | Dossier de l'utilisateur s'il existe, mais navigation possible au-dessus |
| `IsolateRootDirectoryOnly` | `LocalUser\<user>` ou `<DOMAINE>\<user>` sous la racine, sans remontée |
| `IsolateAllDirectories` | Idem, et répertoires virtuels globaux masqués |
| `ActiveDirectory` | Attributs AD `msIIS-FTPRoot` et `msIIS-FTPDir` de l'utilisateur |

```powershell
Set-ItemProperty "IIS:\Sites\FTP-Equipements" -Name ftpServer.userIsolation.mode -Value "IsolateRootDirectoryOnly"
# Arborescence attendue :
#   D:\FTP\Racine\CORP\sauvegarde-switch\
#   D:\FTP\Racine\LocalUser\scanner01\
#   D:\FTP\Racine\LocalUser\Public\        (utilisateur anonyme)
```

## Utilisateurs IIS Manager (sans compte Windows)

Pour des comptes FTP qui n'existent ni localement ni dans l'AD :

1. Installer `Web-Mgmt-Service`.
2. *Autorisations du Gestionnaire IIS* → Ajouter des utilisateurs IIS Manager.
3. Sur le site FTP : *Authentification FTP* → **Fournisseurs personnalisés** → `IisManagerAuth`.
4. Donner à l'identité du service (`NT SERVICE\ftpsvc`) les droits NTFS sur les dossiers.

## Restrictions et protections

```xml
<system.ftpServer>
  <security>
    <ipSecurity allowUnlisted="false">
      <add ipAddress="10.20.0.0" subnetMask="255.255.0.0" allowed="true" />
    </ipSecurity>
    <requestFiltering>
      <fileExtensions allowUnlisted="true">
        <add fileExtension=".exe" allowed="false" />
      </fileExtensions>
      <requestLimits maxAllowedContentLength="1073741824" />
    </requestFiltering>
  </security>
</system.ftpServer>
```

- **Verrouillage de connexion FTP** (*FTP Logon Attempt Restrictions*, niveau serveur) : bloque une IP après N échecs en X secondes.
- Bannière personnalisée sans numéro de version (*Messages FTP* → *Supprimer la bannière par défaut*).

## Journaux et test

- Journaux : `C:\inetpub\logs\LogFiles\FTPSVC<ID>\` (format W3C : commandes `USER`, `PASS`, `STOR`, `RETR`, codes 2xx/4xx/5xx).

```powershell
# Test FTPS explicite depuis Windows (curl est intégré)
curl.exe -v --ssl-reqd -u "CORP\sauvegarde-switch" ftp://ftp.exemple.fr/
# Envoi d'un fichier
curl.exe --ssl-reqd -u "CORP\sauvegarde-switch" -T .\running-config.txt ftp://ftp.exemple.fr/
```

| Code FTP | Signification |
| --- | --- |
| 530 | Authentification refusée (mot de passe, isolation sans dossier utilisateur, règle d'autorisation) |
| 534 / 550 avec SSL | Politique SSL exigée mais client en clair |
| 425 | Impossible d'ouvrir la connexion de données (ports passifs, pare-feu, NAT) |
| 550 | Accès refusé au fichier (ACL NTFS ou règle d'autorisation) |
