---
title: WDS — aide-mémoire des commandes
description: Commandes des Services de déploiement Windows avec exemples — installation et initialisation (wdsutil /initialize-server), réponse PXE, images de démarrage et d'installation (Import-WdsBootImage, Import-WdsInstallImage), groupes d'images, pré-approvisionnement, multidiffusion, pilotes, options DHCP 60/66/67, journalisation et dépannage, alternatives (MDT, Configuration Manager, iPXE).
tags: [aide-mémoire, wds, wdsutil, pxe, déploiement, windows]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-installation|WDS]].

## Installation et initialisation

```powershell
Install-WindowsFeature WDS -IncludeManagementTools
wdsutil /initialize-server /reminst:"D:\RemoteInstall"
wdsutil /set-server /answerclients:all            # répondre à tous les clients PXE (ou Known)
wdsutil /set-server /pxepromptpolicy /known:optin /new:optin
wdsutil /get-server /show:config
# WDS sur le même serveur que le DHCP Microsoft
wdsutil /set-server /usedhcpports:no /dhcpoption60:yes
```

## Images

```powershell
Import-WdsBootImage -Path "E:\sources\boot.wim" -NewImageName "WinPE Windows 11 x64"
Get-WindowsImage -ImagePath "E:\sources\install.wim" | Select-Object ImageIndex, ImageName
New-WdsInstallImageGroup -Name "Windows 11"
Import-WdsInstallImage -Path "E:\sources\install.wim" -ImageGroup "Windows 11" -ImageName "Windows 11 Pro"
Get-WdsBootImage | Select-Object ImageName, Architecture, Enabled
Get-WdsInstallImage | Select-Object ImageName, ImageGroup, Version
Disable-WdsBootImage -ImageName "WinPE Windows 10 x64" -Architecture X64
Remove-WdsInstallImage -ImageGroup "Windows 10" -ImageName "Windows 10 Pro"
# Fichier de réponses sans assistance pour une image
wdsutil /set-installimage /image:"Windows 11 Pro" /imagetype:install /imagegroup:"Windows 11" /unattendfile:"D:\RemoteInstall\WdsClientUnattend\autounattend.xml"
```

## Pilotes et pré-approvisionnement

```powershell
Import-WdsDriverPackage -Path "D:\Pilotes\Reseau\e1d.inf" -GroupName "Réseau"
Get-WdsDriverPackage
# Ajouter un groupe de pilotes à une image de démarrage
wdsutil /add-imagedriverpackages /image:"WinPE Windows 11 x64" /architecture:x64 /drivergroup:"Réseau"
New-WdsClient -DeviceID "00155D010203" -DeviceName "PC-PARIS-042" -JoinDomain $true -Domain corp.exemple.fr -Group "Windows 11"
Get-WdsClient
```

## Multidiffusion

```powershell
wdsutil /new-multicasttransmission /friendlyname:"Win11 Pro" /image:"Windows 11 Pro" /imagetype:install /imagegroup:"Windows 11" /transmissiontype:autocast
wdsutil /get-allmulticasttransmissions
```

## DHCP et réseau

```powershell
# Sous-réseau distant : relais DHCP (ip helper-address) vers le DHCP et le WDS ; sinon options 66/67
Set-DhcpServerv4OptionValue -ScopeId 10.0.20.0 -OptionId 66 -Value "wds01.corp.exemple.fr"
Set-DhcpServerv4OptionValue -ScopeId 10.0.20.0 -OptionId 67 -Value "boot\x64\wdsmgfw.efi"     # UEFI
```

## Journaux et dépannage

```powershell
Get-WinEvent -LogName "Microsoft-Windows-Deployment-Services-Diagnostics/Operational" -MaxEvents 30
Get-Service WDSServer | Restart-Service
```

> [!NOTE]
> Microsoft a déprécié certains scénarios WDS (installation de Windows 11 directement par l'image `boot.wim` du support) : WDS reste utilisé comme serveur PXE pour **MDT**, **Configuration Manager** ou des images WinPE personnalisées.
