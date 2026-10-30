---
title: WinRM et PowerShell Remoting — aide-mémoire des commandes
description: Commandes WinRM et PowerShell Remoting avec exemples — activation (Enable-PSRemoting, winrm quickconfig), écouteurs HTTP/HTTPS, TrustedHosts, sessions interactives et persistantes (Enter-PSSession, New-PSSession, Invoke-Command en parallèle), copie de fichiers par session, CredSSP et double saut, JEA (points de terminaison restreints), remoting par SSH (PowerShell 7), tests (Test-WSMan), dépannage.
tags: [aide-mémoire, winrm, powershell remoting, invoke-command, jea, wsman]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-configuration|WinRM]].

## Activation et écouteurs

```powershell
Enable-PSRemoting -Force
winrm quickconfig -quiet
winrm enumerate winrm/config/listener
Get-ChildItem WSMan:\localhost\Listener
# Écouteur HTTPS avec un certificat du magasin machine
$cert = Get-ChildItem Cert:\LocalMachine\My | Where-Object Subject -like "*srv01.corp.exemple.fr*"
New-Item -Path WSMan:\localhost\Listener -Transport HTTPS -Address * -CertificateThumbPrint $cert.Thumbprint -Force
New-NetFirewallRule -DisplayName "WinRM HTTPS" -Direction Inbound -Protocol TCP -LocalPort 5986 -RemoteAddress 10.0.99.0/24 -Action Allow
# Hors domaine : autoriser des hôtes (à limiter)
Set-Item WSMan:\localhost\Client\TrustedHosts -Value "10.0.30.15,srv-dmz01" -Force
Get-Item WSMan:\localhost\Client\TrustedHosts
```

## Sessions et exécution à distance

```powershell
Test-WSMan srv01
Enter-PSSession -ComputerName srv01 -Credential CORP\admin-jdupont
Exit-PSSession
Invoke-Command -ComputerName srv01, srv02, srv03 -ScriptBlock { Get-Service W32Time | Select-Object Status } -ThrottleLimit 32
Invoke-Command -ComputerName (Get-Content serveurs.txt) -FilePath .\inventaire.ps1 -ErrorAction Continue
$s = New-PSSession -ComputerName srv01 -UseSSL
Invoke-Command -Session $s -ScriptBlock { param($n) Get-Process $n } -ArgumentList "lsass"
Copy-Item .\outil.zip -Destination C:\Temp\ -ToSession $s
Copy-Item C:\Logs\app.log -Destination .\ -FromSession $s
Remove-PSSession $s
Get-PSSession
# Variables locales dans le bloc distant
$seuil = 80; Invoke-Command -ComputerName srv01 -ScriptBlock { Get-Volume | Where-Object { $_.SizeRemaining / $_.Size * 100 -lt (100 - $using:seuil) } }
```

## Double saut et CredSSP

```powershell
# Préférer la délégation Kerberos contrainte basée sur les ressources (RBCD) à CredSSP
Set-ADComputer srv-fichiers -PrincipalsAllowedToDelegateToAccount (Get-ADComputer srv01)
# CredSSP (risque : identifiants transmis au serveur) — uniquement si indispensable
Enable-WSManCredSSP -Role Client -DelegateComputer srv01.corp.exemple.fr -Force
Enable-WSManCredSSP -Role Server -Force          # sur srv01
```

## JEA (Just Enough Administration)

```powershell
New-PSRoleCapabilityFile -Path "C:\Program Files\WindowsPowerShell\Modules\JEA-DNS\RoleCapabilities\OperateurDNS.psrc" -VisibleCmdlets "Get-DnsServerResourceRecord", "Clear-DnsServerCache", @{Name="Restart-Service"; Parameters=@{Name="Name"; ValidateSet="DNS"}}
New-PSSessionConfigurationFile -Path .\JEA-DNS.pssc -SessionType RestrictedRemoteServer -RunAsVirtualAccount -RoleDefinitions @{ "CORP\GG-Operateurs-DNS" = @{ RoleCapabilities = "OperateurDNS" } }
Register-PSSessionConfiguration -Name JEA-DNS -Path .\JEA-DNS.pssc -Force
Enter-PSSession -ComputerName dns01 -ConfigurationName JEA-DNS
Get-PSSessionConfiguration | Select-Object Name, Permission
```

## PowerShell 7 par SSH (multi-plateforme)

```powershell
Enter-PSSession -HostName srv-linux01 -UserName amartin -SSHTransport
Invoke-Command -HostName srv-linux01, srv-win01 -UserName amartin -ScriptBlock { $PSVersionTable.OS }
# Côté serveur (sshd_config) : Subsystem powershell /usr/bin/pwsh -sshs -NoLogo
```

## Dépannage

```powershell
winrm get winrm/config
winrm get winrm/config/service/auth
Test-NetConnection srv01 -Port 5985
Get-WinEvent -LogName "Microsoft-Windows-WinRM/Operational" -MaxEvents 20
klist                                   # Kerberos : nom de machine (pas l'IP) requis par défaut
```

| Erreur | Cause |
| --- | --- |
| `WinRM cannot complete the operation` | Service arrêté, pare-feu, réseau « public » |
| `The WinRM client cannot process the request… TrustedHosts` | Connexion par IP ou hors domaine sans HTTPS/TrustedHosts |
| `Access is denied` | Compte non administrateur (ou non membre de « Remote Management Users »), UAC distant pour les comptes locaux |
