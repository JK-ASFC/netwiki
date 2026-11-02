---
title: ArangoDB
description: ArangoDB — base multi-modèle (documents JSON, graphes, clé-valeur, recherche) avec le langage AQL : licences (BSL 1.1 pour le code source et licence Community limitée en volume pour les binaires depuis la 3.12), installation (dépôt pour Debian/Ubuntu et RHEL, Windows, macOS, Docker), arangod, port 8529, interface web, arangosh, collections et graphes nommés, AQL, utilisateurs, sauvegarde arangodump et arangorestore, import, déploiement en cluster avec ArangoDB Starter.
tags: [arangodb, multi-modèle, aql, graphe, document, nosql]
icon: info
---

**ArangoDB** stocke des documents JSON et des **arêtes** reliant ces documents : une seule requête **AQL** peut filtrer des documents puis parcourir un graphe. Interface web complète sur le port **8529**.

> [!NOTE]
> Depuis la version 3.12, le code source est sous **BSL 1.1** et les binaires Community sous une licence propre qui limite l'usage gratuit (taille de données en production). Vérifiez les conditions ; les versions antérieures à 3.12 étaient sous Apache 2.0.

## Installation

```bash
# Debian/Ubuntu : dépôt download.arangodb.com (clé Release.key et sources selon la version), puis
sudo apt install arangodb3          # demande le mot de passe root ; service arangodb3
docker run -d -p 8529:8529 -e ARANGO_ROOT_PASSWORD="$MDP" arangodb/arangodb
```

Windows : installeur ou ZIP ; macOS : `.dmg` ou Docker. Configuration : `/etc/arangodb3/arangod.conf` (`endpoint = tcp://127.0.0.1:8529`, chemins, authentification).

## Utilisation

```bash
arangosh --server.endpoint tcp://127.0.0.1:8529 --server.username root
```

```js
// arangosh
db._createDatabase("inventaire");
db._useDatabase("inventaire");
db._create("equipements");
db._createEdgeCollection("uplinks");
db.equipements.save({ _key: "sw_coeur_01", nom: "sw-coeur-01", site: "paris" });
db.equipements.save({ _key: "sw_acces_01", nom: "sw-acces-01", site: "paris" });
db.uplinks.save({ _from: "equipements/sw_acces_01", _to: "equipements/sw_coeur_01", port: "Gi1/0/49" });
db._query("FOR v, e IN 1..3 INBOUND 'equipements/sw_coeur_01' uplinks RETURN v.nom").toArray();
```

```bash
arangodump --server.database inventaire --output-directory /sauv/arango-$(date +%F) --server.password "$MDP"
arangorestore --server.database inventaire --input-directory /sauv/arango-2026-11-02 --create-database true --server.password "$MDP"
arangoimport --file equipements.csv --type csv --collection equipements --server.database inventaire
```

Cluster : **ArangoDB Starter** (`arangodb --starter.join srv1,srv2,srv3`) ou opérateur Kubernetes. Suite : [[03-orientdb|OrientDB]] · [[90-aide-memoire|aide-mémoire]].
