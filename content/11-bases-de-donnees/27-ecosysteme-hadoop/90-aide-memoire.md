---
title: Hive, HBase et Kudu — aide-mémoire des commandes
description: Commandes Hive (schematool -initSchema/-upgradeSchema/-info, hive --service metastore, hiveserver2, beeline -u, SHOW PARTITIONS, MSCK REPAIR TABLE, ANALYZE TABLE), HBase (start/stop-hbase.sh, hbase shell : list, describe, scan, count, flush, major_compact, balancer, snapshot, clone_snapshot ; hbase hbck) et Kudu (kudu cluster ksck, table list/describe/delete, tserver list, master list) avec exemples.
tags: [aide-mémoire, apache hive, apache hbase, apache kudu, beeline]
icon: terminal
---

Explications : [[01-apache-hive|Hive]] · [[02-apache-hbase|HBase]] · [[03-apache-kudu|Kudu]].

## Hive

```bash
schematool -dbType postgres -info ; schematool -dbType postgres -upgradeSchema
beeline -u "jdbc:hive2://srv-hive:10000/default" -n jk -e "SHOW DATABASES"
```

```sql
SHOW PARTITIONS journaux; MSCK REPAIR TABLE journaux; ANALYZE TABLE journaux PARTITION (jour) COMPUTE STATISTICS;
DESCRIBE FORMATTED journaux; ALTER TABLE journaux DROP PARTITION (jour < '2026-01-01');
```

## HBase

```bash
bin/start-hbase.sh ; bin/stop-hbase.sh ; bin/hbase hbck -details ; bin/hbase-daemon.sh restart regionserver
```

```text
hbase> list ; describe 'mesures' ; count 'mesures' ; flush 'mesures' ; major_compact 'mesures'
hbase> balancer ; balance_switch true ; snapshot 'mesures', 'snap1' ; list_snapshots ; clone_snapshot 'snap1', 'mesures_copie'
hbase> disable 'ancienne' ; drop 'ancienne'
```

## Kudu

```bash
kudu cluster ksck master:7051 ; kudu master list master:7051 ; kudu tserver list master:7051
kudu table list master:7051 ; kudu table describe master:7051 impala::default.etat_equipements ; kudu table delete master:7051 ancienne
```
