---
title: Greenplum et MonetDB — aide-mémoire des commandes
description: Commandes Greenplum/Cloudberry (gpstate, gpstart, gpstop, gprecoverseg, gpexpand, gpconfig, gpcheckcat, gpbackup, gprestore, analyzedb) et MonetDB (monetdbd start/stop/get/set, monetdb create/start/stop/status/release/lock/destroy, mclient, msqldump) avec exemples.
tags: [aide-mémoire, greenplum, cloudberry, monetdb]
icon: terminal
---

Explications : [[01-presentation-installation|Greenplum et MonetDB]].

```bash
gpstate -s ; gpstate -m ; gpstart -a ; gpstop -M fast -a ; gprecoverseg -a ; gprecoverseg -r -a
gpconfig -s shared_buffers ; gpconfig -c statement_mem -v 256MB && gpstop -u
gpcheckcat dwh ; analyzedb -d dwh -a ; gpexpand -i expansion.conf
gpbackup --dbname dwh --backup-dir /sauv/gp --leaf-partition-data ; gprestore --timestamp <horodatage> --backup-dir /sauv/gp --create-db
monetdbd get all /var/monetdb5/dbfarm ; monetdbd set listenaddr=0.0.0.0 /var/monetdb5/dbfarm
monetdb status ; monetdb start dwh ; monetdb stop dwh ; monetdb lock dwh ; monetdb release dwh ; monetdb destroy -f test
mclient -d dwh -s "SELECT count(*) FROM ventes" ; msqldump -d dwh -t ventes > ventes.sql
```
