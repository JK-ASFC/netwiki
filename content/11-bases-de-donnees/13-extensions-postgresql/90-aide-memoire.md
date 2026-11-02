---
title: Citus, TimescaleDB et Apache AGE — aide-mémoire
description: Requêtes d'administration Citus (citus_add_node, citus_remove_node, create_distributed_table, undistribute_table, citus_rebalance_start, citus_tables, citus_shards, citus_stat_activity), TimescaleDB (create_hypertable, show_chunks, drop_chunks, compress_chunk, add_*_policy, timescaledb_information, hypertable_size) et Apache AGE (create_graph, drop_graph, cypher, ag_graph, ag_label).
tags: [aide-mémoire, citus, timescaledb, apache age, postgresql]
icon: terminal
---

Explications : [[01-citus|Citus]] · [[02-timescaledb|TimescaleDB]] · [[03-apache-age|Apache AGE]].

## Citus

```sql
SELECT citus_version(); SELECT * FROM citus_get_active_worker_nodes();
SELECT citus_add_node('10.0.20.33', 5432); SELECT citus_drain_node('10.0.20.31', 5432); SELECT citus_remove_node('10.0.20.31', 5432);
SELECT create_distributed_table('t', 'tenant_id', colocate_with => 'evenements'); SELECT undistribute_table('t');
SELECT citus_rebalance_start(); SELECT * FROM citus_rebalance_status();
SELECT * FROM citus_tables; SELECT * FROM citus_shards; SELECT * FROM citus_stat_activity;
```

## TimescaleDB

```sql
SELECT extversion FROM pg_extension WHERE extname = 'timescaledb';
SELECT * FROM timescaledb_information.hypertables; SELECT * FROM timescaledb_information.jobs;
SELECT show_chunks('mesures', older_than => INTERVAL '30 days'); SELECT drop_chunks('mesures', older_than => INTERVAL '13 months');
SELECT compress_chunk(c) FROM show_chunks('mesures', older_than => INTERVAL '7 days') c;
SELECT pg_size_pretty(hypertable_size('mesures')); SELECT * FROM hypertable_compression_stats('mesures');
SELECT remove_retention_policy('mesures'); CALL refresh_continuous_aggregate('mesures_horaire', NULL, NULL);
```

## Apache AGE

```sql
LOAD 'age'; SET search_path = ag_catalog, "$user", public;
SELECT * FROM ag_graph; SELECT * FROM ag_label;
SELECT * FROM cypher('reseau', $$ MATCH (n) RETURN count(n) $$) AS (n agtype);
SELECT drop_graph('reseau', true);
```
