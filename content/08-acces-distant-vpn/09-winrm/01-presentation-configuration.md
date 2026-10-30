---
title: Présentation et configuration de WinRM
description: Windows Remote Management (WS-Management) et PowerShell à distance — écouteurs HTTP 5985 et HTTPS 5986, activation (Enable-PSRemoting, winrm quickconfig, GPO), authentification Kerberos, NTLM, Negotiate, certificats et CredSSP, TrustedHosts hors domaine, écouteur HTTPS avec certificat d'AD CS, sessions, Invoke-Command à grande échelle, PowerShell 7 par SSH et utilisation par Ansible et les outils d'administration.
tags: [winrm, powershell remoting, ws-management, kerberos, https, gpo, windows server]
icon: square-terminal
---

**WinRM** est l'implémentation Microsoft de **WS-Management** (SOAP sur HTTP/HTTPS). Il porte **PowerShell à distance** (`Enter-PSSession`, `Invoke-Command`), les requêtes CIM/WMI modernes, le Gestionnaire de serveur, [[10-windows-admin-center/01-presentation-installation|Windows Admin Center]], le transfert d'événements ([[08-windows-event-collector/01-presentation-configuration|WEF]]) et des outils tiers comme [[01-ansible/04-windows-awx-bonnes-pratiques|Ansible]] ou [[05-powershell-dsc/01-presentation-configurations|DSC]].

| Écouteur | Port | Remarques |
| --- | --- | --- |
| HTTP | **5985** | Activé par défaut sur Windows Server ; le contenu est **chiffré** par Kerberos/NTLM (pas de TLS) |
| **HTTPS** | **5986** | Certificat requis ; obligatoire hors domaine ou avec l'authentification Basic |

## Activation

```powershell
# Windows Server : déjà actif (profil Domaine) ; sur un poste Windows 11 :
Enable-PSRemoting -Force
winrm quickconfig            # équivalent historique

winrm enumerate winrm/config/listener
Get-PSSessionConfiguration | Select-Object Name, Permission
Test-WSMan srv-app-01.corp.exemple.fr
```

Par **GPO** (*Configuration ordinateur → Stratégies → Modèles d'administration → Composants Windows → Gestion à distance de Windows (WinRM) → Service WinRM*) : *Autoriser la gestion à distance du serveur via WinRM* (filtre IPv4 : réseau d'administration), service WinRM en démarrage automatique, règle de pare-feu 5985 limitée au réseau d'administration (voir [[10-pare-feu-windows/01-profils-regles|pare-feu Windows]]).

## Authentification

| Méthode | Usage | Remarques |
| --- | --- | --- |
| **Kerberos** | Domaine (par nom FQDN) | Recommandé ; authentification mutuelle |
| NTLM / Negotiate | Par adresse IP, hors domaine | Exige `TrustedHosts` ou HTTPS côté client |
| **Certificat client** | Comptes locaux mappés à un certificat | Hors domaine, automatisation |
| Basic | Comptes locaux | **HTTPS obligatoire** ; désactivé par défaut, à éviter |
| CredSSP | Délégation des identifiants (« double saut ») | Expose les identifiants sur le serveur distant : à proscrire ; préférer la délégation Kerberos contrainte basée sur les ressources |

```powershell
# Hors domaine (client) : autoriser une cible précise — jamais « * »
Set-Item WSMan:\localhost\Client\TrustedHosts -Value "srv-dmz-01.dmz.exemple.fr" -Concatenate -Force
Enter-PSSession -ComputerName srv-dmz-01.dmz.exemple.fr -Credential (Get-Credential srv-dmz-01\admin-local) -UseSSL
```

## Écouteur HTTPS

```powershell
# Certificat « Authentification du serveur » au nom FQDN (modèle AD CS auto-inscrit, ou certificat existant)
$cert = Get-ChildItem Cert:\LocalMachine\My | Where-Object { $_.Subject -eq "CN=srv-app-01.corp.exemple.fr" -and $_.EnhancedKeyUsageList.FriendlyName -contains "Authentification du serveur" } | Select-Object -First 1
New-Item -Path WSMan:\localhost\Listener -Transport HTTPS -Address * -CertificateThumbPrint $cert.Thumbprint -Force
New-NetFirewallRule -DisplayName "WinRM HTTPS" -Direction Inbound -Protocol TCP -LocalPort 5986 -RemoteAddress 10.0.99.0/24 -Action Allow

# Côté client
Invoke-Command -ComputerName srv-app-01.corp.exemple.fr -UseSSL -ScriptBlock { hostname }
```

Pour un déploiement à grande échelle, une **GPO** d'auto-inscription du certificat et la configuration de l'écouteur (*Autoriser la gestion à distance … : HTTPS* n'existe pas en GPO : script de démarrage ou DSC) ; voir [[01-active-directory/10-adcs-pki|AD CS]].

## Utilisation

```powershell
# Session interactive
Enter-PSSession -ComputerName srv-app-01

# Commande sur de nombreuses machines (parallélisée, 32 par défaut : -ThrottleLimit)
$serveurs = Get-ADComputer -Filter 'OperatingSystem -like "*Server*"' -SearchBase "OU=Serveurs,DC=corp,DC=exemple,DC=fr" | Select-Object -ExpandProperty DNSHostName
Invoke-Command -ComputerName $serveurs -ThrottleLimit 50 -ScriptBlock {
  [pscustomobject]@{ Nom = $env:COMPUTERNAME; Redemarrage = (Get-CimInstance Win32_OperatingSystem).LastBootUpTime; Smb1 = (Get-SmbServerConfiguration).EnableSMB1Protocol }
} | Sort-Object Nom | Format-Table Nom, Redemarrage, Smb1

# Sessions persistantes et copie de fichiers
$s = New-PSSession -ComputerName srv-app-01
Copy-Item C:\Outils\script.ps1 -Destination C:\Scripts\ -ToSession $s
Invoke-Command -Session $s -ScriptBlock { & C:\Scripts\script.ps1 }
Remove-PSSession $s

# CIM sur WinRM
Get-CimInstance -ComputerName srv-app-01 -ClassName Win32_LogicalDisk -Filter "DriveType=3"
```

## PowerShell 7 et SSH

PowerShell 7 peut utiliser **SSH** comme transport (`Enter-PSSession -HostName srv-app-01 -SSHTransport`), utile entre Linux et Windows ou sans WinRM : voir [[01-openssh/08-windows-server|OpenSSH sur Windows Server]]. Les points de terminaison WinRM de PowerShell 7 s'enregistrent avec `Enable-PSRemoting` exécuté **dans** `pwsh` (configuration `PowerShell.7`).

Suite : [[02-jea-securite-depannage|JEA, sécurité et dépannage]].
