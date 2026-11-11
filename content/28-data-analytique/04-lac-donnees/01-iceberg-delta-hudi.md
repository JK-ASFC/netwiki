---
title: Apache Iceberg, Delta Lake et Apache Hudi
description: Les formats de tables ouverts du lakehouse — principe (fichiers Parquet + métadonnées transactionnelles sur stockage objet), Apache Iceberg (instantanés, partitionnement caché, évolution de schéma, catalogues REST, Hive, Nessie, Glue, maintenance), Delta Lake (journal _delta_log, MERGE, time travel, OPTIMIZE, VACUUM, delta-rs) et Apache Hudi (copy-on-write, merge-on-read, upserts, compaction, timeline) ; moteurs compatibles et choix.
tags: [apache iceberg, delta lake, apache hudi, lakehouse, lac de données, parquet, spark, trino]
icon: layers
---

Un lac de données classique n'est qu'un tas de fichiers Parquet sur S3 ou HDFS : pas de transactions, pas de mise à jour fiable, lecture incohérente pendant une écriture. Les **formats de tables ouverts** ajoutent une couche de **métadonnées transactionnelles** : transactions ACID, mises à jour et suppressions, **voyage dans le temps**, évolution de schéma, le tout lisible par plusieurs moteurs (Spark, Flink, Trino, DuckDB…). C'est le principe du **lakehouse**.

## Apache Iceberg

| Élément | Rôle |
| --- | --- |
| Fichiers de données | Parquet (ou ORC, Avro) |
| Manifestes | Listes de fichiers avec statistiques (min/max par colonne) |
| **Instantané** (*snapshot*) | État complet de la table à un instant |
| Fichier de métadonnées | Schéma, partitionnement, liste des instantanés |
| **Catalogue** | Pointe vers le fichier de métadonnées courant : REST, Hive Metastore, JDBC, [[02-nessie-lakefs\|Nessie]], AWS Glue, Polaris |

Atouts : **partitionnement caché** (on filtre sur `date_cmd`, Iceberg applique la partition `days(date_cmd)` sans colonne supplémentaire), évolution du schéma et du partitionnement sans réécriture, moteurs très nombreux.

```sql
-- Spark SQL avec un catalogue Iceberg nommé « lac »
CREATE TABLE lac.ventes.commandes (
  id BIGINT, client STRING, montant DECIMAL(10,2), date_cmd TIMESTAMP)
USING iceberg PARTITIONED BY (days(date_cmd));

MERGE INTO lac.ventes.commandes c USING maj m ON c.id = m.id
WHEN MATCHED THEN UPDATE SET * WHEN NOT MATCHED THEN INSERT *;

SELECT * FROM lac.ventes.commandes TIMESTAMP AS OF '2026-11-01 00:00:00';
SELECT snapshot_id, committed_at, operation FROM lac.ventes.commandes.snapshots;

-- Maintenance
CALL lac.system.rewrite_data_files(table => 'ventes.commandes');        -- compacter les petits fichiers
CALL lac.system.expire_snapshots(table => 'ventes.commandes', older_than => TIMESTAMP '2026-10-01 00:00:00');
CALL lac.system.remove_orphan_files(table => 'ventes.commandes');
```

```bash
spark-sql --packages org.apache.iceberg:iceberg-spark-runtime-3.5_2.12:<version> \
  --conf spark.sql.extensions=org.apache.iceberg.spark.extensions.IcebergSparkSessionExtensions \
  --conf spark.sql.catalog.lac=org.apache.iceberg.spark.SparkCatalog \
  --conf spark.sql.catalog.lac.type=rest \
  --conf spark.sql.catalog.lac.uri=http://catalogue:8181
python3 -m pip install "pyiceberg[s3fs,pyarrow]"     # accès Python sans Spark
```

## Delta Lake

Créé par Databricks, sous licence Apache 2.0 et hébergé par la Linux Foundation. Les transactions sont écrites dans le répertoire **`_delta_log/`** (fichiers JSON + points de contrôle Parquet) à côté des données.

```sql
CREATE TABLE ventes USING delta LOCATION 's3a://lac/ventes';
MERGE INTO ventes v USING maj m ON v.id = m.id
  WHEN MATCHED THEN UPDATE SET * WHEN NOT MATCHED THEN INSERT *;
DESCRIBE HISTORY ventes;
SELECT * FROM ventes VERSION AS OF 42;
RESTORE TABLE ventes TO VERSION AS OF 41;
OPTIMIZE ventes ZORDER BY (client);       -- compactage et regroupement
VACUUM ventes RETAIN 168 HOURS;           -- supprime les fichiers plus référencés
```

```bash
python3 -m pip install deltalake        # delta-rs : lecture et écriture sans Spark (Rust, Python)
```

**UniForm** permet de lire une table Delta comme une table Iceberg.

## Apache Hudi

Né chez Uber pour les **mises à jour fréquentes** (upserts, CDC) dans un lac de données.

| Type de table | Écriture | Lecture | Usage |
| --- | --- | --- | --- |
| **Copy-on-Write** | Réécrit les fichiers modifiés | Rapide | Analyse, peu de mises à jour |
| **Merge-on-Read** | Journal delta, compaction ultérieure | Fusion à la lecture | Ingestion continue, CDC |

```python
(df.write.format("hudi")
   .option("hoodie.table.name", "commandes")
   .option("hoodie.datasource.write.recordkey.field", "id")
   .option("hoodie.datasource.write.precombine.field", "maj_le")
   .option("hoodie.datasource.write.operation", "upsert")
   .option("hoodie.datasource.write.table.type", "MERGE_ON_READ")
   .mode("append").save("s3a://lac/commandes"))
```

La **timeline** (`.hoodie/`) trace les validations, compactions et nettoyages ; **Hudi Streamer** ingère en continu depuis Kafka ou une base. Les services de table (compaction, nettoyage, regroupement) tournent en ligne ou à part.

## Choisir

| Critère | Iceberg | Delta Lake | Hudi |
| --- | --- | --- | --- |
| Moteurs compatibles | Les plus nombreux | Spark, Databricks, delta-rs, Trino | Spark, Flink, Trino |
| Point fort | Neutralité, catalogues, partitionnement caché | Simplicité avec Spark | Upserts et CDC intensifs |
| Tendance | Standard de fait multi-moteurs | Très utilisé avec Databricks | Niche des mises à jour fréquentes |

Toujours planifier la **maintenance** (compactage, expiration des instantanés, nettoyage) : sinon petits fichiers et coûts de stockage s'accumulent.

Voir aussi : [[02-nessie-lakefs|Nessie et lakeFS]] · [[01-traitement-flux-lots/01-apache-spark|Apache Spark]]. Commandes : [[90-aide-memoire|aide-mémoire]].
