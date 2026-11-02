---
title: Interfaces graphiques
description: Consoles web des bases SQL distribuées — CockroachDB DB Console (port 8080 : Overview, Metrics, Databases, SQL Activity, Jobs), YugabyteDB (interface yugabyted 15433, YB-Master 7000) et TiDB Dashboard (PD 2379/dashboard : Cluster Info, SQL Statements, Slow Queries, Key Visualizer), avec emplacements de captures d'écran.
tags: [cockroachdb, yugabytedb, tidb, interface graphique, captures]
icon: monitor
---

## CockroachDB — DB Console (`https://<nœud>:8080`)

**Overview** (nœuds, capacité, plages sous-répliquées), **Metrics** (SQL, stockage, réplication), **Databases**, **SQL Activity** (requêtes et transactions, plans), **Jobs** (sauvegardes, changements de schéma), **Advanced Debug**.

<!-- CAPTURE: CockroachDB — DB Console, vue d'ensemble du cluster | _assets/cockroachdb-console.png -->

## YugabyteDB (`http://<nœud>:15433`)

Interface **yugabyted** : état du cluster, nœuds, placement, requêtes lentes, migrations (Voyager). Interfaces techniques : YB-Master `:7000` (tablettes, tables), YB-TServer `:9000`.

<!-- CAPTURE: YugabyteDB — interface yugabyted | _assets/yugabytedb-ui.png -->

## TiDB Dashboard (`http://<pd>:2379/dashboard`)

**Cluster Info**, **SQL Statements**, **Slow Queries**, **Key Visualizer** (zones chaudes), diagnostics et rapports, profilage.

<!-- CAPTURE: TiDB Dashboard — requêtes lentes | _assets/tidb-dashboard.png -->
