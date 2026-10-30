---
title: RRAS (Routage et accès distant) — aide-mémoire des commandes
description: Commandes RRAS avec exemples — installation du rôle Remote Access, VPN (Install-RemoteAccess, SSTP, IKEv2, L2TP), plages d'adresses, authentification RADIUS, état des connexions (Get-RemoteAccessConnectionStatistics), Always On VPN (profils, vérifications côté client), routage et NAT (netsh routing), VPN site à site (Add-VpnS2SInterface), DirectAccess hérité, journaux et diagnostic.
tags: [aide-mémoire, rras, remote access, vpn, always on vpn, sstp, ikev2]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-vpn|RRAS]].

## Installation et VPN

```powershell
Install-WindowsFeature RemoteAccess, DirectAccess-VPN, Routing -IncludeManagementTools
Install-RemoteAccess -VpnType Vpn
Get-RemoteAccess
Set-VpnAuthProtocol -UserAuthProtocolAccepted EAP, Certificate -RootCertificateNameToAccept (Get-ChildItem Cert:\LocalMachine\Root | Where-Object Subject -like "*AC Interne*")
Set-VpnIPAddressAssignment -IPAssignmentMethod StaticPool -IPAddressRange 10.10.0.10,10.10.0.250
Add-RemoteAccessRadius -ServerName nps01.corp.exemple.fr -SharedSecret "Sx9vT2qL7mWp4KzB8nRc" -Purpose Authentication -Timeout 5 -Score 30
Get-RemoteAccessRadius
Set-VpnServerConfiguration -CustomPolicy -EncryptionMethod AES256 -IntegrityCheckMethod SHA256 -DHGroup ECP384 -CipherTransformConstants GCMAES256 -AuthenticationTransformConstants GCMAES256 -PfsGroup ECP384
Get-VpnServerConfiguration
Restart-Service RemoteAccess
```

## Connexions et statistiques

```powershell
Get-RemoteAccessConnectionStatistics | Select-Object UserName, ClientIPAddress, ConnectionDuration, TunnelType
Get-RemoteAccessConnectionStatisticsSummary
Disconnect-VpnUser -UserName "CORP\amartin"
Get-RemoteAccessHealth | Where-Object HealthState -ne "OK"
```

## Site à site

```powershell
Add-VpnS2SInterface -Name "Lyon" -Destination 198.51.100.20 -Protocol IKEv2 -AuthenticationMethod PSKOnly -SharedSecret "CleLongueEtAleatoire2026" -IPv4Subnet "10.60.0.0/16:100" -Persistent
Connect-VpnS2SInterface -Name "Lyon"
Get-VpnS2SInterface | Select-Object Name, ConnectionState, Destination
```

## Routage et NAT (netsh)

```powershell
netsh routing ip show interface
netsh routing ip nat show interface
netsh routing ip nat add interface "Ethernet externe" full
netsh routing ip nat add interface "Ethernet interne" private
route print
New-NetRoute -DestinationPrefix 10.60.0.0/16 -InterfaceAlias "Lyon" -RouteMetric 10
```

## Always On VPN (côté client)

```powershell
Get-VpnConnection -AllUserConnection | Select-Object Name, ServerAddress, TunnelType, ConnectionStatus
rasdial "VPN Entreprise"
rasdial "VPN Entreprise" /disconnect
Get-VpnConnection -Name "VPN Entreprise" -AllUserConnection | Select-Object -ExpandProperty Routes
Get-WinEvent -LogName Application -MaxEvents 30 | Where-Object ProviderName -eq "RasClient" | Format-Table TimeCreated, Id, Message -Wrap
```

## Journaux

```powershell
netsh ras set tracing * enabled          # traces détaillées dans %windir%\tracing (temporaire)
netsh ras set tracing * disabled
Get-WinEvent -LogName System -MaxEvents 50 | Where-Object ProviderName -like "RemoteAccess*"
```
