---
title: Kopia — aide-mémoire des commandes
description: Commandes Kopia avec exemples — repository create/connect/disconnect/status/change-password, snapshot create/list/restore/delete/verify/diff, policy set/show/list, mount, restore, ls, content stats, maintenance info/run, server start, server user add/list, cache clear, logs.
tags: [aide-mémoire, kopia, sauvegarde]
icon: terminal
---

Explications : [[01-presentation-installation|Kopia]] · [[02-interface-graphique|KopiaUI]].

```bash
kopia repository create filesystem --path /mnt/sauv/kopia ; kopia repository connect sftp --host nas --username kopia --keyfile ~/.ssh/id_kopia --path /volume1/kopia
kopia repository status ; kopia repository change-password ; kopia repository disconnect
kopia snapshot create /srv/donnees --description "avant migration" ; kopia snapshot list --all ; kopia snapshot diff k1 k2
kopia snapshot delete k1a2b3c4 --delete ; kopia snapshot verify --verify-files-percent=10
kopia policy show --global ; kopia policy list ; kopia policy set /home --keep-daily 30 --snapshot-time 02:30
kopia ls -l k1a2b3c4/etc ; kopia restore k1a2b3c4/etc/nginx /tmp/nginx ; kopia mount k1a2b3c4 /mnt/k
kopia content stats ; kopia maintenance info ; kopia maintenance run --full ; kopia cache clear
kopia server user list ; kopia server user add sauv@srv-web-01 ; kopia logs list
```
