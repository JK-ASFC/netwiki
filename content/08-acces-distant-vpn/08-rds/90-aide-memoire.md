---
title: Services Bureau à distance (RDS) — aide-mémoire des commandes
description: Commandes RDS avec exemples — déploiement (New-RDSessionDeployment, Add-RDServer), collections de sessions et RemoteApp, licences (Set-RDLicenseConfiguration), passerelle et accès web, certificats (Set-RDCertificate), sessions utilisateurs (Get-RDUserSession, déconnexion, message, prise de contrôle, quser, qwinsta, logoff), mode drain, profils FSLogix, client mstsc et fichiers .rdp, dépannage.
tags: [aide-mémoire, rds, remote desktop, remoteapp, rd gateway, mstsc]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-architecture|RDS]].

## Déploiement

```powershell
Import-Module RemoteDesktop
New-RDSessionDeployment -ConnectionBroker rdcb01.corp.exemple.fr -WebAccessServer rdweb01.corp.exemple.fr -SessionHost rdsh01.corp.exemple.fr, rdsh02.corp.exemple.fr
Add-RDServer -Server rdgw01.corp.exemple.fr -Role RDS-GATEWAY -ConnectionBroker rdcb01.corp.exemple.fr -GatewayExternalFqdn bureau.exemple.fr
Add-RDServer -Server rdlic01.corp.exemple.fr -Role RDS-LICENSING -ConnectionBroker rdcb01.corp.exemple.fr
Set-RDLicenseConfiguration -LicenseServer rdlic01.corp.exemple.fr -Mode PerUser -ConnectionBroker rdcb01.corp.exemple.fr
Get-RDServer -ConnectionBroker rdcb01.corp.exemple.fr
```

## Collections et RemoteApp

```powershell
New-RDSessionCollection -CollectionName "Bureautique" -SessionHost rdsh01.corp.exemple.fr, rdsh02.corp.exemple.fr -ConnectionBroker rdcb01.corp.exemple.fr
Set-RDSessionCollectionConfiguration -CollectionName "Bureautique" -UserGroup "CORP\GG-Utilisateurs-RDS" -DisconnectedSessionLimitMin 120 -IdleSessionLimitMin 60 -ConnectionBroker rdcb01.corp.exemple.fr
New-RDRemoteApp -CollectionName "Bureautique" -DisplayName "Excel" -FilePath "C:\Program Files\Microsoft Office\root\Office16\EXCEL.EXE" -ConnectionBroker rdcb01.corp.exemple.fr
Get-RDRemoteApp -CollectionName "Bureautique"
Get-RDSessionCollection
```

## Certificats

```powershell
$mdp = Read-Host -AsSecureString "Mot de passe du PFX"
foreach ($role in "RDGateway", "RDWebAccess", "RDRedirector", "RDPublishing") {
  Set-RDCertificate -Role $role -ImportPath "C:\Certs\bureau.exemple.fr.pfx" -Password $mdp -ConnectionBroker rdcb01.corp.exemple.fr -Force
}
Get-RDCertificate -ConnectionBroker rdcb01.corp.exemple.fr
```

## Sessions

```powershell
Get-RDUserSession -ConnectionBroker rdcb01.corp.exemple.fr | Select-Object UserName, HostServer, SessionState, UnifiedSessionId
Send-RDUserMessage -HostServer rdsh01.corp.exemple.fr -UnifiedSessionID 3 -MessageTitle "Maintenance" -MessageBody "Redémarrage à 20 h, enregistrez vos documents."
Disconnect-RDUser -HostServer rdsh01.corp.exemple.fr -UnifiedSessionID 3 -Force
Invoke-RDUserLogoff -HostServer rdsh01.corp.exemple.fr -UnifiedSessionID 3 -Force
# Mode drain (plus de nouvelles connexions sur un hôte)
Set-RDSessionHost -SessionHost rdsh02.corp.exemple.fr -NewConnectionAllowed NotUntilReboot -ConnectionBroker rdcb01.corp.exemple.fr
# Outils classiques sur un hôte de session
quser /server:rdsh01
qwinsta /server:rdsh01
logoff 3 /server:rdsh01
msg * /server:rdsh01 "Fermeture dans 10 minutes"
mstsc /shadow:3 /v:rdsh01 /control /noConsentPrompt     # prise de contrôle (selon stratégie)
change logon /drain                                        # sur l'hôte lui-même
```

## Client mstsc et fichiers .rdp

```powershell
mstsc /v:srv-app01.corp.exemple.fr /f
mstsc /v:srv-app01 /admin                    # session d'administration
mstsc /v:srv-app01 /restrictedAdmin          # identifiants non transmis au serveur
cmdkey /generic:TERMSRV/srv-app01 /user:CORP\amartin /pass     # mémoriser des identifiants
```

```text
full address:s:rdsh01.corp.exemple.fr
gatewayhostname:s:bureau.exemple.fr
gatewayusagemethod:i:1
gatewaycredentialssource:i:0
prompt for credentials on client:i:1
redirectclipboard:i:1
drivestoredirect:s:
audiomode:i:0
```

## Dépannage

```powershell
Get-WinEvent -LogName "Microsoft-Windows-TerminalServices-LocalSessionManager/Operational" -MaxEvents 20
Get-WinEvent -LogName "Microsoft-Windows-TerminalServices-Gateway/Operational" -MaxEvents 20
Test-NetConnection bureau.exemple.fr -Port 443
Test-NetConnection rdsh01 -Port 3389
```
