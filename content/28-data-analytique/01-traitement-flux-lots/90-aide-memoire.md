---
title: Flink, Spark, Beam, Samza et Storm — aide-mémoire
description: Ports et commandes de Spark (start-master, spark-submit, pyspark, historique), Flink (start-cluster, flink run, savepoint, stop, sql-client), Beam (exécuteurs) et Storm (storm jar, list, rebalance, kill).
tags: [aide-mémoire, spark, flink, beam, samza, storm]
icon: terminal
---

Explications : [[01-apache-spark|Apache Spark]] · [[02-apache-flink|Apache Flink]] · [[03-beam-samza-storm|Beam, Samza et Storm]].

## Ports

| Moteur | Ports |
| --- | --- |
| Spark | 4040 application, 7077 maître, 8080/8081 interfaces standalone, 18080 historique |
| Flink | 8081 interface et API REST du JobManager, 6123 RPC |
| Storm | 6627 Nimbus, 8080 Storm UI |

## Commandes

```bash
# Spark
/opt/spark/sbin/start-master.sh ; /opt/spark/sbin/start-worker.sh spark://maitre:7077
spark-submit --master spark://maitre:7077 --executor-memory 8g --executor-cores 4 traitement.py
pyspark ; spark-sql
/opt/spark/sbin/start-history-server.sh

# Flink
/opt/flink/bin/start-cluster.sh
/opt/flink/bin/flink run -p 4 -d appli.jar ; /opt/flink/bin/flink list
/opt/flink/bin/flink savepoint <job-id> s3://flink/savepoints
/opt/flink/bin/flink stop --savepointPath s3://flink/savepoints <job-id>
/opt/flink/bin/flink run -s <chemin-savepoint> -d appli-v2.jar
/opt/flink/bin/sql-client.sh

# Beam
python3 pipeline.py --runner DirectRunner
python3 pipeline.py --runner FlinkRunner --flink_master=flink-jm:8081

# Storm
storm jar topologie.jar fr.exemple.Comptage comptage ; storm list
storm rebalance comptage -n 6 ; storm kill comptage -w 30
```
