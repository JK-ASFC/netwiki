---
title: Trino, Presto et Drill — aide-mémoire des commandes
description: Commandes Trino et Presto (CLI --server --catalog --schema --execute --output-format, SHOW CATALOGS/SCHEMAS/TABLES, EXPLAIN ANALYZE, system.runtime.queries, CALL system.kill_query, launcher start/stop/status, API /v1/info) et Drill (drill-embedded, sqlline, drillbit.sh, SHOW SCHEMAS, ALTER SESSION) avec exemples.
tags: [aide-mémoire, trino, presto, apache drill]
icon: terminal
---

Explications : [[01-trino-presto|Trino et Presto]] · [[02-apache-drill|Apache Drill]].

```bash
trino --server https://trino.corp.exemple.fr --user jk --password --catalog lac --schema reseau
trino --server http://coord:8080 --execute "SHOW CATALOGS" --output-format CSV
bin/launcher start ; bin/launcher status ; bin/launcher stop ; curl -s http://coord:8080/v1/info | jq .
```

```sql
SHOW SCHEMAS FROM lac; SHOW TABLES FROM lac.reseau; DESCRIBE lac.reseau.flux;
EXPLAIN ANALYZE SELECT count(*) FROM lac.reseau.flux;
SELECT query_id, state, user, query FROM system.runtime.queries WHERE state = 'RUNNING';
CALL system.runtime.kill_query(query_id => '20261102_101500_00042_abcde', message => 'Requête trop longue');
```

```bash
/opt/apache-drill/bin/drill-embedded ; /opt/apache-drill/bin/drillbit.sh start|stop|status
# sqlline> SHOW SCHEMAS; USE dfs.tmp; ALTER SESSION SET `store.format` = 'parquet'; !quit
```
