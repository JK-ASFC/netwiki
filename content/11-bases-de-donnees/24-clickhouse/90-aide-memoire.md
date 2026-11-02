---
title: ClickHouse — aide-mémoire des commandes
description: Commandes ClickHouse avec exemples — clickhouse-client (-q, --password, --format, --multiquery, --queries-file), clickhouse local, requêtes système (query_log, processes, parts, merges, replicas, disks), KILL QUERY, OPTIMIZE, ALTER TABLE DROP PARTITION, SYSTEM RELOAD CONFIG, SYSTEM FLUSH LOGS, BACKUP et RESTORE, gestion des utilisateurs, API HTTP.
tags: [aide-mémoire, clickhouse, sql, olap]
icon: terminal
---

Explications : [[01-presentation-installation|ClickHouse]].

```bash
clickhouse-client --host srv-ch-01 --user analyste --password ; clickhouse-client -q "SELECT version()"
clickhouse-client --format PrettyCompact -q "SHOW TABLES FROM reseau" ; clickhouse-client --queries-file schema.sql
clickhouse local -q "SELECT count() FROM file('flux.parquet')"            # sans serveur
curl -s 'http://localhost:8123/?query=SELECT%201' ; echo 'SELECT 1' | curl -s 'http://localhost:8123/' --data-binary @- -u analyste:$MDP
```

```sql
SELECT query_id, user, elapsed, query FROM system.processes; KILL QUERY WHERE query_id = '…';
SELECT event_time, query_duration_ms, read_rows, query FROM system.query_log WHERE type = 'QueryFinish' ORDER BY query_duration_ms DESC LIMIT 10;
SELECT table, partition, sum(rows), formatReadableSize(sum(bytes_on_disk)) FROM system.parts WHERE active GROUP BY table, partition ORDER BY partition DESC LIMIT 20;
SELECT * FROM system.merges; SELECT database, table, is_readonly, absolute_delay FROM system.replicas;
ALTER TABLE reseau.flux DROP PARTITION 20260101; OPTIMIZE TABLE reseau.flux FINAL;
SYSTEM RELOAD CONFIG; SYSTEM FLUSH LOGS;
BACKUP TABLE reseau.flux TO Disk('sauvegardes', 'flux-2026-11-02.zip'); RESTORE TABLE reseau.flux FROM Disk('sauvegardes', 'flux-2026-11-02.zip');
SHOW USERS; SHOW GRANTS FOR analyste;
```
