---
title: DuckDB — aide-mémoire des commandes
description: Commandes DuckDB avec exemples — CLI (-c, -csv, -json, -readonly, -ui), commandes point (.tables, .schema, .mode, .timer, .maxrows, .output, .read, .open), DESCRIBE, SUMMARIZE, read_csv, read_parquet, read_json, COPY TO, EXPORT DATABASE, INSTALL et LOAD d'extensions, ATTACH, secrets S3, PRAGMA et réglages mémoire et threads.
tags: [aide-mémoire, duckdb, sql]
icon: terminal
---

Explications : [[01-presentation-utilisation|DuckDB]].

```bash
duckdb -c "SELECT * FROM 'f.csv' LIMIT 5" ; duckdb -csv -c "…" > sortie.csv ; duckdb -json -c "…" ; duckdb -readonly base.duckdb ; duckdb -ui
```

```sql
.tables ; .schema ; .mode markdown ; .timer on ; .maxrows 50 ; .output resultat.csv ; .read script.sql ; .open autre.duckdb
DESCRIBE SELECT * FROM 'f.parquet' ; SUMMARIZE SELECT * FROM 'f.csv';
SELECT * FROM read_csv('f.csv', delim = ';', header = true, dateformat = '%d/%m/%Y');
SELECT * FROM read_parquet('s3://bucket/*.parquet', hive_partitioning = true);
CREATE TABLE postes AS SELECT * FROM 'export.csv';
COPY postes TO 'postes.parquet' (FORMAT parquet, COMPRESSION zstd);
EXPORT DATABASE 'sauvegarde' (FORMAT parquet); IMPORT DATABASE 'sauvegarde';
INSTALL spatial; LOAD spatial; SELECT * FROM duckdb_extensions();
ATTACH 'host=… dbname=…' AS pg (TYPE postgres); DETACH pg;
SET memory_limit = '4GB'; SET threads = 8; PRAGMA database_size;
```
