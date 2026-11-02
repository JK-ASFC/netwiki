---
title: SurrealDB
description: SurrealDB — base multi-modèle (documents, graphes, relationnel, temps réel) écrite en Rust, licence BSL 1.1 : installation (script, Windows, Homebrew, Docker), stockages (mémoire, RocksDB, SurrealKV, TiKV en cluster), surreal start, utilisateurs root et accès, espaces de noms et bases, SurrealQL (tables, RELATE pour les graphes, LIVE SELECT), permissions au niveau des tables, export et import, Surrealist (interface graphique).
tags: [surrealdb, multi-modèle, surrealql, graphe, document, rust]
icon: info
---

**SurrealDB** réunit dans un seul serveur des tables de **documents**, des **relations de graphe** (`RELATE`), des requêtes **temps réel** et une couche d'autorisations pour exposer la base directement à des applications web. Projet récent, sous **BSL 1.1** (pas d'offre concurrente en service géré).

## Installation

| Système | Commande |
| --- | --- |
| Linux, macOS | `curl -sSf https://install.surrealdb.com \| sh` |
| Windows | `iwr https://windows.surrealdb.com -useb \| iex` |
| macOS | `brew install surrealdb/tap/surreal` |
| Docker | `surrealdb/surrealdb:latest` |

```bash
surreal start --bind 127.0.0.1:8000 --user root --pass "$MDP" rocksdb:/srv/surrealdb/data
surreal sql --endpoint http://127.0.0.1:8000 --username root --password "$MDP" --namespace corp --database inventaire
```

Stockages : `memory` (test), `rocksdb:` ou `surrealkv:` (un nœud), `tikv://` (cluster distribué sur TiKV).

## SurrealQL

```sql
DEFINE TABLE equipement SCHEMAFULL;
DEFINE FIELD nom ON equipement TYPE string;
DEFINE FIELD site ON equipement TYPE string;
CREATE equipement:sw_coeur_01 SET nom = 'sw-coeur-01', site = 'paris';
CREATE equipement:sw_acces_01 SET nom = 'sw-acces-01', site = 'paris';
RELATE equipement:sw_acces_01->uplink->equipement:sw_coeur_01 SET port = 'Gi1/0/49';
SELECT ->uplink->equipement.nom AS amont FROM equipement:sw_acces_01;
LIVE SELECT * FROM equipement WHERE site = 'paris';
```

```bash
surreal export --endpoint http://127.0.0.1:8000 -u root -p "$MDP" --ns corp --db inventaire sauvegarde.surql
surreal import --endpoint http://127.0.0.1:8000 -u root -p "$MDP" --ns corp --db inventaire sauvegarde.surql
```

Suite : [[02-arangodb|ArangoDB]] · [[03-orientdb|OrientDB]] · [[04-interface-graphique|interfaces graphiques]] · [[90-aide-memoire|aide-mémoire]].
