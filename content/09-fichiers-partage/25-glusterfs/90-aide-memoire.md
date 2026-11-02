---
title: GlusterFS — aide-mémoire des commandes
description: Commandes gluster avec exemples — peer probe/status/detach, pool list, volume create/start/stop/delete/info/status/set/get/reset, add-brick, remove-brick, replace-brick, rebalance, heal (info, split-brain, full), quota, profile, top, snapshot, géo-réplication, journaux.
tags: [aide-mémoire, glusterfs, gluster]
icon: terminal
---

Explications : [[01-presentation-installation|GlusterFS]].

```bash
gluster peer probe gl4 ; gluster peer status ; gluster pool list ; gluster peer detach gl4
gluster volume list ; gluster volume info web ; gluster volume status web detail ; gluster volume status web clients
gluster volume set web performance.cache-size 512MB ; gluster volume get web all | less ; gluster volume reset web performance.cache-size
gluster volume add-brick web replica 3 gl4:/srv/gluster/web gl5:/srv/gluster/web gl6:/srv/gluster/web ; gluster volume rebalance web start ; gluster volume rebalance web status
gluster volume remove-brick web replica 3 gl4:/srv/gluster/web gl5:/srv/gluster/web gl6:/srv/gluster/web start|status|commit
gluster volume heal web info ; gluster volume heal web full ; gluster volume heal web info split-brain
gluster volume profile web start ; gluster volume profile web info ; gluster volume top web read
gluster volume stop web ; gluster volume delete web
tail -f /var/log/glusterfs/glusterd.log /var/log/glusterfs/bricks/*.log
```
