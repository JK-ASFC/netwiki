---
title: OrientDB
description: OrientDB — base multi-modèle Java (graphes et documents, Apache 2.0) : état du projet (maintenance limitée), installation (archive, Docker, Linux, Windows, macOS), server.sh et console.sh, ports 2424 (binaire) et 2480 (HTTP, OrientDB Studio), utilisateur root (orientdb-server-config.xml), SQL étendu et MATCH, classes de sommets et d'arêtes, sauvegarde (BACKUP DATABASE, EXPORT), et conseils de migration.
tags: [orientdb, graphe, document, java, multi-modèle]
icon: info
---

**OrientDB** combine documents et graphes avec un **SQL étendu** (`MATCH` pour les parcours). Après son rachat (CallidusCloud puis SAP), le projet évolue peu : on le rencontre surtout dans des applications existantes. Pour un nouveau projet, préférez [[02-arangodb|ArangoDB]], [[09-neo4j/01-presentation-installation|Neo4j]] ou une extension comme [[13-extensions-postgresql/03-apache-age|Apache AGE]].

## Installation

```bash
sudo apt install openjdk-17-jre-headless
tar xzf orientdb-community-3.2.*.tar.gz -C /opt && sudo ln -sfn /opt/orientdb-community-3.2.* /opt/orientdb
cd /opt/orientdb/bin && ./server.sh          # premier démarrage : demande le mot de passe root
docker run -d --name orientdb -p 2424:2424 -p 2480:2480 -e ORIENTDB_ROOT_PASSWORD="$MDP" orientdb:3.2
```

Windows : `server.bat` ; service via le script `installService.bat` fourni. Ports : **2480** (HTTP et **Studio**), 2424 (binaire).

```text
./console.sh
orientdb> CONNECT remote:localhost/inventaire root ****
orientdb> CREATE CLASS Equipement EXTENDS V
orientdb> CREATE CLASS Uplink EXTENDS E
orientdb> CREATE VERTEX Equipement SET nom = 'sw-coeur-01'
orientdb> MATCH {class: Equipement, as: a}-Uplink->{as: c} RETURN a.nom, c.nom
orientdb> BACKUP DATABASE /sauv/inventaire.zip
orientdb> EXPORT DATABASE /sauv/inventaire.json.gz
```

Interface : [[04-interface-graphique|interfaces graphiques]] · commandes : [[90-aide-memoire|aide-mémoire]].
