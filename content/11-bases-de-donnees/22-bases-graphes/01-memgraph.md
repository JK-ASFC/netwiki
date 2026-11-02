---
title: Memgraph
description: Memgraph — base de graphes en mémoire compatible Cypher et protocole Bolt (Neo4j) : licences (Community sous BSL, Enterprise), installation (Docker memgraph-mage avec algorithmes, paquets Debian/Ubuntu et RHEL, Windows et macOS via Docker), ports 7687 (Bolt) et 7444 (journaux), Memgraph Lab (interface, port 3000), mgconsole, persistance (instantanés, WAL), utilisateurs, flux Kafka, bibliothèque MAGE (PageRank, plus courts chemins), sauvegarde et cas d'usage réseau.
tags: [memgraph, graphe, cypher, bolt, neo4j, en mémoire]
icon: info
---

**Memgraph** garde le graphe **en mémoire** (avec instantanés et journal sur disque) pour des parcours très rapides, en parlant **Cypher** et le protocole **Bolt** : les pilotes et outils de [[09-neo4j/01-presentation-installation|Neo4j]] fonctionnent. Licence Community sous **BSL** ; fonctions de sécurité avancées et réplication automatique en Enterprise.

## Installation

```bash
docker run -d --name memgraph -p 7687:7687 -p 7444:7444 -v mg_data:/var/lib/memgraph memgraph/memgraph-mage   # avec la bibliothèque MAGE
docker run -d --name memgraph-lab -p 3000:3000 -e QUICK_CONNECT_MG_HOST=memgraph memgraph/lab
# Debian/Ubuntu : paquet .deb depuis memgraph.com/download, puis
sudo apt install ./memgraph_*_amd64.deb && sudo systemctl enable --now memgraph
```

Windows et macOS : Docker. Configuration : `/etc/memgraph/memgraph.conf` (`--bolt-address`, `--storage-snapshot-interval-sec`, `--storage-wal-enabled`, `--memory-limit`).

## Utilisation

```bash
mgconsole --host 127.0.0.1 --port 7687 --username admin --password "$MDP"
```

```text
CREATE USER admin IDENTIFIED BY 'MdpGraphe2026';
CREATE (:Equipement {nom: 'sw-coeur-01'})<-[:UPLINK {port: 'Gi1/0/49'}]-(:Equipement {nom: 'sw-acces-01'});
MATCH (a:Equipement)-[:UPLINK*1..3]->(c:Equipement {nom: 'sw-coeur-01'}) RETURN a.nom;
CALL pagerank.get() YIELD node, rank RETURN node.nom, rank ORDER BY rank DESC LIMIT 5;
CREATE SNAPSHOT;
```

Le premier utilisateur créé active l'authentification. Sauvegarde : `CREATE SNAPSHOT;` puis copier `/var/lib/memgraph/snapshots`. Interface : [[04-interface-graphique|Memgraph Lab]] · suite : [[02-janusgraph|JanusGraph]] · [[90-aide-memoire|aide-mémoire]].
