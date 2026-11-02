---
title: Présentation, installation et configuration
description: mergerfs et SnapRAID — stockage économique pour NAS domestiques et médiathèques : mergerfs (union FUSE de disques de tailles différentes, politiques de création epmfs, mfs, ff, montage fstab, options) et SnapRAID (parité différée sur 1 à 6 disques, snapraid.conf, sync, scrub, fix, diff, status, planification avec snapraid-runner), installation Linux (et Windows pour SnapRAID), limites (données très changeantes) et comparaison avec ZFS et mdadm.
tags: [mergerfs, snapraid, nas, parité, médiathèque, fuse]
icon: info
---

Le duo **mergerfs + SnapRAID** convient aux **médiathèques** et archives qui changent peu : on mélange des disques de tailles différentes, chaque disque reste un système de fichiers lisible seul, et un ou plusieurs disques de **parité** protègent l'ensemble. Il est très utilisé avec [[22-openmediavault/01-presentation-installation|OpenMediaVault]] et les serveurs [[01-jellyfin/01-presentation-installation|multimédia]].

| | mergerfs + SnapRAID | [[27-openzfs/01-presentation-installation\|ZFS]] / [[29-lvm-mdadm/02-mdadm\|mdadm]] |
| --- | --- | --- |
| Disques de tailles différentes | Oui | Peu adapté |
| Ajout d'un disque | Immédiat | Contraintes de vdev / remodelage |
| Protection | **Différée** (au `sync`), jusqu'à 6 parités | Temps réel |
| Perte au-delà de la redondance | Seuls les disques perdus | Toute la grappe |

## Installation

```bash
sudo apt install mergerfs snapraid          # Debian/Ubuntu récents (sinon paquets .deb des versions GitHub)
sudo dnf install mergerfs                   # Fedora ; SnapRAID : compilation ou dépôts tiers sur RHEL
```

SnapRAID existe aussi pour **Windows** (combiné à DrivePool) ; mergerfs est propre à Linux/FreeBSD.

## mergerfs

```bash
# Disques de données montés dans /mnt/disque1… ; union dans /srv/media
echo '/mnt/disque* /srv/media fuse.mergerfs cache.files=off,category.create=mfs,dropcacheonclose=true,minfreespace=50G,fsname=mergerfs 0 0' | sudo tee -a /etc/fstab
sudo mkdir -p /srv/media && sudo mount /srv/media && df -h /srv/media
```

Politiques de création : `mfs` (disque le plus libre), `epmfs` (garder les fichiers d'un même dossier ensemble), `ff` (premier disque).

## SnapRAID

```ini
# /etc/snapraid.conf
parity /mnt/parite1/snapraid.parity
2-parity /mnt/parite2/snapraid.2-parity
content /var/snapraid/snapraid.content
content /mnt/disque1/snapraid.content
content /mnt/disque2/snapraid.content
data d1 /mnt/disque1/
data d2 /mnt/disque2/
data d3 /mnt/disque3/
exclude *.tmp
exclude /lost+found/
```

```bash
sudo snapraid sync                 # calcule la parité (à planifier chaque nuit)
sudo snapraid scrub -p 8 -o 10     # vérifie 8 % des blocs non vérifiés depuis 10 jours
sudo snapraid status ; sudo snapraid diff
sudo snapraid -d d2 -l reconstruction.log fix    # reconstruire un disque remplacé
```

Les disques de parité doivent être **au moins aussi grands** que le plus grand disque de données. Planifiez `sync` + `scrub` (script snapraid-runner ou minuterie systemd) avec un garde-fou sur le nombre de suppressions.

Commandes : [[90-aide-memoire|aide-mémoire]].
