---
title: OpenMediaVault — aide-mémoire des commandes
description: Commandes OpenMediaVault avec exemples — omv-upgrade, omv-firstaid, omv-salt deploy, omv-confdbadm, omv-env, état des disques (lsblk, smartctl), RAID (mdadm, /proc/mdstat), systèmes de fichiers montés, Samba et NFS, Docker Compose (extension), journaux.
tags: [aide-mémoire, openmediavault, omv, mdadm, nas]
icon: terminal
---

Référence rapide ; explications dans [[01-presentation-installation|OpenMediaVault]].

```bash
cat /etc/openmediavault/config.xml | head            # base de configuration (ne pas éditer à la main)
sudo omv-upgrade
sudo omv-firstaid
sudo omv-salt deploy run samba nfs ssh               # régénérer les services
sudo omv-salt stage run deploy                       # tout régénérer
sudo omv-confdbadm read conf.service.smb | jq
sudo omv-env list
lsblk -o NAME,SIZE,FSTYPE,MOUNTPOINT,MODEL
sudo smartctl -a /dev/sda | grep -E 'Reallocated|Pending|Temperature'
cat /proc/mdstat ; sudo mdadm --detail /dev/md0
sudo mdadm --manage /dev/md0 --add /dev/sdd          # remplacer un disque (après --fail/--remove de l'ancien)
findmnt -t ext4,xfs,btrfs
testparm -s ; sudo smbstatus ; showmount -e localhost ; exportfs -v
docker compose ls ; docker ps                        # extension Compose
journalctl -u openmediavault-engined -f
```
