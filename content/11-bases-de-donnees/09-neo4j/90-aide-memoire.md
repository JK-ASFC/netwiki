---
title: Neo4j — aide-mémoire des commandes
description: Commandes Neo4j avec exemples — service et neo4j-admin (mot de passe initial, vérification, sauvegarde/dump et chargement, import CSV en masse), cypher-shell, requêtes Cypher (création, recherche de motifs, chemins, agrégations, mise à jour, suppression), index et contraintes, EXPLAIN/PROFILE, utilisateurs et rôles, procédures APOC, supervision.
tags: [aide-mémoire, neo4j, cypher, cypher-shell, neo4j-admin, graphe]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-installation|Neo4j]].

## Service et administration

```bash
sudo systemctl status neo4j
neo4j version
sudo neo4j-admin dbms set-initial-password 'MotDePasseLong2026'     # avant le premier démarrage
sudo neo4j-admin database dump neo4j --to-path=/srv/sauvegardes/      # base arrêtée (Community)
sudo neo4j-admin database load neo4j --from-path=/srv/sauvegardes/ --overwrite-destination=true
sudo neo4j-admin database check neo4j
sudo neo4j-admin database import full --nodes=Equipement=equipements.csv --relationships=RELIE=liens.csv neo4j    # import massif initial
sudo tail -f /var/log/neo4j/neo4j.log /var/log/neo4j/debug.log
```

## cypher-shell

```bash
cypher-shell -a neo4j://127.0.0.1:7687 -u neo4j
cypher-shell -u neo4j -p "$MDP" "MATCH (n) RETURN count(n);"
cypher-shell -u neo4j -p "$MDP" -f requetes.cypher
cypher-shell -u neo4j -p "$MDP" --format plain "SHOW DATABASES;"
```

## Cypher : topologie réseau

```cypher
CREATE (:Equipement {nom: "sw-paris-01", type: "commutateur", site: "Paris"});
CREATE (:Equipement {nom: "fw-paris", type: "pare-feu", site: "Paris"});
MATCH (a:Equipement {nom: "sw-paris-01"}), (b:Equipement {nom: "fw-paris"})
CREATE (a)-[:RELIE {port_a: "Te1/1/1", port_b: "port3", vitesse: 10}]->(b);
MERGE (e:Equipement {nom: "sw-lyon-01"}) ON CREATE SET e.type = "commutateur", e.site = "Lyon";
MATCH (e:Equipement {site: "Paris"}) RETURN e.nom, e.type ORDER BY e.nom;
MATCH (a {nom: "sw-paris-01"})-[r:RELIE]-(b) RETURN a.nom, r.port_a, b.nom;
MATCH p = shortestPath((a:Equipement {nom: "sw-paris-01"})-[:RELIE*..10]-(b:Equipement {nom: "sw-lyon-01"})) RETURN p;
MATCH (e:Equipement) RETURN e.site, count(*) AS total ORDER BY total DESC;
MATCH (e:Equipement {nom: "sw-paris-01"}) SET e.version = "17.12.4";
MATCH (e:Equipement {nom: "sw-lyon-01"}) DETACH DELETE e;
LOAD CSV WITH HEADERS FROM "file:///equipements.csv" AS ligne MERGE (:Equipement {nom: ligne.nom, site: ligne.site});
```

## Index, contraintes, plans

```cypher
CREATE CONSTRAINT equipement_nom IF NOT EXISTS FOR (e:Equipement) REQUIRE e.nom IS UNIQUE;
CREATE INDEX equipement_site IF NOT EXISTS FOR (e:Equipement) ON (e.site);
SHOW INDEXES;
SHOW CONSTRAINTS;
EXPLAIN MATCH (e:Equipement {site: "Paris"}) RETURN e;
PROFILE MATCH (e:Equipement {site: "Paris"}) RETURN e;
```

## Utilisateurs et rôles (selon édition)

```cypher
CREATE USER amartin SET PASSWORD 'MotDePasseInitial' CHANGE REQUIRED;
SHOW USERS;
ALTER USER amartin SET STATUS SUSPENDED;
GRANT ROLE reader TO amartin;          // rôles fins : édition Enterprise
SHOW CURRENT USER;
```

## Supervision

```cypher
SHOW TRANSACTIONS;
TERMINATE TRANSACTIONS "neo4j-transaction-42";
CALL dbms.components();
CALL apoc.meta.stats();                 // avec le greffon APOC
```
