---
title: Grilles en mémoire — aide-mémoire des commandes
description: Commandes Hazelcast (hz start, hz-cli, cluster state, sql), Ignite (ignite.sh, control.sh --state, --set-state, --baseline, --cache list, --snapshot create, sqlline), Geode (gfsh start/stop locator et server, list members, describe region, export data, shutdown) et VoltDB (voltdb init/start, voltadmin status/save/restore/pause/resume/shutdown, sqlcmd) avec exemples.
tags: [aide-mémoire, hazelcast, apache ignite, apache geode, voltdb]
icon: terminal
---

Explications : [[01-ignite-hazelcast|Ignite et Hazelcast]] · [[02-geode-voltdb|Geode et VoltDB]].

```bash
bin/hz start -c hazelcast.yaml ; bin/hz-cli --targets corp@10.0.20.241 cluster ; bin/hz-cli sql
bin/ignite.sh config/serveur.xml ; bin/control.sh --state ; bin/control.sh --set-state ACTIVE ; bin/control.sh --baseline
bin/control.sh --cache list '.*' ; bin/control.sh --snapshot create snap_2026_11_02 ; bin/sqlline.sh -u jdbc:ignite:thin://127.0.0.1/
gfsh -e "connect --locator=10.0.20.261[10334]" -e "list members" -e "describe region --name=sessions"
gfsh -e "connect" -e "export data --region=sessions --file=/sauv/sessions.gfd --member=srv1" ; gfsh -e "connect" -e "shutdown --include-locators=true"
voltadmin status ; voltadmin save --blocking /sauv/volt instantane ; voltadmin restore /sauv/volt instantane ; voltadmin shutdown
```
