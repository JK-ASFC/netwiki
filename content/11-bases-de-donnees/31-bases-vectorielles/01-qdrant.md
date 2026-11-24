---
title: Qdrant
description: Qdrant — base de données vectorielle open source (Rust, Apache 2.0) pour la recherche sémantique et le RAG : installation (Docker, binaire, Helm Kubernetes, Qdrant Cloud), API REST (6333) et gRPC (6334), collections et métriques de distance (Cosine, Dot, Euclid, Manhattan), insertion de points avec charge utile (payload), index HNSW et ses paramètres, recherche et recherche par lots, filtrage par payload et index de payload, quantification (scalaire, binaire, produit), instantanés, multitenancy, alias, API key et exploitation.
tags: [qdrant, base vectorielle, embeddings, rag, hnsw, recherche sémantique]
icon: info
---

**Qdrant** (Rust, Apache 2.0) est une base **vectorielle** dédiée : elle stocke des vecteurs (*embeddings*) avec une **charge utile** JSON (métadonnées) et retrouve les plus proches voisins avec un **filtrage** riche. On l'emploie pour la recherche sémantique, le RAG, la recommandation et la déduplication, quand [[13-extensions-postgresql/04-pgvector|pgvector]] ne suffit plus (très gros volumes, filtrage avancé, quantification, API dédiée).

## Installation

```bash
# Docker (le plus simple) — API REST 6333, gRPC 6334, tableau de bord /dashboard
docker run -d --name qdrant -p 6333:6333 -p 6334:6334 \
  -v $PWD/qdrant_storage:/qdrant/storage qdrant/qdrant
curl -s http://localhost:6333/healthz
```

| Méthode | Détail |
| --- | --- |
| Binaire | Archives par plate-forme (Linux, macOS, Windows) depuis les *releases* GitHub |
| Docker Compose | Service `qdrant/qdrant` + volume `/qdrant/storage` + fichier `config/production.yaml` |
| Kubernetes | Chart Helm `qdrant/qdrant` (StatefulSet, plusieurs nœuds) |
| Qdrant Cloud | Service géré (offre gratuite pour tester) |

Configuration : `config/config.yaml` (ou variables `QDRANT__SERVICE__API_KEY`, `QDRANT__SERVICE__HTTP_PORT`…). Le tableau de bord web est sur `http://localhost:6333/dashboard`.

## Collection

```bash
# Créer une collection : dimension + métrique de distance
curl -s -X PUT http://localhost:6333/collections/documents \
  -H 'Content-Type: application/json' -d '{
    "vectors": { "size": 1536, "distance": "Cosine" },
    "hnsw_config": { "m": 16, "ef_construct": 100 },
    "optimizers_config": { "default_segment_number": 2 }
  }'
```

| Distance | Usage |
| --- | --- |
| `Cosine` | Similarité cosinus (la plus courante pour les *embeddings*) |
| `Dot` | Produit scalaire |
| `Euclid` | Distance L2 |
| `Manhattan` | Distance L1 |

Qdrant gère aussi les **vecteurs nommés** (plusieurs vecteurs par point), les **vecteurs creux** (`sparse_vectors`, recherche lexicale/hybride) et les vecteurs multiples (ColBERT).

## Insérer des points

```bash
curl -s -X PUT http://localhost:6333/collections/documents/points \
  -H 'Content-Type: application/json' -d '{
    "points": [
      { "id": 1, "vector": [0.12, -0.03, "…1536 valeurs…"],
        "payload": { "titre": "Panne WAN", "categorie": "reseau", "annee": 2026 } },
      { "id": 2, "vector": [0.08,  0.21, "…"],
        "payload": { "titre": "Sauvegarde", "categorie": "stockage", "annee": 2025 } }
    ]
  }'
```

## Rechercher et filtrer

```bash
# k plus proches voisins avec filtre sur la charge utile
curl -s -X POST http://localhost:6333/collections/documents/points/query \
  -H 'Content-Type: application/json' -d '{
    "query": [0.10, -0.01, "…1536 valeurs…"],
    "limit": 5,
    "with_payload": true,
    "filter": {
      "must": [ { "key": "categorie", "match": { "value": "reseau" } } ],
      "must_not": [ { "key": "annee", "range": { "lt": 2020 } } ]
    },
    "params": { "hnsw_ef": 128 }
  }'
```

Pour que le filtrage reste rapide, créez un **index de payload** sur les champs filtrés :

```bash
curl -s -X PUT http://localhost:6333/collections/documents/index \
  -H 'Content-Type: application/json' -d '{ "field_name": "categorie", "field_schema": "keyword" }'
```

`hnsw_ef` (au moment de la requête) règle le compromis rappel/latence ; `m` et `ef_construct` (à la création) règlent la qualité de l'index. La **quantification** réduit l'empreinte mémoire :

```bash
# Quantification scalaire (int8) : ~4× moins de RAM, reclassement sur les vecteurs d'origine
curl -s -X PATCH http://localhost:6333/collections/documents \
  -H 'Content-Type: application/json' -d '{
    "quantization_config": { "scalar": { "type": "int8", "quantile": 0.99, "always_ram": true } }
  }'
```

Quantification **binaire** (jusqu'à 32×, pour les grands modèles) et **produit** également disponibles.

## Client Python

```python
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct, Filter, FieldCondition, MatchValue

cli = QdrantClient(url="http://localhost:6333", api_key="MA_CLE")
cli.recreate_collection("documents", vectors_config=VectorParams(size=1536, distance=Distance.COSINE))
cli.upsert("documents", [PointStruct(id=1, vector=emb, payload={"categorie": "reseau"})])
res = cli.query_points("documents", query=emb, limit=5,
    query_filter=Filter(must=[FieldCondition(key="categorie", match=MatchValue(value="reseau"))]))
```

## Exploitation

```bash
curl -s http://localhost:6333/collections/documents | jq '.result.status, .result.points_count'
curl -s -X POST http://localhost:6333/collections/documents/snapshots       # instantané
curl -s http://localhost:6333/collections/documents/snapshots               # lister
curl -s http://localhost:6333/metrics                                       # métriques Prometheus
```

- **Sécurité** : définir une **API key** (`service.api_key`, clé en lecture seule possible), TLS, et ne jamais exposer 6333/6334 sans authentification.
- **Multitenancy** : une seule collection avec un champ `tenant_id` indexé (plutôt qu'une collection par client) ; combiner avec `is_tenant` pour le partitionnement.
- **Sauvegarde** : instantanés (collection ou nœud complet) copiés vers un stockage objet ; en cluster, réplication (`replication_factor`) et *sharding*.
- **Supervision** : endpoint `/metrics` Prometheus, tableau de bord web.

Commandes : [[90-aide-memoire|aide-mémoire]]. Suite : [[02-milvus|Milvus]].
