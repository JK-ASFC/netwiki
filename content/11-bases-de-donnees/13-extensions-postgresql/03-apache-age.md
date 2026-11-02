---
title: Apache AGE
description: Apache AGE — extension PostgreSQL (Apache 2.0) ajoutant les graphes et le langage openCypher dans la même base que les données relationnelles : versions de PostgreSQL prises en charge, installation (compilation, paquets communautaires, Docker apache/age), chargement (CREATE EXTENSION, LOAD, search_path), create_graph, requêtes cypher() dans SQL, type agtype, exemple de topologie réseau, AGE Viewer et limites.
tags: [apache age, postgresql, graphe, cypher, opencypher, extension]
icon: info
---

**Apache AGE** (*A Graph Extension*) permet d'écrire des requêtes **openCypher** (le langage de [[09-neo4j/01-presentation-installation|Neo4j]]) dans [[02-postgresql/01-presentation|PostgreSQL]] et de les mélanger au SQL : utile pour modéliser une **topologie réseau** ou des dépendances applicatives à côté de l'inventaire relationnel.

## Installation

```bash
# Compilation pour la version de PostgreSQL installée (branche correspondante, ex. PG17)
sudo apt install postgresql-server-dev-17 build-essential flex bison
git clone --branch PG17 https://github.com/apache/age.git && cd age
make PG_CONFIG=/usr/lib/postgresql/17/bin/pg_config && sudo make install PG_CONFIG=/usr/lib/postgresql/17/bin/pg_config
# Test rapide : docker run -d -e POSTGRES_PASSWORD=test -p 5455:5432 apache/age
```

Windows et macOS : via Docker (pas de paquet officiel).

## Utilisation

```sql
CREATE EXTENSION age;
LOAD 'age';
SET search_path = ag_catalog, "$user", public;
SELECT create_graph('reseau');

SELECT * FROM cypher('reseau', $$
  CREATE (c:Coeur {nom: 'sw-coeur-01'}), (a1:Acces {nom: 'sw-acces-01'}), (a2:Acces {nom: 'sw-acces-02'}),
         (a1)-[:UPLINK {port: 'Gi1/0/49'}]->(c), (a2)-[:UPLINK {port: 'Gi1/0/49'}]->(c)
$$) AS (r agtype);

-- Quels commutateurs d'accès perdent leur uplink si le cœur tombe ?
SELECT * FROM cypher('reseau', $$
  MATCH (a:Acces)-[:UPLINK]->(:Coeur {nom: 'sw-coeur-01'}) RETURN a.nom
$$) AS (nom agtype);
```

`LOAD 'age'` et le `search_path` sont à refaire à chaque session (ou à mettre dans `session_preload_libraries` et la configuration du rôle). Visualisation : **AGE Viewer** (application web du projet).

Commandes : [[90-aide-memoire|aide-mémoire]].
