---
title: Présentation, installation et configuration
description: OpenMediaVault (OMV) — NAS léger sur Debian (OMV 7 Sandworm sur Debian 12, OMV 8 sur Debian 13), matériel minimal (Raspberry Pi, petits serveurs), installation par ISO ou sur Debian existante (script), première connexion, disques, RAID logiciel mdadm, systèmes de fichiers (ext4, XFS, Btrfs), dossiers partagés, SMB et NFS, utilisateurs et quotas, extensions omv-extras (Compose, ZFS, MergerFS, SnapRAID), sauvegardes, mises à jour et dépannage (omv-firstaid, omv-salt).
tags: [openmediavault, omv, nas, debian, smb, nfs, mdadm, omv-extras]
icon: info
---

**OpenMediaVault** (GPL) transforme une Debian en **NAS administrable par le web**, avec très peu de ressources : il fonctionne sur un Raspberry Pi 4/5 comme sur un serveur. Moins orienté entreprise que [[21-truenas-scale/01-presentation-installation|TrueNAS]] (pas de ZFS natif sans extension, pas de haute disponibilité), mais très simple et extensible.

| Version | Base |
| --- | --- |
| OMV 7 *Sandworm* | Debian 12 |
| OMV 8 | Debian 13 |

## Installation

**ISO** (`openmediavault.org`) sur un petit SSD dédié au système, ou **sur une Debian minimale existante** (seule méthode sur Raspberry Pi OS Lite 64 bits) :

```bash
sudo apt update && sudo apt full-upgrade -y
wget -O - https://github.com/OpenMediaVault-Plugin-Developers/installScript/raw/master/install | sudo bash
```

Le script installe OMV et **omv-extras** puis configure le réseau ; l'interface est ensuite sur `http://<ip>` (compte **admin**, mot de passe `openmediavault` : à changer immédiatement).

## Mise en service

1. *Système → Paramètres généraux* : port HTTPS, délai d'expiration ; *Certificats* pour TLS.
2. *Stockage → Disques* : effacer les disques destinés aux données.
3. *Stockage → RAID logiciel* (mdadm) : RAID1/5/6/10 si besoin — ou disques indépendants avec MergerFS + SnapRAID (extension) pour des disques hétérogènes.
4. *Stockage → Systèmes de fichiers* : créer (ext4, XFS, Btrfs) et **monter**.
5. *Stockage → Dossiers partagés* : dossier, système de fichiers, permissions.
6. *Services → SMB/CIFS* : activer, ajouter les partages (corbeille, versions précédentes avec Btrfs) ; *Services → NFS* : partages et clients autorisés.
7. *Utilisateurs* : comptes locaux, groupes, quotas ; *Paramètres* → service d'annuaire LDAP si besoin.

Chaque modification doit être **appliquée** (bandeau jaune *Appliquer*) : OMV génère alors la configuration avec Salt.

## Extensions (omv-extras)

| Extension | Usage |
| --- | --- |
| **openmediavault-compose** | Conteneurs Docker par fichiers Compose (Nextcloud, Jellyfin, Immich…) |
| openmediavault-zfs | Pools ZFS (noyau Proxmox recommandé) |
| openmediavault-mergerfs + snapraid | Pool de disques hétérogènes avec parité |
| openmediavault-backup | Sauvegarde du disque système |
| rsnapshot, borgbackup | Sauvegardes versionnées |
| openmediavault-kvm | Machines virtuelles |

## Sauvegardes et supervision

*Services → Rsync* (tâches vers un autre serveur), *Tâches planifiées*, *Diagnostics → Rapports de performance* ; notifications par e-mail (*Système → Notification*) pour SMART, RAID dégradé et espace disque. Sauvegardez aussi le disque système (extension *backup*).

## Mises à jour et dépannage

```bash
sudo omv-upgrade                       # mise à jour d'OMV et de Debian
sudo omv-firstaid                      # menu de secours : réseau, port web, mot de passe admin, cache
sudo omv-salt deploy run samba         # régénérer la configuration d'un service
sudo omv-confdbadm read conf.system.network.interface
```

Ne modifiez pas directement `/etc/samba/smb.conf` ou `/etc/exports` : OMV les réécrit (utilisez les champs *Options supplémentaires* de l'interface).

Interface : [[03-interface-graphique|interface web]] · commandes : [[90-aide-memoire|aide-mémoire]].
