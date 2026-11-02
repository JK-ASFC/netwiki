---
title: Apache Geode et VoltDB
description: Apache Geode (ex-GemFire libre : locators, serveurs, régions, gfsh, Pulse ; activité réduite) et VoltDB / Volt Active Data (base SQL en mémoire ACID pour le transactionnel temps réel ; fin de l'édition communautaire libre, versions historiques AGPL) : architecture, installation, commandes principales, état des projets et alternatives.
tags: [apache geode, gemfire, voltdb, en mémoire, gfsh, transactionnel]
icon: info
---

## Apache Geode

**Geode** est la version libre de **GemFire** (VMware/Broadcom) : grille de données en mémoire avec des **locators** (découverte, port 10334) et des **serveurs** hébergeant des **régions** (cartes répliquées ou partitionnées). Le projet évolue peu ; GemFire commercial poursuit son développement. On le rencontre dans des applications Spring (Spring Data Geode) existantes.

```bash
tar xzf apache-geode-*.tgz -C /opt && export PATH=/opt/apache-geode-*/bin:$PATH     # Java 8 ou 11
gfsh
```

```text
gfsh> start locator --name=loc1 --bind-address=10.0.20.261
gfsh> start server --name=srv1 --locators=10.0.20.261[10334] --server-port=40404
gfsh> create region --name=sessions --type=PARTITION_REDUNDANT
gfsh> list members ; describe region --name=sessions ; status server --name=srv1
gfsh> start pulse              # interface web de supervision (port 7070)
```

## VoltDB (Volt Active Data)

**VoltDB** est une base **SQL en mémoire** ACID conçue pour des millions de transactions par seconde (télécoms, facturation temps réel, fraude), avec procédures stockées Java et réplication. L'éditeur (**Volt Active Data**) a arrêté l'édition communautaire libre : seules d'anciennes versions AGPL restent disponibles, sans correctifs. Pour un nouveau projet, préférez une base maintenue ([[12-sql-distribue/03-tidb|TiDB]], [[01-ignite-hazelcast|Ignite]]) ou l'offre commerciale.

```bash
voltdb init --dir=/srv/voltdb --config=deploiement.xml
voltdb start --dir=/srv/voltdb --host=10.0.20.271,10.0.20.272,10.0.20.273 --count=3
sqlcmd --servers=10.0.20.271
voltadmin status ; voltadmin save /sauv/volt instantane ; voltadmin pause ; voltadmin resume
```

Interface : [[03-interface-graphique|interfaces graphiques]] · commandes : [[90-aide-memoire|aide-mémoire]].
