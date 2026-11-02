---
title: mdadm (RAID logiciel)
description: mdadm — RAID logiciel Linux (md) : niveaux RAID 0, 1, 5, 6, 10, création d'une grappe, /proc/mdstat, mdadm.conf et initramfs, surveillance et alertes par e-mail (mdmonitor), remplacement d'un disque défaillant, ajout de disques de secours, extension (grow) et changement de niveau, bitmap d'écriture, vérification périodique (checkarray, scrub), démarrage dégradé, assemblage sur une autre machine, et comparaison avec ZFS, Btrfs et le RAID matériel.
tags: [mdadm, raid logiciel, raid1, raid5, raid6, raid10, linux]
icon: info
---

**mdadm** gère le **RAID logiciel** du noyau Linux : performant, indépendant du matériel (une grappe se remonte sur n'importe quel Linux), et utilisé par [[22-openmediavault/01-presentation-installation|OpenMediaVault]] ou de nombreux serveurs sans contrôleur RAID.

| Niveau | Disques min. | Pannes tolérées | Usage |
| --- | --- | --- | --- |
| RAID 1 | 2 | n-1 | Système, petits volumes |
| RAID 5 | 3 | 1 | Évité sur gros disques (reconstruction longue) |
| **RAID 6** | 4 | 2 | Stockage de masse |
| **RAID 10** | 4 | 1 par miroir | Bases de données, VM |

## Créer une grappe

```bash
sudo apt install mdadm            # RHEL : dnf install mdadm
sudo mdadm --create /dev/md0 --level=6 --raid-devices=6 /dev/sd[b-g] --bitmap=internal
cat /proc/mdstat                  # synchronisation initiale en cours
sudo mkfs.xfs /dev/md0
sudo mdadm --detail --scan | sudo tee -a /etc/mdadm/mdadm.conf     # /etc/mdadm.conf sur RHEL
sudo update-initramfs -u          # RHEL : dracut -f
```

## Surveillance

```bash
# /etc/mdadm/mdadm.conf : MAILADDR admin@corp.exemple.fr
sudo systemctl enable --now mdmonitor      # alertes par e-mail (Postfix ou msmtp requis)
sudo mdadm --monitor --scan --test --oneshot   # envoyer un message de test
sudo mdadm --detail /dev/md0
```

Une vérification mensuelle (`checkarray` sur Debian, timer `mdcheck` sur RHEL) détecte les secteurs illisibles avant une panne.

## Remplacer un disque

```bash
sudo mdadm /dev/md0 --fail /dev/sdd --remove /dev/sdd
# Remplacer physiquement le disque (identifier par numéro de série : lsblk -o NAME,SERIAL)
sudo mdadm /dev/md0 --add /dev/sdh
watch cat /proc/mdstat
```

Pour un RAID 1 de démarrage, recopier la table de partitions (`sfdisk -d /dev/sda | sfdisk /dev/sdb`) et réinstaller GRUB sur le nouveau disque.

## Étendre

```bash
sudo mdadm /dev/md0 --add /dev/sdi && sudo mdadm --grow /dev/md0 --raid-devices=7
sudo xfs_growfs /srv/donnees          # après la fin du remodelage
```

Suite : [[90-aide-memoire|aide-mémoire]].
