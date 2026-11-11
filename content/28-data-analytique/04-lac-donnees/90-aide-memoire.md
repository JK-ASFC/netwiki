---
title: Iceberg, Delta Lake, Hudi, Nessie et lakeFS — aide-mémoire
description: Requêtes et commandes de maintenance Iceberg (snapshots, rewrite_data_files, expire_snapshots), Delta Lake (HISTORY, VERSION AS OF, OPTIMIZE, VACUUM, RESTORE), options d'écriture Hudi, branches Nessie et commandes lakectl.
tags: [aide-mémoire, iceberg, delta lake, hudi, nessie, lakefs, lakectl]
icon: terminal
---

Explications : [[01-iceberg-delta-hudi|Iceberg, Delta Lake et Hudi]] · [[02-nessie-lakefs|Nessie et lakeFS]].

| Outil | Port |
| --- | --- |
| Nessie | 19120 (API v2 et catalogue REST Iceberg) |
| lakeFS | 8000 (interface, API, passerelle S3) |
| Catalogue REST Iceberg (exemple) | 8181 |

```sql
-- Iceberg (Spark SQL)
SELECT * FROM lac.db.t TIMESTAMP AS OF '2026-11-01 00:00:00';
SELECT * FROM lac.db.t.snapshots ;  SELECT * FROM lac.db.t.files;
CALL lac.system.rewrite_data_files(table => 'db.t');
CALL lac.system.expire_snapshots(table => 'db.t', older_than => TIMESTAMP '2026-10-01 00:00:00');
CALL lac.system.remove_orphan_files(table => 'db.t');

-- Delta Lake
DESCRIBE HISTORY t ; SELECT * FROM t VERSION AS OF 42 ; RESTORE TABLE t TO VERSION AS OF 41;
OPTIMIZE t ZORDER BY (client) ; VACUUM t RETAIN 168 HOURS;

-- Nessie
CREATE BRANCH IF NOT EXISTS essai IN lac FROM main ; USE REFERENCE essai IN lac;
MERGE BRANCH essai INTO main IN lac ; SHOW LOG main IN lac;
```

```bash
# lakeFS
lakectl repo create lakefs://lac s3://bucket-lac
lakectl branch create lakefs://lac/essai --source lakefs://lac/main
lakectl diff lakefs://lac/main lakefs://lac/essai
lakectl commit lakefs://lac/essai -m "message" ; lakectl merge lakefs://lac/essai lakefs://lac/main
lakectl log lakefs://lac/main

# Python sans Spark
python3 -m pip install "pyiceberg[s3fs,pyarrow]" deltalake
```
