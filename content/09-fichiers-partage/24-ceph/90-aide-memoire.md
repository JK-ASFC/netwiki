---
title: Ceph — aide-mémoire des commandes
description: Commandes Ceph avec exemples — ceph -s, health detail, df, osd tree/df/status/out/in/set noout, pg stat, pool ls detail, orch ls/ps/host/device/apply/upgrade, rbd create/ls/info/map/snap, ceph fs status/volume, radosgw-admin user/bucket, auth, config set/dump, crash, log last, cephadm shell.
tags: [aide-mémoire, ceph, cephadm, rbd, radosgw-admin]
icon: terminal
---

Explications : [[01-presentation-installation|Ceph]] · [[02-rbd-cephfs-rgw|exploitation]].

```bash
ceph -s ; ceph health detail ; ceph df ; ceph osd df tree ; ceph osd tree ; ceph pg stat ; ceph osd pool ls detail
ceph osd out 7 ; ceph osd in 7 ; ceph osd set noout ; ceph osd unset noout ; ceph osd perf
ceph orch ls ; ceph orch ps ; ceph orch host ls ; ceph orch device ls --refresh ; ceph orch daemon restart osd.7
ceph orch upgrade status ; ceph versions ; ceph mgr services
rbd ls vm ; rbd info vm/disque-app01 ; rbd showmapped ; rbd resize vm/disque-app01 --size 200G ; rbd snap purge vm/disque-app01
ceph fs ls ; ceph fs status ; ceph mds stat
radosgw-admin user list ; radosgw-admin user info --uid=sauvegardes ; radosgw-admin bucket stats --bucket=veeam ; radosgw-admin gc process
ceph auth ls ; ceph auth get client.app01 ; ceph config dump ; ceph config set osd osd_max_backfills 2
ceph crash ls ; ceph log last 50 ; sudo cephadm shell -- ceph -s
```
