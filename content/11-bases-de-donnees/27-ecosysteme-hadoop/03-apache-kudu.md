---
title: Apache Kudu
description: Apache Kudu — stockage en colonnes modifiable pour l'analytique rapide sur données qui changent (complément de HDFS dans l'écosystème Hadoop) : architecture (masters et tablet servers, Raft), installation (paquets de distributions Hadoop, compilation, Docker), tables avec clé primaire et partitionnement (hash, range), accès via Impala, Spark ou Trino, kudu CLI (cluster ksck, table list, tserver), interfaces web (8051, 8050), sauvegarde et état du projet.
tags: [apache kudu, hadoop, colonnes, impala, analytique]
icon: info
---

**Kudu** combine stockage **en colonnes** (analyses rapides) et **mises à jour par clé primaire** (ce que les fichiers Parquet sur HDFS ne permettent pas). On l'interroge surtout via **Impala**, Spark ou [[26-moteurs-sql-federes/01-trino-presto|Trino]]. Le projet est peu actif : les formats de tables ouverts (Iceberg, Delta) répondent aujourd'hui au même besoin sur stockage objet.

```bash
docker run -d --name kudu-master -p 7051:7051 -p 8051:8051 apache/kudu:latest master
docker run -d --name kudu-tserver -p 7050:7050 -p 8050:8050 -e KUDU_MASTERS=kudu-master apache/kudu:latest tserver
kudu cluster ksck kudu-master:7051            # vérification de cohérence du cluster
kudu table list kudu-master:7051
```

```sql
-- Depuis Impala
CREATE TABLE etat_equipements (equipement STRING PRIMARY KEY, site STRING, statut STRING, maj TIMESTAMP)
PARTITION BY HASH(equipement) PARTITIONS 8 STORED AS KUDU;
UPSERT INTO etat_equipements VALUES ('sw-coeur-01', 'paris', 'up', now());
```

Interfaces : master `http://<hôte>:8051`, tablet server `:8050`. Commandes : [[90-aide-memoire|aide-mémoire]].
