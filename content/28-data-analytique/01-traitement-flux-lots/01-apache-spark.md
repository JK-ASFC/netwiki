---
title: Apache Spark
description: Apache Spark, moteur de calcul distribué en mémoire — architecture (pilote, exécuteurs, gestionnaire de grappe standalone, YARN ou Kubernetes), Spark SQL et DataFrames, Structured Streaming, MLlib, installation, spark-shell, pyspark, spark-submit, réglages de mémoire et de partitions, interface web (4040, 8080, historique 18080), stockage objet S3 et sécurité.
tags: [apache spark, spark, pyspark, big data, spark sql, streaming, yarn, kubernetes]
icon: workflow
---

**Apache Spark** traite de grands volumes de données en les répartissant sur une grappe et en gardant les résultats intermédiaires **en mémoire**. On l'utilise en SQL, Python (**PySpark**), Scala, Java ou R, pour l'ETL, l'analyse, l'apprentissage automatique (MLlib) et le streaming (micro-lots).

## Architecture

| Élément | Rôle |
| --- | --- |
| **Pilote** (*driver*) | Programme principal : construit le plan d'exécution, répartit les tâches |
| **Exécuteurs** | Processus sur les nœuds de travail qui calculent et gardent les données en cache |
| **Gestionnaire de grappe** | *Standalone* (fourni), **YARN** (Hadoop), **Kubernetes** |
| Stockage | HDFS, S3 / MinIO, fichiers Parquet, ORC, tables Iceberg, Delta, Hudi |

| Port | Usage |
| --- | --- |
| 4040 | Interface de l'application en cours (une par pilote) |
| 7077 | Maître *standalone* |
| 8080 / 8081 | Interface du maître / des travailleurs *standalone* |
| 18080 | Serveur d'historique |

## Installation

```bash
# Java 17 requis ; archive depuis spark.apache.org
tar xzf spark-*-bin-hadoop3.tgz -C /opt && ln -s /opt/spark-*-bin-hadoop3 /opt/spark
export SPARK_HOME=/opt/spark PATH=$PATH:/opt/spark/bin
python3 -m pip install pyspark            # pour un usage local en Python

# Grappe standalone
/opt/spark/sbin/start-master.sh
/opt/spark/sbin/start-worker.sh spark://maitre:7077     # sur chaque nœud
```

## Utilisation

```python
from pyspark.sql import SparkSession, functions as F

spark = SparkSession.builder.appName("ventes").getOrCreate()
df = spark.read.parquet("s3a://donnees/ventes/")
(df.filter(F.col("pays") == "FR")
   .groupBy("mois").agg(F.sum("montant").alias("ca"))
   .write.mode("overwrite").parquet("s3a://donnees/agregats/ca_mensuel/"))
```

```bash
spark-shell ; pyspark ; spark-sql
spark-submit --master spark://maitre:7077 --deploy-mode cluster \
  --executor-memory 8g --executor-cores 4 --num-executors 10 \
  --conf spark.sql.shuffle.partitions=400 \
  traitement.py
spark-submit --master k8s://https://api.k8s:6443 --deploy-mode cluster \
  --conf spark.kubernetes.container.image=apache/spark:latest local:///opt/app/traitement.py
```

**Structured Streaming** lit Kafka, des fichiers ou des sockets et écrit en continu, avec un répertoire de **points de contrôle** (`checkpointLocation`) pour reprendre après panne.

## Réglages et pièges

- `spark.executor.memory`, `spark.executor.cores`, `spark.sql.shuffle.partitions` : à ajuster au volume ; l'**exécution adaptative** (AQE, activée par défaut) corrige une partie des déséquilibres.
- Éviter `collect()` sur de gros jeux de données (tout remonte au pilote).
- Données **déséquilibrées** (*skew*) : clés très fréquentes qui ralentissent une tâche ; voir l'interface 4040 (onglet Stages).
- Activer le **serveur d'historique** (`spark.eventLog.enabled=true`) pour analyser les traitements terminés.

## Sécurité

Authentification (`spark.authenticate`), chiffrement RPC et des données de *shuffle*, ACL sur l'interface web, Kerberos en environnement Hadoop. Une grappe *standalone* sans authentification permet d'exécuter du code arbitraire : ne jamais exposer le port 7077.

Voir aussi : [[02-apache-flink|Apache Flink]] · [[03-beam-samza-storm|Beam, Samza et Storm]]. Commandes : [[90-aide-memoire|aide-mémoire]].
