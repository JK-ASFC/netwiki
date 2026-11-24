---
title: JuiceFS et MooseFS — aide-mémoire des commandes
description: Commandes JuiceFS (format, mount, gateway, webdav, sync, bench, info, stats, warmup, gc, fsck, config, dump/load des métadonnées) et MooseFS (mfsmount, mfssetgoal, mfsgetgoal, mfsfileinfo, mfsdirinfo, mfssettrashtime, mfsmakesnapshot, mfscli, services) avec exemples.
tags: [aide-mémoire, juicefs, moosefs, système de fichiers, stockage]
icon: terminal
---

Explications : [[01-juicefs|JuiceFS]] · [[02-moosefs|MooseFS]].

## JuiceFS

```bash
juicefs format --storage s3 --bucket https://b.s3.exemple.fr --access-key AK --secret-key SK "redis://:mdp@10.0.20.40:6379/1" monvolume
juicefs mount "redis://:mdp@10.0.20.40:6379/1" /mnt/jfs --cache-dir /var/jfsCache --cache-size 102400 --writeback -d
juicefs bench /mnt/jfs ; juicefs stats /mnt/jfs ; juicefs info /mnt/jfs/fichier
juicefs warmup /mnt/jfs/projet ; juicefs sync s3://src/ jfs://monvolume/dst/
juicefs gc --delete "redis://:mdp@10.0.20.40:6379/1" ; juicefs fsck "redis://:mdp@10.0.20.40:6379/1"
juicefs config "redis://:mdp@10.0.20.40:6379/1" --trash-days 7
juicefs dump "redis://:mdp@10.0.20.40:6379/1" meta-$(date +%F).json.gz        # sauvegarde des métadonnées
juicefs gateway "redis://:mdp@10.0.20.40:6379/1" 0.0.0.0:9005                  # passerelle S3
umount /mnt/jfs
```

## MooseFS

```bash
sudo systemctl enable --now moosefs-master moosefs-cgiserv       # maître + interface web :9425
sudo systemctl enable --now moosefs-chunkserver                   # serveur de chunks
sudo mfsmount /mnt/mfs -H mfsmaster                               # client (FUSE)
mfssetgoal -r 3 /mnt/mfs/important ; mfsgetgoal /mnt/mfs/important
mfsfileinfo /mnt/mfs/base.dump ; mfsdirinfo /mnt/mfs/projets
mfssettrashtime 86400 /mnt/mfs/projets ; mfsgettrashtime /mnt/mfs/projets
mfsmakesnapshot /mnt/mfs/projets /mnt/mfs/projets-snap
mfscli -SIN        # état infrastructure ; -SIM maître, -SCS chunkservers, -SHD disques
```
