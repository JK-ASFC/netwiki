---
title: Présentation, installation et Cypher
description: Neo4j, base de données orientée graphes — modèle (nœuds, relations, propriétés, étiquettes), éditions Community et Enterprise, versions, installation (dépôt Debian/RHEL, Docker, Windows et Neo4j Desktop, macOS), ports 7474, 7473 et 7687, neo4j.conf, premier accès et mot de passe, langage Cypher (création, requêtes de chemins, index et contraintes, import CSV), exemple de modélisation d'une infrastructure réseau et usages (dépendances, BloodHound).
tags: [neo4j, graphe, cypher, base de données, installation, modélisation, bloodhound]
icon: info
---

**Neo4j** est une base de données **orientée graphes** : les données sont des **nœuds** reliés par des **relations**, toutes deux porteuses de propriétés. Les requêtes qui suivent des liens sur plusieurs niveaux (« quels services dépendent de ce commutateur ? », « quel chemin d'attaque mène aux administrateurs du domaine ? ») y sont naturelles et rapides, alors qu'elles demandent des jointures récursives coûteuses en SQL.

Usages en infrastructure : **cartographie des dépendances** (applications → serveurs → VM → hôtes → baies → commutateurs), topologie réseau, analyse d'impact, gestion des droits ; outils de sécurité comme **BloodHound** (chemins d'attaque Active Directory) reposent sur Neo4j.

## Éditions

| Édition | Licence | Points clés |
| --- | --- | --- |
| **Community** | GPLv3 | Une base utilisateur, pas de cluster, sauvegarde hors ligne |
| **Enterprise** | Commerciale | Plusieurs bases, cluster (*Autonomous Clustering*), sauvegarde à chaud, contrôle d'accès fin (RBAC), sécurité avancée |
| AuraDB | Service cloud | Hébergé par Neo4j |

Neo4j numérote désormais ses versions par le **calendrier** (`2025.x`) après la série 5.x ; vérifiez la version de Java requise (17 ou 21 selon la version).

## Installation

```bash
# Debian / Ubuntu (dépôt officiel)
wget -O - https://debian.neo4j.com/neotechnology.gpg.key | sudo gpg --dearmor -o /usr/share/keyrings/neo4j.gpg
echo "deb [signed-by=/usr/share/keyrings/neo4j.gpg] https://debian.neo4j.com stable latest" | sudo tee /etc/apt/sources.list.d/neo4j.list
sudo apt update && sudo apt install neo4j
sudo systemctl enable --now neo4j

# RHEL : dépôt yum.neo4j.com, paquet neo4j
# Docker
docker run -d --name neo4j -p 127.0.0.1:7474:7474 -p 127.0.0.1:7687:7687 \
  -v neo4j-data:/data -e NEO4J_AUTH=neo4j/MotDePasseTresLong neo4j:5
```

Windows : archive ZIP (service avec `neo4j windows-service install`) ou **Neo4j Desktop** (développement) ; macOS : Neo4j Desktop ou `brew install neo4j`.

| Port | Usage |
| --- | --- |
| **7474** | HTTP (Neo4j Browser, API) |
| 7473 | HTTPS |
| **7687** | **Bolt** (protocole binaire des pilotes et outils) |

```properties /etc/neo4j/neo4j.conf (extraits)
server.default_listen_address=127.0.0.1
server.bolt.listen_address=:7687
server.http.listen_address=:7474
server.memory.heap.initial_size=2g
server.memory.heap.max_size=2g
server.memory.pagecache.size=4g
dbms.security.auth_enabled=true
```

`neo4j-admin server memory-recommendation` propose des valeurs de tas et de cache de pages selon la RAM. Au premier accès (Neo4j Browser `http://localhost:7474`, ou `cypher-shell`), le mot de passe initial `neo4j` doit être **changé**.

```bash
cypher-shell -a neo4j://127.0.0.1:7687 -u neo4j -p 'MotDePasseTresLong'
```

## Cypher

```cypher Modéliser une partie de l'infrastructure
CREATE CONSTRAINT equipement_nom IF NOT EXISTS FOR (e:Equipement) REQUIRE e.nom IS UNIQUE;
CREATE CONSTRAINT serveur_nom IF NOT EXISTS FOR (s:Serveur) REQUIRE s.nom IS UNIQUE;

MERGE (coeur:Equipement {nom: "sw-coeur-paris", type: "commutateur"})
MERGE (acces:Equipement {nom: "sw-acces-b2", type: "commutateur"})
MERGE (hv:Serveur {nom: "srv-hv-02"})
MERGE (vm:Serveur {nom: "srv-app-01"})
MERGE (app:Application {nom: "ERP", criticite: "haute"})
MERGE (acces)-[:UPLINK {port: "Te1/1/1"}]->(coeur)
MERGE (hv)-[:CONNECTE_A {port: "Gi1/0/12"}]->(acces)
MERGE (vm)-[:HEBERGE_PAR]->(hv)
MERGE (app)-[:TOURNE_SUR]->(vm);
```

```cypher Analyse d'impact : applications touchées par la panne d'un commutateur
MATCH (e:Equipement {nom: "sw-acces-b2"})<-[*1..4]-(a:Application)
RETURN DISTINCT a.nom AS application, a.criticite AS criticite
ORDER BY criticite;
```

```cypher Plus court chemin entre deux éléments
MATCH p = shortestPath((a:Serveur {nom: "srv-app-01"})-[*..10]-(b:Equipement {nom: "sw-coeur-paris"}))
RETURN p;
```

```cypher Import depuis un CSV (fichier placé dans le répertoire import/)
LOAD CSV WITH HEADERS FROM 'file:///serveurs.csv' AS ligne
MERGE (s:Serveur {nom: ligne.nom})
SET s.os = ligne.os, s.site = ligne.site;
```

| Élément | Rôle |
| --- | --- |
| `MATCH` / `MERGE` / `CREATE` | Rechercher / créer si absent / créer |
| `-[:TYPE]->`, `-[*1..4]-` | Relation typée, chemin de longueur variable |
| Contraintes et index | Unicité, performances des recherches |
| **APOC** | Bibliothèque de procédures (import JSON/API, utilitaires) — à installer et restreindre |

Les données peuvent être alimentées automatiquement depuis NetBox, l'hyperviseur ou la CMDB par un script (pilote Python `neo4j`).

Suite : [[02-securite-exploitation|sécurité, sauvegarde et exploitation]].
