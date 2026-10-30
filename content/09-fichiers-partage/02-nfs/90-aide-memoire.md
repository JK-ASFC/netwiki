---
title: NFS — aide-mémoire des commandes
description: Commandes NFS avec exemples — serveur (exports, exportfs -ra/-v/-u, options rw, root_squash, sec=krb5p), service nfs-server, versions, montage client (mount -t nfs, options vers, hard, nconnect, fstab, autofs), diagnostic (showmount, rpcinfo, nfsstat, nfsiostat, mountstats), NFS sous Windows (client et serveur).
tags: [aide-mémoire, nfs, exportfs, mount, autofs, nfsstat]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation|NFS]].

## Serveur

```bash
sudo apt install nfs-kernel-server             # RHEL : nfs-utils
```

```text
# /etc/exports
/srv/nfs/projets   10.0.30.0/24(rw,sync,root_squash,no_subtree_check)
/srv/nfs/iso       10.0.0.0/8(ro,all_squash,no_subtree_check)
/srv/nfs/securise  *.corp.exemple.fr(rw,sync,sec=krb5p)
```

```bash
sudo exportfs -ra                  # appliquer /etc/exports
sudo exportfs -v                   # exports actifs et options effectives
sudo exportfs -u 10.0.30.0/24:/srv/nfs/projets     # retirer un export à chaud
sudo systemctl restart nfs-server
sudo cat /proc/fs/nfsd/versions     # versions activées (+4.2 …)
```

```ini
# /etc/nfs.conf — NFSv4 uniquement
[nfsd]
vers3=n
vers4.0=n
```

## Client

```bash
sudo apt install nfs-common
showmount -e nas.exemple.fr        # NFSv3 uniquement
sudo mount -t nfs -o vers=4.2,hard,nconnect=4 nas.exemple.fr:/srv/nfs/projets /mnt/projets
sudo mount -t nfs -o vers=4.2,sec=krb5p nas.corp.exemple.fr:/srv/nfs/securise /mnt/securise
mount | grep nfs
sudo umount /mnt/projets
sudo umount -l /mnt/projets        # démontage « paresseux » si le serveur ne répond plus
```

```text
# /etc/fstab
nas.exemple.fr:/srv/nfs/projets  /mnt/projets  nfs  vers=4.2,hard,_netdev,noatime,x-systemd.automount  0 0
```

```text
# autofs : /etc/auto.master
/mnt/nfs  /etc/auto.nfs  --timeout=300
# /etc/auto.nfs
projets  -fstype=nfs4,hard  nas.exemple.fr:/srv/nfs/projets
```

## Diagnostic

```bash
rpcinfo -p nas.exemple.fr
nfsstat -s                         # statistiques serveur
nfsstat -c                         # statistiques client
nfsstat -m                         # montages et options négociées
nfsiostat 5                        # débits et latences par montage
cat /proc/self/mountstats | less
sudo tcpdump -ni eth0 port 2049
```

## Windows

```powershell
# Client NFS (éditions Pro/Entreprise/Serveur)
Enable-WindowsOptionalFeature -Online -FeatureName ServicesForNFS-ClientOnly, ClientForNFS-Infrastructure -All
mount -o anon \\nas.exemple.fr\srv\nfs\iso N:
# Serveur NFS sous Windows Server
Install-WindowsFeature FS-NFS-Service -IncludeManagementTools
New-NfsShare -Name iso -Path D:\ISO -Permission readonly -AllowRootAccess $false
Grant-NfsSharePermission -Name iso -ClientName 10.0.30.0/24 -ClientType host -Permission readonly
Get-NfsShare
```
