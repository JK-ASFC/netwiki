---
title: Interfaces graphiques
description: Interfaces des bases documentaires — console web Couchbase (port 8091 : Dashboard, Servers, Buckets, Query Workbench, Indexes, Security, XDCR), RavenDB Studio (bases, documents, index, requêtes RQL, tâches, cluster) et interface web de RethinkDB (port 8080 : Dashboard, Tables, Servers, Data Explorer) ; FerretDB s'administre avec les outils MongoDB (Compass). Emplacements de captures d'écran.
tags: [couchbase, ravendb, rethinkdb, ferretdb, interface graphique, captures]
icon: monitor
---

## Couchbase (`http://<hôte>:8091`)

**Dashboard**, **Servers** (ajout, rééquilibrage, retrait), **Buckets**, **Query** (Workbench SQL++ avec plan d'exécution), **Indexes**, **Search**, **Security** (utilisateurs et rôles), **XDCR**, **Logs**.

<!-- CAPTURE: Couchbase — Query Workbench | _assets/couchbase-query.png -->

## RavenDB Studio

Bases de données, **Documents** (éditeur JSON), **Indexes**, **Query** (RQL), **Tasks** (sauvegardes, réplication, ETL), **Manage Server** (cluster, certificats, journaux, licence).

<!-- CAPTURE: RavenDB — Studio, liste des documents d'une collection | _assets/ravendb-studio.png -->

## RethinkDB (`http://<hôte>:8080`)

**Dashboard** (état du cluster), **Tables** (répliques et shards), **Servers**, **Data Explorer** (ReQL interactif), **Logs**.

<!-- CAPTURE: RethinkDB — Data Explorer | _assets/rethinkdb-explorer.png -->

## FerretDB

Pas d'interface propre : **MongoDB Compass** ou `mongosh` s'y connectent comme à MongoDB ; côté stockage, les outils PostgreSQL (pgAdmin).
