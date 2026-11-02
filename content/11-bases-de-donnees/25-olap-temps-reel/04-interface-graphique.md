---
title: Interfaces graphiques
description: Consoles web OLAP — Apache Doris (port 8030 : requêtes, état des FE/BE, tâches d'ingestion), Apache Pinot (port 9000 : Cluster Manager, Query Console, Zookeeper Browser, Swagger) et Apache Druid (port 8888 : Load data, Query, Datasources, Segments, Supervisors, Tasks, Services), avec emplacements de captures d'écran.
tags: [apache doris, apache pinot, apache druid, interface graphique, captures]
icon: monitor
---

## Apache Doris (`http://<fe>:8030`)

Connexion `root` : **Playground** (requêtes SQL), **System** (FE, BE, tablets), **QueryProfile** (plans d'exécution), **Session**, **Configuration**.

<!-- CAPTURE: Apache Doris — interface web, liste des Backends | _assets/doris-backends.png -->

## Apache Pinot (`http://<controller>:9000`)

**Cluster Manager** (tenants, tables, segments, santé), **Query Console** (SQL), **Zookeeper Browser**, **Swagger REST API**.

<!-- CAPTURE: Apache Pinot — Query Console | _assets/pinot-query.png -->

## Apache Druid (`http://<router>:8888`)

**Load data** (assistants d'ingestion fichiers/Kafka), **Query** (Druid SQL, ingestion MSQ), **Datasources** (rétention, compaction), **Segments**, **Supervisors**, **Tasks**, **Services**.

<!-- CAPTURE: Apache Druid — console, onglet Datasources | _assets/druid-datasources.png -->
