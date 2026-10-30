---
title: Installation (Linux, macOS, clients Windows)
description: Installer Samba sur Debian/Ubuntu et RHEL (paquets, services, pare-feu, SELinux), vérifier la configuration avec testparm, partage SMB natif de macOS et outils Samba via Homebrew, et accéder aux partages depuis Windows, macOS et Linux (net use, New-SmbMapping, mount_smbfs, mount.cifs).
tags: [samba, installation, selinux, pare-feu, cifs, windows, macos, linux]
icon: download
---

## Debian / Ubuntu

```bash
sudo apt update
sudo apt install samba smbclient cifs-utils
# Membre de domaine AD : + winbind libnss-winbind libpam-winbind krb5-user
sudo systemctl enable --now smbd
sudo systemctl disable --now nmbd       # si NetBIOS n'est pas nécessaire
smbd --version
```

## RHEL / Rocky / Alma

```bash
sudo dnf install samba samba-client cifs-utils
# Membre de domaine AD : + samba-winbind samba-winbind-clients krb5-workstation
sudo systemctl enable --now smb
sudo firewall-cmd --permanent --add-service=samba && sudo firewall-cmd --reload
```

> [!NOTE]
> Les paquets RHEL ne fournissent **pas** le rôle de contrôleur de domaine AD. Pour un DC Samba, utilisez Debian/Ubuntu (ou une distribution qui l'empaquette) — voir [[06-controleur-domaine-ad]].

### SELinux (RHEL)

```bash
sudo mkdir -p /srv/samba/commun
sudo semanage fcontext -a -t samba_share_t "/srv/samba(/.*)?"
sudo restorecon -Rv /srv/samba
sudo setsebool -P samba_enable_home_dirs on       # partages [homes]
# Partager un répertoire déjà utilisé par un autre service : samba_export_all_rw (à éviter si possible)
```

## Pare-feu (nftables)

```bash
sudo nft add rule inet filter input ip saddr 10.0.0.0/8 tcp dport 445 accept
# NetBIOS hérité seulement si nécessaire : tcp 139, udp 137-138
```

## Fichiers et commandes

| Élément | Chemin / commande |
| --- | --- |
| Configuration | `/etc/samba/smb.conf` |
| Bases (utilisateurs, partages, idmap) | `/var/lib/samba/` (`private/` pour les secrets) |
| Journaux | `/var/log/samba/` |
| Vérifier la syntaxe | `testparm` (`testparm -s` : configuration effective sans les valeurs par défaut) |
| Recharger | `sudo smbcontrol all reload-config` (ou `systemctl reload smbd`) |
| Sessions ouvertes | `sudo smbstatus` |

```bash
testparm -s 2>/dev/null | head -30
testparm -sv | grep "server min protocol"        # -v : affiche aussi les valeurs par défaut
```

## macOS

macOS intègre son **propre serveur SMB** (pas Samba) : *Réglages Système → Général → Partage → Partage de fichiers*, ou en ligne de commande :

```bash
sudo sharing -a /Users/Shared/Projets -S Projets       # créer un partage SMB
sharing -l                                             # lister
sudo launchctl enable system/com.apple.smbd && sudo launchctl kickstart -k system/com.apple.smbd
```

Les outils Samba (client `smbclient`, `rpcclient`, `nmblookup`) s'installent avec Homebrew : `brew install samba`. Un serveur Samba complet sous macOS est possible mais rarement pertinent.

## Accéder aux partages

### Windows

```powershell
net use Z: \\fs01.corp.exemple.fr\commun /persistent:yes
New-SmbMapping -LocalPath Z: -RemotePath \\fs01\commun -Persistent $true
Get-SmbConnection | Format-Table ServerName, ShareName, UserName, Dialect, Signed, Encrypted
net use Z: /delete
```

### macOS

```bash
open smb://fs01.corp.exemple.fr/commun                  # Finder (Cmd+K)
mkdir -p ~/commun && mount_smbfs //alice@fs01.corp.exemple.fr/commun ~/commun
smbutil statshares -a                                   # version SMB, signature, chiffrement
```

### Linux

```bash
smbclient -L //fs01 -U alice                            # lister les partages
smbclient //fs01/commun -U alice -c 'ls'
sudo mount -t cifs //fs01/commun /mnt/commun -o username=alice,uid=$(id -u),gid=$(id -g),vers=3.1.1
```

```text /etc/fstab
//fs01.corp.exemple.fr/commun  /mnt/commun  cifs  credentials=/root/.smb-commun,vers=3.1.1,seal,_netdev,uid=1000,gid=1000,nofail,x-systemd.automount  0 0
```

```ini /root/.smb-commun (chmod 600)
username=svc_commun
password=MotDePasse
domain=CORP
```

Avec Kerberos (poste joint au domaine) : option `sec=krb5` et paquet `keyutils`, sans fichier de mot de passe.
