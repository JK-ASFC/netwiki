---
title: Interfaces graphiques
description: Interfaces des bases de graphes — Memgraph Lab (port 3000 : éditeur Cypher, visualisation du graphe, schéma, journaux, requêtes enregistrées), outils pour JanusGraph (G.V(), Gremlin Visualizer, Graph Explorer) et Ratel pour Dgraph (console DQL et GraphQL, schéma, visualisation), avec emplacements de captures d'écran.
tags: [memgraph lab, ratel, janusgraph, interface graphique, captures]
icon: monitor
---

## Memgraph Lab (`http://<hôte>:3000`)

**Query execution** (éditeur Cypher, résultat en graphe ou tableau), **Graph schema**, **Collections** (requêtes enregistrées), **Logs**, **Streams**.

<!-- CAPTURE: Memgraph Lab — visualisation d'une topologie réseau | _assets/memgraph-lab.png -->

## JanusGraph

Pas d'interface officielle : outils compatibles Gremlin (G.V(), Gremlin Visualizer, AWS Graph Explorer) connectés au port 8182.

## Dgraph — Ratel

Console web (image `dgraph/ratel`, port 8000) : **Console** (requêtes DQL et mutations, vue graphe/JSON), **Schema**, **Cluster** (état Zero/Alpha), **Backups**.

<!-- CAPTURE: Dgraph Ratel — requête DQL et vue graphe | _assets/dgraph-ratel.png -->
