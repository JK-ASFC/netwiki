---
title: Présentation, installation et utilisation
description: rdiff-backup et rsnapshot — sauvegardes incrémentales simples fondées sur rsync et librsync : rdiff-backup (miroir de la dernière version + différences inversées, restauration à une date, suppression des anciennes versions, sauvegarde distante par SSH, version 2.x) et rsnapshot (instantanés horaires, quotidiens, hebdomadaires et mensuels par liens durs, rsnapshot.conf, rotation, sauvegarde distante, scripts), installation Linux, macOS et Windows (rdiff-backup), planification, limites et comparaison avec restic et Borg.
tags: [rdiff-backup, rsnapshot, rsync, sauvegarde incrémentale, liens durs]
icon: info
---

Deux outils éprouvés pour des sauvegardes **lisibles directement** sur le disque de destination (pas de format propriétaire), sans déduplication ni chiffrement : pour ces besoins, préférer [[01-restic/01-presentation-installation|restic]], [[02-borgbackup/01-presentation-installation|Borg]] ou [[09-kopia/01-presentation-installation|Kopia]].

| | **rdiff-backup** | **rsnapshot** |
| --- | --- | --- |
| Principe | Miroir complet + **différences inversées** pour l'historique | Un répertoire complet par instantané, fichiers inchangés en **liens durs** |
| Espace | Très économe (seules les différences des fichiers modifiés) | Un fichier modifié est stocké en entier |
| Restauration | `rdiff-backup restore --at 3D` | Simple copie depuis `daily.2/` |

## rdiff-backup

```bash
sudo apt install rdiff-backup          # RHEL : dnf install rdiff-backup (EPEL) ; macOS : brew ; Windows : binaire des versions GitHub
rdiff-backup backup /srv/donnees /mnt/sauv/donnees
rdiff-backup backup srv-web-01::/etc /sauv/srv-web-01/etc            # distant par SSH (rdiff-backup installé des deux côtés)
rdiff-backup list increments /sauv/srv-web-01/etc
rdiff-backup restore --at 3D /sauv/srv-web-01/etc/nginx /tmp/nginx-il-y-a-3-jours
rdiff-backup remove increments --older-than 6M /sauv/srv-web-01/etc
```

## rsnapshot

```text
# /etc/rsnapshot.conf — les champs sont séparés par des TABULATIONS
snapshot_root	/sauv/rsnapshot/
retain	quotidien	7
retain	hebdo	4
retain	mensuel	12
exclude	*.tmp
backup	/etc/	localhost/
backup	/srv/	localhost/
backup	root@srv-web-01:/etc/	srv-web-01/
```

```bash
sudo apt install rsnapshot
sudo rsnapshot configtest
sudo rsnapshot -t quotidien        # afficher les commandes sans les exécuter
# /etc/cron.d/rsnapshot : les niveaux longs passent avant les courts
# 30 3 1 * *  root rsnapshot mensuel
# 0  3 * * 1  root rsnapshot hebdo
# 30 2 * * *  root rsnapshot quotidien
ls /sauv/rsnapshot/quotidien.0/srv-web-01/etc/
```

Commandes : [[90-aide-memoire|aide-mémoire]].
