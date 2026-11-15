---
title: NPS (serveur RADIUS Windows) — aide-mémoire des commandes
description: Référence complète des commandes NPS (serveur RADIUS Windows) avec exemples — installation et inscription dans AD, clients RADIUS, export, import et consultation de la configuration, audit (sous-catégorie par GUID, indépendante de la langue), événements 6272 à 6274 et codes de raison, journaux de comptabilité, ports et service, certificats PEAP et EAP-TLS, extension MFA Entra ID et tests depuis les équipements.
tags: [aide-mémoire, nps, radius, windows server, 802.1x, netsh]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-installation|NPS]].

## Installation et enregistrement

```powershell
Install-WindowsFeature NPAS -IncludeManagementTools
netsh nps add registeredserver                        # inscrit le serveur dans « Serveurs RAS et IAS » (droit de lire les propriétés de numérotation)
netsh ras add registeredserver domain=corp.exemple.fr server=nps01
Get-Service IAS | Restart-Service
```

## Clients RADIUS

```powershell
New-NpsRadiusClient -Name "sw-paris" -Address "10.0.99.0/24" -SharedSecret "Sx9vT2qL7mWp4KzB8nRc"
New-NpsRadiusClient -Name "wlc-paris" -Address 10.0.99.20 -SharedSecret "Rm3kW8vP2qZt6XcL9bNd" -VendorName "Cisco"
Get-NpsRadiusClient | Format-Table Name, Address, Enabled
Set-NpsRadiusClient -Name "sw-paris" -SharedSecret "NouveauSecretPartage2026"
Remove-NpsRadiusClient -Name "ancien-switch"
```

## Configuration : export, import, consultation

```powershell
Export-NpsConfiguration -Path C:\Temp\nps-config.xml
Import-NpsConfiguration -Path C:\Temp\nps-config.xml           # sur le second serveur NPS (synchronisation)
netsh nps show config
netsh nps show np                                               # stratégies réseau
netsh nps show crp                                              # stratégies de demande de connexion
netsh nps export filename="C:\Temp\nps.xml" exportPSK=YES
```

Les stratégies réseau (conditions : groupe Windows, type de port NAS, type d'authentification ; paramètres : VLAN via `Tunnel-Type`, `Tunnel-Medium-Type`, `Tunnel-Pvt-Group-ID`) se créent dans la console `nps.msc`.

## Journalisation et audit

```powershell
# Activer l'audit des événements NPS (6272 accordé, 6273 refusé)
auditpol /set /subcategory:"{0CCE9243-69AE-11D9-BED3-505054503030}" /success:enable /failure:enable   # « Serveur NPS » : GUID valable quelle que soit la langue
Get-WinEvent -FilterHashtable @{LogName="Security"; Id=6273} -MaxEvents 10 | Format-List TimeCreated, Message
Get-WinEvent -FilterHashtable @{LogName="Security"; Id=6272} -MaxEvents 10 | Select-Object TimeCreated
# Fichiers journaux comptabilité (format DTS/IAS)
Get-ChildItem "$env:SystemRoot\System32\LogFiles\IN*.log" | Sort-Object LastWriteTime | Select-Object -Last 1 | Get-Content -Tail 5
```

| Raison (événement 6273) | Signification |
| --- | --- |
| Code 16 | Identifiants incorrects |
| Code 48 | Aucune stratégie réseau ne correspond |
| Code 49 | Aucune stratégie de demande de connexion ne correspond |
| Code 65 | Accès réseau refusé dans les propriétés de numérotation du compte |
| Code 22 | Le client n'a pas pu être authentifié (type EAP non pris en charge) |
| Code 265 | Certificat du client non approuvé (EAP-TLS) |
| Code 8 | Compte utilisateur inexistant |
| Code 23 | Erreur pendant le traitement EAP (certificat du serveur, chaîne) |
| Code 66 | Méthode d'authentification non autorisée par la stratégie réseau |

## Certificats (PEAP / EAP-TLS)

```powershell
Get-ChildItem Cert:\LocalMachine\My | Where-Object { $_.EnhancedKeyUsageList.FriendlyName -contains "Authentification du serveur" -or $_.EnhancedKeyUsageList.FriendlyName -contains "Server Authentication" } | Select-Object Subject, NotAfter, Thumbprint
certreq -enroll -machine -q "RASAndIASServer"     # demander un certificat au modèle « Serveurs RAS et IAS » (AD CS)
```

## Extension MFA (Entra ID)

```powershell
# Après installation de « NPS Extension for Microsoft Entra multifactor authentication »
cd "C:\Program Files\Microsoft\AzureMfa\Config"
.\AzureMfaNpsExtnConfigSetup.ps1
Get-WinEvent -LogName "AuthNOptCh" -MaxEvents 10 -ErrorAction SilentlyContinue
```

## Tests

- Depuis un équipement : `test aaa group radius amartin MotDePasse new-code` (Cisco IOS), `diagnose test authserver radius NPS pap amartin MotDePasse` (FortiGate).
- Depuis Linux : `radtest` / `eapol_test` (voir [[01-freeradius/90-aide-memoire|FreeRADIUS]]).

## Service, ports, événements

```powershell
Get-Service IAS | Select-Object Name, Status, StartType
Get-NetUDPEndpoint -LocalPort 1812, 1813 | Select-Object LocalAddress, LocalPort
# Accordé (6272), refusé (6273), rejeté par le serveur (6274) sur la dernière heure
Get-WinEvent -FilterHashtable @{LogName='Security'; Id=6272,6273,6274; StartTime=(Get-Date).AddHours(-1)} | Group-Object Id | Select-Object Name, Count
Get-WinEvent -FilterHashtable @{LogName='Security'; Id=6273} -MaxEvents 5 | ForEach-Object { $_.Message -split "`n" | Select-String -Pattern "Nom du compte|Account Name|Adresse IP du client|Client IP|Code de la raison|Reason Code" }
Get-WinEvent -LogName "System" -MaxEvents 50 | Where-Object ProviderName -eq "NPS"
certutil -verifystore My
```
