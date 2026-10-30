---
title: iSCSI et MPIO — aide-mémoire des commandes
description: Commandes iSCSI et MPIO avec exemples — cible iSCSI Windows (disques virtuels, cibles, initiateurs autorisés, CHAP), initiateur Windows (portails, connexion persistante, MPIO multisession), MPIO (installation, revendication iSCSI, stratégies d'équilibrage, mpclaim), Linux (targetcli, iscsiadm découverte et connexion, multipath -ll).
tags: [aide-mémoire, iscsi, mpio, targetcli, iscsiadm, multipath, san]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-cible-iscsi|iSCSI]].

## Cible iSCSI Windows Server

```powershell
Install-WindowsFeature FS-iSCSITarget-Server -IncludeManagementTools
New-IscsiVirtualDisk -Path "E:\iSCSI\hyperv-lun1.vhdx" -SizeBytes 500GB
New-IscsiServerTarget -TargetName "hyperv" -InitiatorIds "IQN:iqn.1991-05.com.microsoft:hv01.corp.exemple.fr", "IQN:iqn.1991-05.com.microsoft:hv02.corp.exemple.fr"
Add-IscsiVirtualDiskTargetMapping -TargetName "hyperv" -Path "E:\iSCSI\hyperv-lun1.vhdx"
Set-IscsiServerTarget -TargetName "hyperv" -EnableChap $true -Chap (Get-Credential -UserName "chap-hyperv" -Message "Secret CHAP (12 à 16 caractères)")
Get-IscsiServerTarget | Format-Table TargetName, Status, InitiatorIds
```

## Initiateur Windows

```powershell
Start-Service MSiSCSI; Set-Service MSiSCSI -StartupType Automatic
(Get-InitiatorPort).NodeAddress                         # IQN de ce serveur
New-IscsiTargetPortal -TargetPortalAddress 10.10.10.5 -InitiatorPortalAddress 10.10.10.21
New-IscsiTargetPortal -TargetPortalAddress 10.10.20.5 -InitiatorPortalAddress 10.10.20.21
Get-IscsiTarget
Connect-IscsiTarget -NodeAddress "iqn.1991-05.com.microsoft:san01-hyperv-target" -TargetPortalAddress 10.10.10.5 -InitiatorPortalAddress 10.10.10.21 -IsPersistent $true -IsMultipathEnabled $true
Connect-IscsiTarget -NodeAddress "iqn.1991-05.com.microsoft:san01-hyperv-target" -TargetPortalAddress 10.10.20.5 -InitiatorPortalAddress 10.10.20.21 -IsPersistent $true -IsMultipathEnabled $true
Get-IscsiSession | Format-Table TargetNodeAddress, InitiatorPortalAddress, IsConnected
Get-Disk | Where-Object BusType -eq iSCSI
Disconnect-IscsiTarget -NodeAddress "iqn..." -Confirm:$false
```

## MPIO

```powershell
Install-WindowsFeature Multipath-IO
Enable-MSDSMAutomaticClaim -BusType iSCSI              # redémarrage nécessaire
Set-MSDSMGlobalDefaultLoadBalancePolicy -Policy RR     # Round Robin (LQD : moins de file d'attente)
Get-MSDSMGlobalDefaultLoadBalancePolicy
mpclaim -s -d                                          # disques MPIO et stratégie
mpclaim -s -d 1                                        # chemins d'un disque
```

## Linux : cible (targetcli / LIO)

```bash
sudo targetcli
# /> backstores/block create lun1 /dev/vg_san/lv_lun1
# /> iscsi/ create iqn.2026-10.fr.exemple:san01
# /> iscsi/iqn.2026-10.fr.exemple:san01/tpg1/luns create /backstores/block/lun1
# /> iscsi/iqn.2026-10.fr.exemple:san01/tpg1/acls create iqn.1994-05.com.redhat:srv01
# /> saveconfig
sudo targetcli ls
```

## Linux : initiateur

```bash
cat /etc/iscsi/initiatorname.iscsi
sudo iscsiadm -m discovery -t sendtargets -p 10.10.10.5
sudo iscsiadm -m node -T iqn.2026-10.fr.exemple:san01 -p 10.10.10.5 --login
sudo iscsiadm -m node -T iqn.2026-10.fr.exemple:san01 -p 10.10.10.5 -o update -n node.startup -v automatic
sudo iscsiadm -m session -P 3 | less
sudo iscsiadm -m node -T iqn.2026-10.fr.exemple:san01 --logout
# Multipath
sudo apt install multipath-tools && sudo systemctl enable --now multipathd
sudo multipath -ll
sudo multipathd show paths
```
