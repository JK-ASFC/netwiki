---
title: Installation (Linux, Windows, macOS)
description: Installer un serveur et un client NFS sous Debian/Ubuntu et RHEL (nfs.conf, versions activées, threads, ports fixes pour NFSv3, pare-feu, SELinux), le rôle Serveur pour NFS et le Client pour NFS de Windows (New-NfsShare, mount, AnonymousUid), et le serveur/client NFS intégré à macOS.
tags: [nfs, installation, nfs.conf, pare-feu, windows, macos, nfsd, rpcbind]
icon: download
---

## Linux : serveur

```bash
# Debian / Ubuntu
sudo apt install nfs-kernel-server
# RHEL / Rocky / Alma
sudo dnf install nfs-utils

sudo systemctl enable --now nfs-server
cat /proc/fs/nfsd/versions              # ex. -2 +3 +4 +4.1 +4.2
```

### /etc/nfs.conf

```nfsconf /etc/nfs.conf.d/local.conf
[nfsd]
threads = 16                 # défaut 8 ; augmenter pour de nombreux clients
vers3 = y                    # « n » pour un serveur NFSv4 uniquement
vers4.0 = n                  # imposer 4.1/4.2
vers4.1 = y
vers4.2 = y
# lease-time = 90
# grace-time = 90

# Ports fixes pour NFSv3 (pare-feu)
[mountd]
port = 20048

[statd]
port = 32765
outgoing-port = 32766

[lockd]
port = 32803
udp-port = 32769
```

```bash
sudo systemctl restart nfs-server rpc-statd
rpcinfo -p localhost
```

### Serveur NFSv4 uniquement

Avec `vers3 = n`, rpcbind, mountd et statd ne sont plus nécessaires côté réseau : seul **TCP 2049** est ouvert.

```bash
sudo systemctl mask --now rpcbind.service rpcbind.socket rpc-statd.service    # facultatif, si aucun client v3
```

### Pare-feu

```bash
# firewalld
sudo firewall-cmd --permanent --add-service=nfs                      # v4
sudo firewall-cmd --permanent --add-service={rpc-bind,mountd}        # + v3
sudo firewall-cmd --permanent --add-port={32765-32766/tcp,32803/tcp,32769/udp}
sudo firewall-cmd --reload
# nftables
sudo nft add rule inet filter input ip saddr 10.0.0.0/8 tcp dport 2049 accept
```

### SELinux

Les exports fonctionnent avec les contextes par défaut ; pour des répertoires partagés à la fois par NFS et d'autres services, utilisez le contexte `public_content_rw_t` ou les booléens `nfs_export_all_rw` / `nfs_export_all_ro` (activés par défaut). Côté client, `use_nfs_home_dirs` autorise les dossiers personnels sur NFS.

## Linux : client

```bash
sudo apt install nfs-common        # Debian / Ubuntu
sudo dnf install nfs-utils         # RHEL
showmount -e nfs01                 # NFSv3 uniquement (mountd)
sudo mount -t nfs4 nfs01:/srv/nfs/projets /mnt/projets
```

## Windows Server : serveur NFS

```powershell
Install-WindowsFeature FS-NFS-Service -IncludeManagementTools
New-NfsShare -Name projets -Path D:\NFS\Projets `
    -Authentication sys -EnableUnmappedAccess $true -AllowRootAccess $false `
    -Permission readwrite
Grant-NfsSharePermission -Name projets -ClientName srv-app01.corp.exemple.fr -ClientType host -Permission readwrite
Grant-NfsSharePermission -Name projets -ClientName "ALL MACHINES" -ClientType builtin -Permission no-access
Get-NfsShare ; Get-NfsSharePermission -Name projets
Set-NfsServerConfiguration -EnableNFSV4 $true
```

| Mappage d'identités | Principe |
| --- | --- |
| Active Directory | Attributs `uidNumber` / `gidNumber` des comptes AD (`Set-NfsMappingStore -EnableADLookup $true`) |
| Fichiers passwd/group | `C:\Windows\System32\drivers\etc\passwd` et `group` |
| Accès non mappé | Les UID inconnus accèdent comme utilisateur anonyme (`-EnableUnmappedAccess`) |

## Windows : client NFS (v3)

```powershell
# Windows 10/11 Pro/Entreprise
Enable-WindowsOptionalFeature -Online -FeatureName ServicesForNFS-ClientOnly, ClientForNFS-Infrastructure -All
# Windows Server
Install-WindowsFeature NFS-Client

mount -o anon,nolock,mtype=hard \\nfs01\srv\nfs\projets Z:
mount                                   # afficher les montages et leurs options (UID/GID utilisés)
umount Z:
```

Le client Windows ne parle que **NFSv3** : le serveur doit garder v3 activé. Sans mappage, il utilise l'UID/GID anonyme `-2` ; on le fixe par le registre :

```powershell
$k = 'HKLM:\SOFTWARE\Microsoft\ClientForNFS\CurrentVersion\Default'
New-ItemProperty -Path $k -Name AnonymousUid -Value 1500 -PropertyType DWord -Force
New-ItemProperty -Path $k -Name AnonymousGid -Value 1500 -PropertyType DWord -Force
Restart-Service NfsClnt
```

## macOS

### Serveur (nfsd intégré, NFSv3)

```text /etc/exports (macOS, syntaxe BSD)
/Users/Shared/Projets -network 10.0.20.0 -mask 255.255.255.0 -mapall=501:20
/Volumes/Data/ISO -ro -alldirs 10.0.20.15 10.0.20.16
```

```bash
sudo nfsd checkexports
sudo nfsd enable && sudo nfsd restart
showmount -e localhost
```

> [!NOTE]
> Sur les versions récentes de macOS, `nfsd` doit avoir l'**accès complet au disque** (Réglages → Confidentialité et sécurité) pour exporter des dossiers protégés.

### Client

```bash
sudo mount -t nfs -o resvport,vers=4,rw nfs01:/srv/nfs/projets /private/nfs/projets
# Finder : Cmd+K → nfs://nfs01/srv/nfs/projets
```

L'option `resvport` (port source < 1024) est nécessaire face aux serveurs Linux qui exigent `secure` (par défaut).
