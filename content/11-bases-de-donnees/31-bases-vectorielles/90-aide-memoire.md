---
title: Bases vectorielles — aide-mémoire
description: Commandes et requêtes Qdrant (API REST collections, points, query, index de payload, instantanés, quantification), Milvus (pymilvus et milvus_cli : create_collection, create_index, load, search, flush), Weaviate (REST /v1, GraphQL, backups) et Chroma (client Python, collection, add, query) avec exemples.
tags: [aide-mémoire, qdrant, milvus, weaviate, chroma, base vectorielle]
icon: terminal
---

Explications : [[01-qdrant|Qdrant]] · [[02-milvus|Milvus]] · [[03-weaviate-chroma|Weaviate et Chroma]].

## Qdrant (API REST)

```bash
curl -s localhost:6333/healthz
curl -s -X PUT localhost:6333/collections/docs -H 'Content-Type: application/json' -d '{"vectors":{"size":1536,"distance":"Cosine"}}'
curl -s localhost:6333/collections/docs | jq '.result.points_count,.result.status'
curl -s -X PUT localhost:6333/collections/docs/index -H 'Content-Type: application/json' -d '{"field_name":"categorie","field_schema":"keyword"}'
curl -s -X POST localhost:6333/collections/docs/points/query -H 'Content-Type: application/json' -d '{"query":[0.1],"limit":5,"with_payload":true,"params":{"hnsw_ef":128}}'
curl -s -X POST localhost:6333/collections/docs/snapshots            # instantané
curl -s localhost:6333/metrics | head                               # Prometheus
```

## Milvus (pymilvus)

```python
from pymilvus import MilvusClient
c = MilvusClient(uri="http://localhost:19530", token="root:Milvus")
c.create_collection("docs", dimension=1536, metric_type="COSINE")
c.insert("docs", [{"id":1,"vector":emb,"categorie":"reseau"}])
c.load_collection("docs")
c.search("docs", data=[emb], limit=5, filter='categorie=="reseau"', output_fields=["categorie"])
c.describe_collection("docs"); c.get_collection_stats("docs"); c.flush("docs")
```

```bash
bash standalone_embed.sh start|stop|restart|delete       # cycle de vie standalone
curl -s localhost:9091/healthz                            # santé
```

## Weaviate

```bash
curl -s localhost:8080/v1/.well-known/ready
curl -s localhost:8080/v1/schema | jq '.classes[].class'
curl -s localhost:8080/v1/meta | jq '.modules | keys'
curl -s -X POST localhost:8080/v1/backups/filesystem -H 'Content-Type: application/json' -d '{"id":"sauv-1"}'
curl -s localhost:2112/metrics | head                     # Prometheus
# GraphQL : POST /v1/graphql  { Get { Document(limit:5 nearText:{concepts:["wan"]}) { titre } } }
```

## Chroma

```python
import chromadb
c = chromadb.HttpClient(host="localhost", port=8000)       # ou PersistentClient(path="./chroma_data")
col = c.get_or_create_collection("docs", metadata={"hnsw:space":"cosine"})
col.add(ids=["1"], documents=["Panne WAN"], metadatas=[{"categorie":"reseau"}])
col.query(query_texts=["coupure"], n_results=3, where={"categorie":"reseau"})
col.count(); c.list_collections(); c.delete_collection("docs")
```

```bash
chroma run --host 0.0.0.0 --port 8000 --path ./chroma_data
curl -s localhost:8000/api/v2/heartbeat
```
