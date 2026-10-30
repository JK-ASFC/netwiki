---
title: Index, mappings, modèles, ILM et requêtes
description: Travailler avec les index Elasticsearch — mappings et types de champs (text, keyword, date, ip), modèles d'index composables, data streams pour les journaux, cycle de vie ILM (rollover, migration hot/warm, suppression), dimensionnement des shards, pipelines d'ingestion, et requêtes de recherche et d'agrégation.
tags: [elasticsearch, index, mapping, index template, data stream, ilm, ingest pipeline, query dsl]
icon: list-tree
---

Les exemples s'exécutent dans **Kibana → Dev Tools** ou avec `curl` (en-tête `Content-Type: application/json`).

## Mappings

```bash
curl -u elastic --cacert http_ca.crt -X PUT "https://localhost:9200/inventaire" -H 'Content-Type: application/json' -d '{
  "settings": { "number_of_shards": 1, "number_of_replicas": 1 },
  "mappings": {
    "properties": {
      "nom":        { "type": "keyword" },
      "description":{ "type": "text", "analyzer": "french" },
      "ip":         { "type": "ip" },
      "site":       { "type": "keyword" },
      "mise_en_service": { "type": "date" },
      "ports_ouverts": { "type": "integer" }
    }
  }
}'
```

| Type | Usage |
| --- | --- |
| `keyword` | Valeur exacte : filtres, tris, agrégations (noms, codes, adresses e-mail) |
| `text` | Recherche plein texte analysée (mots, racines, langue) |
| `date`, `long`, `double`, `boolean`, `ip`, `geo_point` | Types spécialisés (plages, calculs, CIDR, géographie) |
| `object` / `nested` | Sous-documents |

> [!TIP]
> Le **mapping dynamique** devine les types à la première insertion (une chaîne devient `text` + `keyword`). Pour les journaux, définissez les champs dans un **modèle** pour éviter les erreurs de type et l'**explosion du mapping** (milliers de champs).

## Modèles d'index et data streams

```bash
# Modèle de composant (réutilisable)
PUT _component_template/journaux-base
{
  "template": {
    "settings": { "number_of_shards": 1, "number_of_replicas": 1, "index.lifecycle.name": "journaux-30j" },
    "mappings": {
      "properties": {
        "@timestamp": { "type": "date" },
        "host.name":  { "type": "keyword" },
        "message":    { "type": "text" },
        "log.level":  { "type": "keyword" },
        "source.ip":  { "type": "ip" }
      }
    }
  }
}

# Modèle d'index : tout index/data stream « logs-reseau-* »
PUT _index_template/logs-reseau
{
  "index_patterns": ["logs-reseau-*"],
  "data_stream": {},
  "composed_of": ["journaux-base"],
  "priority": 200
}
```

Un **data stream** (`logs-reseau-pare-feu`) est une ressource en ajout seul répartie sur des index de support (`.ds-logs-reseau-pare-feu-2025.10.29-000001`) qui tournent automatiquement : idéal pour les journaux et métriques.

## Cycle de vie : ILM

```bash
PUT _ilm/policy/journaux-30j
{
  "policy": {
    "phases": {
      "hot":    { "actions": { "rollover": { "max_primary_shard_size": "50gb", "max_age": "1d" } } },
      "warm":   { "min_age": "7d",  "actions": { "shrink": { "number_of_shards": 1 }, "forcemerge": { "max_num_segments": 1 } } },
      "delete": { "min_age": "30d", "actions": { "delete": {} } }
    }
  }
}

GET logs-reseau-*/_ilm/explain
```

## Dimensionner les shards

| Règle | Valeur indicative |
| --- | --- |
| Taille d'un shard | 10 à 50 Go |
| Nombre de shards par nœud | Rester loin de la limite (1000 par nœud par défaut) ; moins de 20 par Go de tas |
| Répliques | 1 en général (0 sur un nœud unique, sinon état *yellow*) |
| Petits index quotidiens | À éviter : préférer le rollover par taille |

Trop de petits shards est la cause n° 1 de lenteur et d'instabilité des clusters de journaux.

## Pipelines d'ingestion

```bash
PUT _ingest/pipeline/pare-feu
{
  "processors": [
    { "grok": { "field": "message", "patterns": ["%{IP:source.ip}:%{INT:source.port} -> %{IP:destination.ip}:%{INT:destination.port} %{WORD:event.action}"] } },
    { "geoip": { "field": "source.ip", "target_field": "source.geo", "ignore_missing": true } },
    { "set": { "field": "event.dataset", "value": "pare-feu" } }
  ]
}
POST _ingest/pipeline/pare-feu/_simulate
{ "docs": [ { "_source": { "message": "198.51.100.7:51544 -> 10.0.20.15:443 allow" } } ] }
```

## Requêtes

```bash
# Recherche avec filtres
GET logs-reseau-*/_search
{
  "query": {
    "bool": {
      "must":   [ { "match": { "message": "denied" } } ],
      "filter": [
        { "term":  { "event.dataset": "pare-feu" } },
        { "range": { "@timestamp": { "gte": "now-1h" } } },
        { "term":  { "source.ip": "10.0.0.0/8" } }
      ]
    }
  },
  "size": 20,
  "sort": [ { "@timestamp": "desc" } ]
}

# Agrégation : 10 IP sources les plus bloquées
GET logs-reseau-*/_search
{
  "size": 0,
  "query": { "term": { "event.action": "deny" } },
  "aggs": { "top_ip": { "terms": { "field": "source.ip", "size": 10 } } }
}
```

| Clause | Usage |
| --- | --- |
| `match` | Plein texte (champ `text`), avec score |
| `term` / `terms` | Valeur exacte (`keyword`, `ip`, nombres) |
| `range` | Plages de dates ou de nombres |
| `bool` (`must`, `filter`, `should`, `must_not`) | Combinaison ; `filter` ne calcule pas de score et profite du cache |

Dans Kibana, **Discover** utilise KQL (`source.ip : 10.0.0.0/8 and event.action : deny`) ; **ES|QL** (8.11+) offre un langage par tubes : `FROM logs-reseau-* | WHERE event.action == "deny" | STATS n = COUNT(*) BY source.ip | SORT n DESC | LIMIT 10`.
