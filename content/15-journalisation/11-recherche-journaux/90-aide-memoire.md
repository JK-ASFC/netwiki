---
title: OpenSearch, Quickwit et VictoriaLogs — aide-mémoire
description: Commandes de recherche de journaux — API OpenSearch/Elasticsearch (_cat/health, _cat/indices, _cat/nodes, _search, _bulk, _reindex, ISM), Quickwit (run, index create/list/describe/delete/ingest/search, source, tool gc), VictoriaLogs (insert jsonline, elasticsearch bulk, select logsql query, field_names, streams, LogsQL courant) avec exemples.
tags: [aide-mémoire, opensearch, quickwit, victorialogs, logsql]
icon: terminal
---

Explications : [[01-alternatives-elk|alternatives à ELK]] · [[02-quickwit-victorialogs|Quickwit et VictoriaLogs]].

```bash
curl -sku admin:$MDP "https://os:9200/_cat/health?v" ; curl -sku admin:$MDP "https://os:9200/_cat/indices?v&s=store.size:desc" | head
curl -sku admin:$MDP "https://os:9200/nginx-*/_search?q=status:500&size=5" | jq '.hits.hits[]._source'
curl -sku admin:$MDP -XPOST "https://os:9200/_reindex" -H 'Content-Type: application/json' -d '{"source":{"index":"ancien"},"dest":{"index":"nouveau"}}'
./quickwit index list ; ./quickwit index describe --index journaux-nginx ; ./quickwit index delete --index test --yes ; ./quickwit tool gc --index journaux-nginx
curl -s 'http://vl:9428/select/logsql/query' -d 'query=_time:15m error' ; curl -s 'http://vl:9428/select/logsql/field_names' -d 'query=_time:1h'
```

LogsQL : `_time:1h app:nginx` · `"timeout" -healthcheck` · `_stream:{host="srv-web-01"}` · `| stats by (app) count()` · `| sort by (_time desc) | limit 20`.
