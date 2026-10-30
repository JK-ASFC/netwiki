---
title: VMware Workstation / Fusion — aide-mémoire des commandes
description: Commandes VMware Workstation Pro et Fusion avec exemples — vmrun (start, stop, suspend, list, snapshot, revertToSnapshot, clone, runProgramInGuest, copyFileFromHostToGuest, getGuestIPAddress), vmware-vdiskmanager (création, extension, défragmentation, conversion), ovftool (export, import, conversion OVA), réseaux virtuels (vmnetcfg, vmnet), API REST vmrest.
tags: [aide-mémoire, vmware workstation, fusion, vmrun, ovftool, vdiskmanager]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-installation-utilisation|VMware Workstation]]. Sous Windows, les outils sont dans `C:\Program Files (x86)\VMware\VMware Workstation` ; sous macOS (Fusion), dans `/Applications/VMware Fusion.app/Contents/Library`.

## vmrun

```powershell
$vmx = "D:\VMs\labo-debian\labo-debian.vmx"
vmrun -T ws list
vmrun -T ws start $vmx nogui
vmrun -T ws stop $vmx soft
vmrun -T ws suspend $vmx
vmrun -T ws reset $vmx soft
vmrun -T ws snapshot $vmx "propre"
vmrun -T ws listSnapshots $vmx
vmrun -T ws revertToSnapshot $vmx "propre"
vmrun -T ws deleteSnapshot $vmx "propre"
vmrun -T ws clone $vmx "D:\VMs\labo-2\labo-2.vmx" linked -snapshot="propre" -cloneName="labo-2"
vmrun -T ws getGuestIPAddress $vmx -wait
vmrun -T ws -gu admin -gp $env:MDP runProgramInGuest $vmx /usr/bin/systemctl restart nginx
vmrun -T ws -gu admin -gp $env:MDP copyFileFromHostToGuest $vmx C:\Temp\script.sh /tmp/script.sh
```

(Avec Fusion : `-T fusion`.)

## Disques virtuels

```powershell
vmware-vdiskmanager -c -s 40GB -a lsilogic -t 1 D:\VMs\disques\donnees.vmdk     # disque extensible découpé en 2 Go
vmware-vdiskmanager -x 80GB D:\VMs\disques\donnees.vmdk                          # agrandir (VM arrêtée, sans instantané)
vmware-vdiskmanager -d D:\VMs\disques\donnees.vmdk                               # défragmenter
vmware-vdiskmanager -k D:\VMs\disques\donnees.vmdk                               # réduire
vmware-vdiskmanager -r source.vmdk -t 0 destination-monolithique.vmdk            # convertir
```

## ovftool

```powershell
ovftool D:\VMs\labo-debian\labo-debian.vmx D:\Export\labo-debian.ova
ovftool --acceptAllEulas D:\Export\appliance.ova D:\VMs\appliance\
ovftool D:\Export\labo-debian.ova "vi://admin@vcenter.exemple.fr/Paris/host/Cluster01"     # vers vSphere
```

## Réseaux virtuels

```powershell
& "C:\Program Files (x86)\VMware\VMware Workstation\vmnetcfg.exe"     # éditeur des réseaux virtuels (vmnet0 pont, vmnet1 hôte, vmnet8 NAT)
Get-NetAdapter | Where-Object InterfaceDescription -like "*VMware*"
```

## API REST (vmrest)

```powershell
vmrest -C                     # définir l'identifiant et le mot de passe de l'API
vmrest                        # démarre le service sur http://127.0.0.1:8697
$h = @{ Authorization = "Basic " + [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("admin:$env:MDP")) }
Invoke-RestMethod http://127.0.0.1:8697/api/vms -Headers $h
```
