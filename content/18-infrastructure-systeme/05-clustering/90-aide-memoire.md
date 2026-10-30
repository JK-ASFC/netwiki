---
title: Clustering (basculement Windows, Pacemaker) — aide-mémoire des commandes
description: Commandes de cluster avec exemples — cluster de basculement Windows (Test-Cluster, New-Cluster, témoin, nœuds, rôles, disques partagés et CSV, mise en pause/drainage, mise à jour adaptée au cluster, journaux Get-ClusterLog) et Pacemaker/Corosync sous Linux (pcs : cluster setup, status, ressources, contraintes, clôture STONITH, mise en veille de nœuds, crm_mon).
tags: [aide-mémoire, cluster, failover cluster, pacemaker, pcs, corosync, csv]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-cluster-basculement|clustering]].

## Cluster de basculement Windows

```powershell
Install-WindowsFeature Failover-Clustering -IncludeManagementTools -ComputerName hv01, hv02
Test-Cluster -Node hv01, hv02 -Include "Inventory", "Network", "Storage", "System Configuration"
New-Cluster -Name CL-HV -Node hv01, hv02 -StaticAddress 10.0.20.50 -NoStorage
Set-ClusterQuorum -FileShareWitness \\nas\temoin-cl-hv                 # ou -CloudWitness -AccountName … -AccessKey …
Get-ClusterQuorum
Get-ClusterNode | Format-Table Name, State, DynamicWeight
Get-ClusterGroup | Format-Table Name, OwnerNode, State
Get-ClusterResource | Format-Table Name, ResourceType, OwnerGroup, State
Get-ClusterNetwork | Format-Table Name, Role, Address
Get-ClusterAvailableDisk | Add-ClusterDisk
Add-ClusterSharedVolume -Name "Cluster Disk 2"
Get-ClusterSharedVolume | Select-Object Name, State, @{n="Chemin";e={$_.SharedVolumeInfo.FriendlyVolumeName}}
Move-ClusterGroup -Name "SQL-AG-Role" -Node hv02
Move-ClusterVirtualMachineRole -Name "srv-web01" -Node hv02 -MigrationType Live
Suspend-ClusterNode -Name hv01 -Drain -Wait          # maintenance
Resume-ClusterNode -Name hv01 -Failback Immediate
Add-ClusterNode -Name hv03 -Cluster CL-HV
Invoke-CauRun -ClusterName CL-HV -MaxFailedNodes 0 -RequireAllNodesOnline -Force     # mise à jour adaptée au cluster
Get-ClusterLog -Destination C:\Temp -TimeSpan 60     # journal des 60 dernières minutes
Get-WinEvent -LogName "Microsoft-Windows-FailoverClustering/Operational" -MaxEvents 20
```

## Pacemaker / Corosync (Linux)

```bash
sudo dnf install pcs pacemaker fence-agents-all     # Debian : apt install pcs pacemaker
sudo passwd hacluster && sudo systemctl enable --now pcsd
sudo pcs host auth noeud1 noeud2 -u hacluster
sudo pcs cluster setup grappe-web noeud1 addr=10.0.30.71 noeud2 addr=10.0.30.72
sudo pcs cluster start --all && sudo pcs cluster enable --all
sudo pcs status
sudo crm_mon -1rf
sudo pcs property set stonith-enabled=true
sudo pcs stonith create clo-ipmi-n1 fence_ipmilan ip=10.0.99.71 username=admin password="$MDP_IPMI" lanplus=1 pcmk_host_list=noeud1
sudo pcs resource create vip ocf:heartbeat:IPaddr2 ip=10.0.30.70 cidr_netmask=24 op monitor interval=10s
sudo pcs resource create web systemd:nginx op monitor interval=20s
sudo pcs constraint colocation add web with vip INFINITY
sudo pcs constraint order vip then web
sudo pcs resource move web noeud2
sudo pcs resource clear web
sudo pcs node standby noeud1 && sudo pcs node unstandby noeud1
sudo pcs resource cleanup web
sudo pcs config | less
sudo corosync-cfgtool -s
sudo corosync-quorumtool -s
```
