---
title: Hyper-V — aide-mémoire des commandes
description: Commandes Hyper-V avec exemples — installation, commutateurs virtuels (externe, interne, privé, SET), machines virtuelles (création génération 2, processeurs, mémoire dynamique, disques VHDX, démarrage sécurisé, vTPM), réseau (VLAN, MAC spoofing), points de contrôle, exportation/importation, migration dynamique et du stockage, réplication Hyper-V, PowerShell Direct, ressources et dépannage.
tags: [aide-mémoire, hyper-v, powershell, machines virtuelles, vhdx, réplication]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-installation|Hyper-V]].

## Installation et hôte

```powershell
Install-WindowsFeature Hyper-V -IncludeManagementTools -Restart                         # Windows Server
Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V -All              # Windows 10/11 Pro
Get-VMHost | Select-Object VirtualMachinePath, VirtualHardDiskPath, LogicalProcessorCount
Set-VMHost -VirtualMachinePath "D:\Hyper-V" -VirtualHardDiskPath "D:\Hyper-V\Disques"
```

## Commutateurs virtuels

```powershell
New-VMSwitch -Name "Externe" -NetAdapterName "Ethernet 2" -AllowManagementOS $true
New-VMSwitch -Name "Interne" -SwitchType Internal
New-VMSwitch -Name "Labo-prive" -SwitchType Private
New-VMSwitch -Name "SET-Prod" -NetAdapterName "NIC1", "NIC2" -EnableEmbeddedTeaming $true -AllowManagementOS $false
Get-VMSwitch
```

## Machines virtuelles

```powershell
New-VM -Name "srv-web01" -Generation 2 -MemoryStartupBytes 4GB -NewVHDPath "D:\Hyper-V\Disques\srv-web01.vhdx" -NewVHDSizeBytes 80GB -SwitchName "Externe"
Set-VM -Name "srv-web01" -ProcessorCount 4 -DynamicMemory -MemoryMinimumBytes 2GB -MemoryMaximumBytes 8GB -AutomaticStartAction Start -AutomaticStopAction ShutDown
Set-VMFirmware -VMName "srv-web01" -EnableSecureBoot On -SecureBootTemplate "MicrosoftUEFICertificateAuthority"    # Linux
Add-VMDvdDrive -VMName "srv-web01" -Path "D:\ISO\debian-12.iso"
Set-VMFirmware -VMName "srv-web01" -FirstBootDevice (Get-VMDvdDrive -VMName "srv-web01")
Set-VMKeyProtector -VMName "srv-web01" -NewLocalKeyProtector; Enable-VMTPM -VMName "srv-web01"
Start-VM -Name "srv-web01"
vmconnect.exe localhost "srv-web01"
Get-VM | Format-Table Name, State, CPUUsage, MemoryAssigned, Uptime, Status
Stop-VM -Name "srv-web01"                  # arrêt propre (services d'intégration)
Stop-VM -Name "srv-web01" -TurnOff         # coupure
Remove-VM -Name "ancienne" -Force
```

## Disques

```powershell
New-VHD -Path "D:\Hyper-V\Disques\donnees.vhdx" -SizeBytes 200GB -Dynamic
Add-VMHardDiskDrive -VMName "srv-web01" -Path "D:\Hyper-V\Disques\donnees.vhdx"
Resize-VHD -Path "D:\Hyper-V\Disques\donnees.vhdx" -SizeBytes 300GB      # à chaud sur SCSI (génération 2)
Optimize-VHD -Path "D:\Hyper-V\Disques\donnees.vhdx" -Mode Full          # VM arrêtée
Get-VHD -Path "D:\Hyper-V\Disques\srv-web01.vhdx"
Convert-VHD -Path ancien.vhd -DestinationPath nouveau.vhdx
```

## Réseau

```powershell
Set-VMNetworkAdapterVlan -VMName "srv-web01" -Access -VlanId 30
Set-VMNetworkAdapterVlan -VMName "routeur-virtuel" -Trunk -AllowedVlanIdList "10,20,30" -NativeVlanId 0
Set-VMNetworkAdapter -VMName "routeur-virtuel" -MacAddressSpoofing On
Get-VMNetworkAdapter -VMName "srv-web01" | Select-Object Name, SwitchName, MacAddress, IPAddresses
```

## Points de contrôle, export, migration

```powershell
Checkpoint-VM -Name "srv-web01" -SnapshotName "Avant mise à jour"
Get-VMSnapshot -VMName "srv-web01"
Restore-VMSnapshot -VMName "srv-web01" -Name "Avant mise à jour" -Confirm:$false
Remove-VMSnapshot -VMName "srv-web01" -Name "Avant mise à jour"
Export-VM -Name "srv-web01" -Path "E:\Exports"
Import-VM -Path "E:\Exports\srv-web01\Virtual Machines\<GUID>.vmcx" -Copy -GenerateNewId
Enable-VMMigration; Set-VMHost -VirtualMachineMigrationAuthenticationType Kerberos
Move-VM -Name "srv-web01" -DestinationHost hv02 -IncludeStorage -DestinationStoragePath "D:\Hyper-V\srv-web01"
Move-VMStorage -VMName "srv-web01" -DestinationStoragePath "E:\Hyper-V\srv-web01"
```

## Réplication

```powershell
Set-VMReplicationServer -ReplicationEnabled $true -AllowedAuthenticationType Kerberos -ReplicationAllowedFromAnyServer $true -DefaultStorageLocation "D:\Replicas"    # sur le serveur réplica
Enable-VMReplication -VMName "srv-web01" -ReplicaServerName hv-pra -ReplicaServerPort 80 -AuthenticationType Kerberos -ReplicationFrequencySec 300
Start-VMInitialReplication -VMName "srv-web01"
Measure-VMReplication | Format-Table VMName, State, Health, LReplTime
Start-VMFailover -VMName "srv-web01" -Prepared      # bascule planifiée (sur le principal, VM arrêtée)
```

## PowerShell Direct et dépannage

```powershell
Enter-PSSession -VMName "srv-web01" -Credential (Get-Credential)        # sans réseau, depuis l'hôte
Invoke-Command -VMName "srv-web01" -ScriptBlock { ipconfig } -Credential (Get-Credential)
Get-VMIntegrationService -VMName "srv-web01"
Get-WinEvent -LogName "Microsoft-Windows-Hyper-V-VMMS-Admin" -MaxEvents 20
```
