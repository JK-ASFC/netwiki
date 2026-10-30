---
title: Elasticsearch — aide-mémoire des commandes
description: Commandes Elasticsearch avec exemples via l'API REST — santé et nœuds (_cluster/health, _cat), index (création, mappings, alias, réindexation, suppression), documents et recherche (Query DSL, agrégations), modèles d'index et ILM, instantanés (dépôts, _snapshot), sécurité (utilisateurs, rôles, clés d'API, elasticsearch-reset-password, jeton d'inscription), allocation des fragments, maintenance.
tags: [aide-mémoire, elasticsearch, api, _cat, ilm, snapshot, recherche]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-installation|Elasticsearch]].

```bash
E="https://127.0.0.1:9200"; A=(-s -u elastic:"$MDP" --cacert /etc/elasticsearch/certs/http_ca.crt -H "Content-Type: application/json")
```

## Santé et nœuds

```bash
curl "${A[@]}" "$E/_cluster/health?pretty"
curl "${A[@]}" "$E/_cat/nodes?v&h=name,ip,node.role,heap.percent,cpu,load_1m,disk.used_percent"
curl "${A[@]}" "$E/_cat/indices?v&s=store.size:desc" | head
curl "${A[@]}" "$E/_cat/shards?v&h=index,shard,prirep,state,unassigned.reason" | grep -v STARTED
curl "${A[@]}" "$E/_cluster/allocation/explain?pretty"          # pourquoi un fragment n'est pas alloué
curl "${A[@]}" "$E/_cat/allocation?v"
curl "${A[@]}" "$E/_nodes/stats/jvm?filter_path=nodes.*.jvm.mem.heap_used_percent&pretty"
```

## Index

```bash
curl "${A[@]}" -X PUT "$E/inventaire" -d '{
  "settings": { "number_of_shards": 1, "number_of_replicas": 1 },
  "mappings": { "properties": { "nom": {"type": "keyword"}, "site": {"type": "keyword"}, "description": {"type": "text"}, "mise_en_service": {"type": "date"} } } }'
curl "${A[@]}" "$E/inventaire/_mapping?pretty"
curl "${A[@]}" -X POST "$E/_aliases" -d '{"actions":[{"add":{"index":"inventaire","alias":"inv"}}]}'
curl "${A[@]}" -X POST "$E/_reindex" -d '{"source":{"index":"inventaire"},"dest":{"index":"inventaire-v2"}}'
curl "${A[@]}" -X PUT "$E/inventaire/_settings" -d '{"index":{"number_of_replicas":2}}'
curl "${A[@]}" -X POST "$E/inventaire/_forcemerge?max_num_segments=1"
curl "${A[@]}" -X DELETE "$E/ancien-index"
```

## Documents et recherche

```bash
curl "${A[@]}" -X POST "$E/inventaire/_doc/sw-paris-01" -d '{"nom":"sw-paris-01","site":"Paris","description":"Commutateur de cœur"}'
curl "${A[@]}" "$E/inventaire/_doc/sw-paris-01?pretty"
curl "${A[@]}" -X POST "$E/inventaire/_update/sw-paris-01" -d '{"doc":{"site":"Lyon"}}'
curl "${A[@]}" "$E/inventaire/_search?pretty" -d '{
  "query": { "bool": { "must": [{"match": {"description": "commutateur"}}], "filter": [{"term": {"site": "Paris"}}] } },
  "size": 10, "_source": ["nom", "site"] }'
curl "${A[@]}" "$E/logs-*/_search?size=0&pretty" -d '{
  "query": {"range": {"@timestamp": {"gte": "now-1h"}}},
  "aggs": {"par_hote": {"terms": {"field": "host.name", "size": 10}}} }'
curl "${A[@]}" "$E/inventaire/_count?q=site:Paris"
curl "${A[@]}" -X POST "$E/inventaire/_delete_by_query" -d '{"query":{"term":{"site":"Ancien"}}}'
```

## Modèles et cycle de vie (ILM)

```bash
curl "${A[@]}" -X PUT "$E/_ilm/policy/logs-30j" -d '{"policy":{"phases":{
  "hot":{"actions":{"rollover":{"max_age":"1d","max_primary_shard_size":"50gb"}}},
  "warm":{"min_age":"7d","actions":{"shrink":{"number_of_shards":1},"forcemerge":{"max_num_segments":1}}},
  "delete":{"min_age":"30d","actions":{"delete":{}}}}}}'
curl "${A[@]}" -X PUT "$E/_index_template/logs-reseau" -d '{"index_patterns":["logs-reseau-*"],"data_stream":{},"template":{"settings":{"index.lifecycle.name":"logs-30j"}}}'
curl "${A[@]}" "$E/logs-reseau-*/_ilm/explain?pretty" | head -30
```

## Instantanés

```bash
curl "${A[@]}" -X PUT "$E/_snapshot/nas" -d '{"type":"fs","settings":{"location":"/mnt/snapshots"}}'   # path.repo requis
curl "${A[@]}" -X PUT "$E/_snapshot/nas/instantane-$(date +%F)?wait_for_completion=true"
curl "${A[@]}" "$E/_snapshot/nas/_all?pretty" | grep -E '"snapshot"|"state"'
curl "${A[@]}" -X POST "$E/_snapshot/nas/instantane-2026-10-29/_restore" -d '{"indices":"inventaire","rename_pattern":"(.+)","rename_replacement":"restaure-$1"}'
curl "${A[@]}" -X PUT "$E/_slm/policy/nuit" -d '{"schedule":"0 30 1 * * ?","name":"<nuit-{now/d}>","repository":"nas","retention":{"expire_after":"30d"}}'
```

## Sécurité

```bash
sudo /usr/share/elasticsearch/bin/elasticsearch-reset-password -u elastic -i
sudo /usr/share/elasticsearch/bin/elasticsearch-create-enrollment-token -s kibana
curl "${A[@]}" -X POST "$E/_security/user/amartin" -d '{"password":"MotDePasseLong2026","roles":["viewer"],"full_name":"Alice Martin"}'
curl "${A[@]}" -X POST "$E/_security/role/lecture_logs" -d '{"indices":[{"names":["logs-*"],"privileges":["read","view_index_metadata"]}]}'
curl "${A[@]}" -X POST "$E/_security/api_key" -d '{"name":"logstash-ecriture","expiration":"90d","role_descriptors":{"ecriture":{"indices":[{"names":["logs-*"],"privileges":["create_doc","auto_configure"]}]}}}'
curl "${A[@]}" "$E/_security/_authenticate?pretty"
```

## Maintenance d'un nœud

```bash
curl "${A[@]}" -X PUT "$E/_cluster/settings" -d '{"persistent":{"cluster.routing.allocation.enable":"primaries"}}'
sudo systemctl restart elasticsearch
curl "${A[@]}" -X PUT "$E/_cluster/settings" -d '{"persistent":{"cluster.routing.allocation.enable":null}}'
sudo journalctl -u elasticsearch -f
```
