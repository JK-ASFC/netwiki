---
title: Interfaces graphiques
description: Consoles des grilles en mémoire — Hazelcast Management Center (port 8080 : membres, cartes, clients, SQL, alertes), Apache Ignite (Control Center commercial, GridGain, outils tiers ; JMX), Geode Pulse (port 7070) et VoltDB Management Center (port 8080), avec emplacements de captures d'écran.
tags: [hazelcast management center, ignite, geode pulse, voltdb, interface graphique, captures]
icon: monitor
---

## Hazelcast Management Center (`http://<hôte>:8080`)

Ajouter le cluster (nom et adresses des membres), puis : **Members** (mémoire, CPU, partitions), **Storage → Maps** (entrées, hits, mémoire), **Clients**, **SQL Browser**, **Alerts**. Gratuit jusqu'à un nombre limité de membres.

<!-- CAPTURE: Hazelcast Management Center — vue des membres du cluster | _assets/hazelcast-mc.png -->

## Apache Ignite

Pas de console libre maintenue : supervision par **JMX** (VisualVM, JDK Mission Control), métriques (OpenCensus/Prometheus), `control.sh`. Consoles commerciales : GridGain Control Center.

## Geode Pulse et VoltDB

- **Pulse** (`gfsh> start pulse`, port 7070) : membres, régions, débit, requêtes OQL.
- **VoltDB Management Center** (`http://<nœud>:8080`) : état du cluster, latence, SQL.

<!-- CAPTURE: Geode Pulse — vue du cluster | _assets/geode-pulse.png -->
