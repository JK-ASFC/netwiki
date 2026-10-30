---
title: CouchDB — aide-mémoire des commandes
description: Commandes CouchDB avec exemples via l'API HTTP — état et nœuds (/_up, /_membership, /_node/_local/_config), bases (création, informations, compaction, suppression), documents (création, lecture, révision, suppression, _all_docs, _bulk_docs), requêtes Mango (_find, index), vues, réplication (_replicate, _replicator), utilisateurs et sécurité (_users, _security), sauvegarde, interface Fauxton.
tags: [aide-mémoire, couchdb, api, mango, réplication, nosql]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-installation|CouchDB]]. Interface graphique : **Fauxton** (`http://127.0.0.1:5984/_utils`).

```bash
C="http://admin:${MDP}@127.0.0.1:5984"
```

## État et configuration

```bash
curl -s $C/ | jq .version
curl -s $C/_up
curl -s $C/_membership | jq .
curl -s $C/_node/_local/_config/couchdb | jq .
curl -s -X PUT $C/_node/_local/_config/log/level -d '"info"'
curl -s $C/_active_tasks | jq .
curl -s $C/_node/_local/_stats/couchdb/request_time | jq .value
```

## Bases

```bash
curl -s -X PUT $C/inventaire
curl -s $C/_all_dbs | jq .
curl -s $C/inventaire | jq '{doc_count, sizes}'
curl -s -X POST -H "Content-Type: application/json" $C/inventaire/_compact
curl -s -X POST -H "Content-Type: application/json" $C/inventaire/_view_cleanup
curl -s -X DELETE $C/ancienne-base
```

## Documents

```bash
curl -s -X PUT $C/inventaire/sw-paris-01 -H "Content-Type: application/json" -d '{"type":"commutateur","modele":"C9300","site":"Paris"}'
curl -s $C/inventaire/sw-paris-01 | jq .
REV=$(curl -s $C/inventaire/sw-paris-01 | jq -r ._rev)
curl -s -X PUT "$C/inventaire/sw-paris-01" -H "Content-Type: application/json" -d "{\"_rev\":\"$REV\",\"type\":\"commutateur\",\"modele\":\"C9300\",\"site\":\"Paris\",\"baie\":\"B3\"}"
curl -s -X DELETE "$C/inventaire/sw-paris-01?rev=$REV"
curl -s "$C/inventaire/_all_docs?include_docs=true&limit=5" | jq '.rows[].doc'
curl -s -X POST $C/inventaire/_bulk_docs -H "Content-Type: application/json" -d '{"docs":[{"_id":"fw-paris","type":"pare-feu"},{"_id":"fw-lyon","type":"pare-feu"}]}'
```

## Requêtes Mango et index

```bash
curl -s -X POST $C/inventaire/_index -H "Content-Type: application/json" -d '{"index":{"fields":["type","site"]},"name":"type-site"}'
curl -s -X POST $C/inventaire/_find -H "Content-Type: application/json" \
  -d '{"selector":{"type":"commutateur","site":"Paris"},"fields":["_id","modele"],"limit":20}' | jq .docs
curl -s -X POST $C/inventaire/_explain -H "Content-Type: application/json" -d '{"selector":{"type":"commutateur"}}' | jq .index
```

## Réplication

```bash
curl -s -X POST $C/_replicate -H "Content-Type: application/json" \
  -d "{\"source\":\"$C/inventaire\",\"target\":\"http://admin:${MDP}@couch2.exemple.fr:5984/inventaire\",\"create_target\":true}"
curl -s -X PUT $C/_replicator/inventaire-vers-couch2 -H "Content-Type: application/json" \
  -d "{\"source\":\"$C/inventaire\",\"target\":\"http://admin:${MDP}@couch2.exemple.fr:5984/inventaire\",\"continuous\":true}"
curl -s $C/_scheduler/jobs | jq '.jobs[] | {id, source, target}'
```

## Utilisateurs et sécurité

```bash
curl -s -X PUT $C/_users/org.couchdb.user:app -H "Content-Type: application/json" -d '{"name":"app","password":"MotDePasseLong2026","roles":["inventaire_rw"],"type":"user"}'
curl -s -X PUT $C/inventaire/_security -H "Content-Type: application/json" -d '{"admins":{"names":[],"roles":["admin_inventaire"]},"members":{"names":[],"roles":["inventaire_rw"]}}'
curl -s $C/inventaire/_security | jq .
```

## Sauvegarde

```bash
# Les fichiers .couch sont en ajout seul : copie possible à chaud (répertoire data), ou réplication vers une instance de sauvegarde
sudo tar czf /srv/sauvegardes/couchdb-$(date +%F).tar.gz -C /opt/couchdb data
```
