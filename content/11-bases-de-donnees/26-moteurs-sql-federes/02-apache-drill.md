---
title: Apache Drill
description: Apache Drill — moteur SQL sans schéma préalable pour interroger fichiers (JSON, Parquet, CSV), bases NoSQL et sources multiples : état du projet, installation (archive en mode embarqué ou distribué avec ZooKeeper, Docker), drill-embedded et sqlline, plugins de stockage (dfs, s3, mongo, hbase, rdbms), interface web (port 8047), requêtes sur fichiers, et alternatives modernes (DuckDB, Trino).
tags: [apache drill, sql, sans schéma, json, parquet]
icon: info
---

**Apache Drill** interroge en SQL des fichiers et sources **sans définir de schéma** à l'avance (il le découvre à la lecture). Le projet est moins actif aujourd'hui : pour un usage sur un poste, [[11-duckdb/01-presentation-utilisation|DuckDB]] est plus simple ; pour un cluster, [[01-trino-presto|Trino]] est plus répandu.

```bash
tar xzf apache-drill-*.tar.gz -C /opt && /opt/apache-drill-*/bin/drill-embedded     # mode embarqué (Java 8–17)
docker run -it --name drill -p 8047:8047 apache/drill
# Distribué : conf/drill-override.conf (zk.connect), puis bin/drillbit.sh start sur chaque nœud
```

```sql
SELECT site, count(*) FROM dfs.`/srv/exports/inventaire.json` GROUP BY site;
SELECT * FROM dfs.`/srv/journaux/2026/11/*.parquet` LIMIT 10;
```

Plugins de stockage (`dfs`, `s3`, `mongo`, `hbase`, `rdbms`) configurés depuis l'interface web `http://<hôte>:8047` (onglet *Storage*). Interface : [[03-interface-graphique|interfaces graphiques]].
