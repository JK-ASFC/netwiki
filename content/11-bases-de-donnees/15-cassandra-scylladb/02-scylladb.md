---
title: ScyllaDB
description: ScyllaDB — base compatible Cassandra (CQL, nodetool) réécrite en C++ avec une architecture par cœur (shard-per-core) pour des latences faibles et prévisibles : changement de licence en 2025 (version unique source-available), installation (script get.scylladb.com, dépôts, Docker, AMI), scylla_setup et réglages système, scylla.yaml, cqlsh, nodetool, Scylla Manager (réparations, sauvegardes), Scylla Monitoring Stack, et migration depuis Cassandra.
tags: [scylladb, cassandra, cql, nosql, faible latence]
icon: info
---

**ScyllaDB** parle le même protocole et le même CQL qu'[[01-cassandra|Apache Cassandra]] : les pilotes, `cqlsh` et la plupart des outils fonctionnent tels quels, avec beaucoup moins de nœuds pour la même charge.

> [!WARNING]
> Depuis 2025, ScyllaDB n'est plus publié en édition open source distincte : une version unique est diffusée sous licence *source-available*, gratuite jusqu'à un certain volume, payante au-delà. Les anciennes versions open source (jusqu'à 6.2) restent sous AGPL mais ne reçoivent plus de correctifs. Vérifiez les conditions avant de déployer.

## Installation

```bash
curl -sSf get.scylladb.com/server | sudo bash          # ajoute le dépôt et installe (Debian, Ubuntu, RHEL, Rocky)
sudo scylla_setup                                        # réglages noyau, disques (XFS), réseau, IO — interactif
sudo systemctl enable --now scylla-server
nodetool status ; cqlsh 10.0.20.111
```

Docker : `scylladb/scylla` (avec `--smp` et `--memory` pour limiter les ressources). Linux uniquement en production.

`/etc/scylla/scylla.yaml` reprend les clés de Cassandra (`cluster_name`, `seeds`, `listen_address`, `rpc_address`, `endpoint_snitch`). **Scylla Manager** planifie réparations et sauvegardes vers S3 (`sctool repair`, `sctool backup`) ; la **Scylla Monitoring Stack** (Prometheus + Grafana) fournit les tableaux de bord.

Commandes : [[90-aide-memoire|aide-mémoire]].
