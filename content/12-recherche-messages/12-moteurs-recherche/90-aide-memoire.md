---
title: Moteurs de recherche — aide-mémoire
description: Ports et requêtes de Meilisearch (index, settings, search, tasks, dumps, clés), Typesense (collections, import, search, health), Sonic, Apache Solr (bin/solr, select, update), Manticore (SQL sur 9306), ZincSearch et Tantivy.
tags: [aide-mémoire, meilisearch, typesense, sonic, solr, manticore, zincsearch, tantivy]
icon: terminal
---

Explications : [[01-meilisearch-typesense-sonic|Meilisearch, Typesense et Sonic]] · [[02-solr-manticore-zinc-tantivy|Solr, Manticore, ZincSearch et Tantivy]].

| Moteur | Ports | Authentification |
| --- | --- | --- |
| Meilisearch | 7700 | `Authorization: Bearer <clé>` |
| Typesense | 8108 | `X-TYPESENSE-API-KEY` |
| Sonic | 1491 | Mot de passe du canal |
| Solr | 8983 (+ ZooKeeper 2181) | `security.json` |
| Manticore | 9306 SQL (MySQL), 9308 HTTP, 9312 interne | Réseau / proxy |
| ZincSearch | 4080 | Basic |

```bash
# Meilisearch
curl -H "Authorization: Bearer $CLE" http://127.0.0.1:7700/health
curl -H "Authorization: Bearer $CLE" http://127.0.0.1:7700/indexes
curl -H "Authorization: Bearer $CLE" "http://127.0.0.1:7700/tasks?statuses=failed"
curl -X POST -H "Authorization: Bearer $CLE" http://127.0.0.1:7700/dumps
curl -H "Authorization: Bearer $CLE" http://127.0.0.1:7700/keys

# Typesense
curl http://127.0.0.1:8108/health ; curl -H "X-TYPESENSE-API-KEY: $CLE" http://127.0.0.1:8108/collections

# Solr
bin/solr start ; bin/solr status ; bin/solr create -c c1 ; bin/solr post -c c1 docs/*.json
curl "http://127.0.0.1:8983/solr/c1/select?q=*:*&rows=0"           # nombre de documents
curl "http://127.0.0.1:8983/solr/admin/cores?action=STATUS"

# Manticore
mysql -h 127.0.0.1 -P 9306 -e "SHOW TABLES; SHOW STATUS LIKE 'uptime';"
```
