---
title: Interfaces graphiques
description: Consoles web de Trino (port 8080/ui : requêtes en cours, plans, workers, utilisation des ressources) et d'Apache Drill (port 8047 : Query, Profiles, Storage, Metrics, Threads), avec emplacements de captures d'écran.
tags: [trino, presto, apache drill, interface graphique, captures]
icon: monitor
---

## Trino / Presto (`http://<coordinateur>:8080/ui/`)

Tableau de bord : requêtes en cours, en file, terminées et en échec, workers actifs, débit. Détail d'une requête : plan, étapes, temps passé par opérateur, erreurs. Les requêtes s'écrivent dans un client SQL (CLI `trino`, DBeaver, Superset).

<!-- CAPTURE: Trino — interface web, liste des requêtes | _assets/trino-ui.png -->

## Apache Drill (`http://<hôte>:8047`)

**Query** (éditeur SQL), **Profiles** (plans et durées), **Storage** (plugins), **Metrics**, **Threads**, **Logs**, **Options**.

<!-- CAPTURE: Apache Drill — onglet Storage | _assets/drill-storage.png -->
