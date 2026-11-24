---
title: Milvus
description: Milvus — base de données vectorielle distribuée open source (LF AI & Data, Apache 2.0) pour l'IA à grande échelle (milliards de vecteurs) : modes Milvus Lite, standalone (Docker) et cluster (Helm/Operator), architecture (etcd, MinIO, Pulsar/Kafka), collections et schémas, types d'index (FLAT, IVF_FLAT, IVF_PQ, HNSW, DISKANN, SCANN), métriques (L2, IP, COSINE), insertion, chargement en mémoire, recherche et recherche hybride, expressions de filtrage, partitions, cohérence, outil Attu, pymilvus et exploitation.
tags: [milvus, base vectorielle, embeddings, ann, diskann, cluster, rag]
icon: info
---

**Milvus** est une base vectorielle **distribuée** conçue pour le **très grand volume** (jusqu'à des milliards de vecteurs) : architecture en microservices, stockage objet, plusieurs types d'index et une recherche hybride dense + creux. Pour un prototype ou une petite application, **Milvus Lite** (bibliothèque Python embarquée) ou [[13-extensions-postgresql/04-pgvector|pgvector]] suffisent ; Milvus prend tout son sens en production à grande échelle.

## Modes de déploiement

| Mode | Usage |
| --- | --- |
| **Milvus Lite** | `pip install pymilvus` : base dans un fichier local, pour le développement |
| **Standalone** | Un conteneur Milvus + etcd + MinIO (Docker Compose) : petite production |
| **Cluster** | Microservices (proxy, coordinateurs, nœuds de données/requête/index) sur Kubernetes (Helm ou Operator) : haute disponibilité et montée en charge |

```bash
# Standalone (Docker) : script officiel
curl -sfL https://raw.githubusercontent.com/milvus-io/milvus/master/scripts/standalone_embed.sh -o standalone_embed.sh
bash standalone_embed.sh start          # expose le port 19530 (gRPC) et 9091 (métriques/health)
```

```bash
# Kubernetes (cluster)
helm repo add milvus https://zilliztech.github.io/milvus-helm/ && helm repo update
helm install milvus milvus/milvus -n milvus --create-namespace
```

Dépendances d'infrastructure : **etcd** (métadonnées), **MinIO** ou S3 (stockage objet), **Pulsar/Kafka** (journal des opérations, mode cluster). Interface d'administration : **Attu** (`zilliz/attu`, web).

## Collection et index

```python
from pymilvus import MilvusClient, DataType

client = MilvusClient(uri="http://localhost:19530", token="root:Milvus")

schema = client.create_schema(auto_id=True, enable_dynamic_field=True)
schema.add_field("id", DataType.INT64, is_primary=True)
schema.add_field("embedding", DataType.FLOAT_VECTOR, dim=1536)
schema.add_field("categorie", DataType.VARCHAR, max_length=64)

index = client.prepare_index_params()
index.add_index(field_name="embedding", index_type="HNSW", metric_type="COSINE",
                params={"M": 16, "efConstruction": 100})

client.create_collection("documents", schema=schema, index_params=index)
client.load_collection("documents")        # charger en mémoire avant de rechercher
```

| Type d'index | Quand |
| --- | --- |
| `FLAT` | Recherche exacte (petites collections) |
| `IVF_FLAT`, `IVF_SQ8`, `IVF_PQ` | Partitionnement (listes) + quantification, compromis mémoire/rappel |
| `HNSW` | Graphe : excellent rappel, rapide, plus de mémoire |
| `DISKANN` | Index sur **disque** (collections trop grandes pour la RAM) |
| `SCANN`, `GPU_*` | Optimisés (CPU vectoriel, GPU) |

Métriques : `L2`, `IP` (produit scalaire), `COSINE`.

## Insérer et rechercher

```python
client.insert("documents", [{"embedding": emb, "categorie": "reseau"}])

res = client.search(
    collection_name="documents",
    data=[emb_requete],
    limit=5,
    search_params={"metric_type": "COSINE", "params": {"ef": 128}},
    filter='categorie == "reseau"',             # expression booléenne sur les champs scalaires
    output_fields=["categorie"],
)
```

Expressions de filtrage : `==`, `!=`, `>`, `in`, `like`, `and`/`or`, `json_contains(...)`. Milvus prend en charge la **recherche hybride** (plusieurs vecteurs, dense + creux BM25, fusion RRF/pondérée) et les **partitions** (`create_partition`) pour isoler des sous-ensembles (par client, par date).

## Cohérence et exploitation

- **Niveaux de cohérence** : `Strong`, `Bounded` (défaut), `Session`, `Eventually` — compromis fraîcheur/latence au moment de la recherche.
- **Compactage et flush** : les insertions vont dans des segments, compactés en arrière-plan ; `client.flush()` force la persistance.
- **Montée en charge** : ajuster le nombre de *query nodes* / *data nodes* (cluster) ; `DISKANN` pour dépasser la RAM.
- **Sauvegarde** : outil **milvus-backup** (vers S3/MinIO). Supervision : endpoint `9091/metrics` (Prometheus) + tableau de bord Grafana fourni.

```bash
# Santé et métriques (standalone)
curl -s http://localhost:9091/healthz
curl -s http://localhost:9091/metrics | head
bash standalone_embed.sh stop        # ou restart / delete
```

Commandes : [[90-aide-memoire|aide-mémoire]]. Suite : [[03-weaviate-chroma|Weaviate et Chroma]].
