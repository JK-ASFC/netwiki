---
title: Lustre et BeeGFS — aide-mémoire des commandes
description: Commandes Lustre (lfs df, find, getstripe, setstripe, quota, migrate, check ; lctl dl, get_param, list_nids, ping ; mkfs.lustre, tunefs.lustre) et BeeGFS (beegfs-df, beegfs-ctl --listnodes, --listtargets, --getentryinfo, --setpattern, --migrate, --getquota, beegfs-check-servers, beegfs-net) avec exemples.
tags: [aide-mémoire, lustre, beegfs, lfs, lctl]
icon: terminal
---

Explications : [[01-presentation-installation|Lustre et BeeGFS]].

```bash
lfs df -h ; lfs df -i ; lfs find /scratch -size +100G -mtime +90 ; lfs getstripe -d /scratch/projet
lfs setstripe -c -1 /scratch/projet/sortie ; lfs migrate -c 4 /scratch/projet/gros.bin ; lfs quota -h -u jk /scratch
lctl dl ; lctl list_nids ; lctl ping 10.0.40.21@tcp ; lctl get_param osc.*.stats | head ; tunefs.lustre --dryrun /dev/sdb
beegfs-df ; beegfs-check-servers ; beegfs-net
beegfs-ctl --listnodes --nodetype=meta --details ; beegfs-ctl --listtargets --nodetype=storage --state
beegfs-ctl --getentryinfo /mnt/beegfs/projet/fichier ; beegfs-ctl --getquota --uid jk
```
