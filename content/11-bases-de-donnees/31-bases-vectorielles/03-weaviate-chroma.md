---
title: Weaviate et Chroma
description: Weaviate (Go, BSD-3) — base vectorielle avec vectorisation intégrée par modules (text2vec-ollama, openai, cohere, transformers), schéma de classes, recherche nearText/nearVector, recherche hybride BM25 + vecteur, filtres where, GraphQL et REST, modules de génération (RAG) ; Chroma (Apache 2.0) — base vectorielle légère pour le développement et le prototypage LangChain/LlamaIndex : mode embarqué et client-serveur, collections, fonctions d'embedding, requêtes et filtres de métadonnées. Installation Docker et Python, comparaison et choix.
tags: [weaviate, chroma, base vectorielle, rag, hybride, graphql, langchain]
icon: info
---

Deux bases vectorielles complémentaires des précédentes : **Weaviate** vise la production avec la **vectorisation intégrée** et la recherche hybride ; **Chroma** est l'outil léger du **développement** et du prototypage d'applications LLM.

## Weaviate

**Weaviate** (Go, BSD-3) peut **produire lui-même les *embeddings*** via des modules (pas besoin de vectoriser côté application) et combine recherche vectorielle, mot-clé (BM25) et génération (RAG).

```bash
docker run -d --name weaviate -p 8080:8080 -p 50051:50051 \
  -e PERSISTENCE_DATA_PATH=/var/lib/weaviate \
  -e ENABLE_MODULES=text2vec-ollama,generative-ollama \
  -e DEFAULT_VECTORIZER_MODULE=text2vec-ollama \
  -e AUTHENTICATION_APIKEY_ENABLED=true -e AUTHENTICATION_APIKEY_ALLOWED_KEYS=MA_CLE -e AUTHENTICATION_APIKEY_USERS=admin \
  -v $PWD/weaviate:/var/lib/weaviate cr.weaviate.io/semitechnologies/weaviate:latest
```

Modules de vectorisation : `text2vec-ollama`, `text2vec-openai`, `text2vec-cohere`, `text2vec-huggingface`, `text2vec-transformers` (modèle local), `multi2vec-clip` (images). Modules de génération : `generative-ollama`, `generative-openai`…

```python
import weaviate
from weaviate.classes.config import Configure, Property, DataType

client = weaviate.connect_to_local(headers={"X-Ollama-Api-Key": ""})
client.collections.create(
    "Document",
    vectorizer_config=Configure.Vectorizer.text2vec_ollama(model="nomic-embed-text"),
    generative_config=Configure.Generative.ollama(model="llama3.1"),
    properties=[Property(name="titre", data_type=DataType.TEXT),
                Property(name="categorie", data_type=DataType.TEXT)],
)
docs = client.collections.get("Document")
docs.data.insert({"titre": "Panne WAN", "categorie": "reseau"})   # vectorisé automatiquement

# Recherche hybride (BM25 + vecteur) avec filtre
from weaviate.classes.query import Filter, HybridFusion
res = docs.query.hybrid(
    query="coupure de lien internet", alpha=0.5, fusion_type=HybridFusion.RELATIVE_SCORE,
    filters=Filter.by_property("categorie").equal("reseau"), limit=5,
)
# RAG : générer une réponse à partir des documents trouvés
rag = docs.generate.near_text("coupure WAN", limit=3, grouped_task="Résume les causes probables")
client.close()
```

- **APIs** : REST et **GraphQL** (`/v1/graphql`) en plus du client gRPC ; `nearText` (via module), `nearVector`, `bm25`, `hybrid`.
- **Index** : HNSW (défaut) ou `flat` ; **quantification** PQ/BQ/SQ ; index inversé pour les filtres.
- **Sécurité** : clés d'API ou OIDC, RBAC (versions récentes), TLS.
- **Exploitation** : multitenancy natif (un tenant par client), sauvegarde vers S3/GCS/filesystem (`/v1/backups`), métriques Prometheus (`/metrics`, port 2112).

## Chroma

**Chroma** (Apache 2.0) est une base vectorielle **légère** très utilisée avec LangChain et LlamaIndex : idéale en développement, en notebook, ou pour une petite application RAG.

```bash
pip install chromadb
# Mode serveur
chroma run --host 0.0.0.0 --port 8000 --path ./chroma_data
# ou Docker
docker run -d --name chroma -p 8000:8000 -v $PWD/chroma:/data chromadb/chroma
```

```python
import chromadb
from chromadb.utils import embedding_functions

# Embarqué (fichier local) ou client-serveur
client = chromadb.PersistentClient(path="./chroma_data")        # ou HttpClient(host="localhost", port=8000)
ef = embedding_functions.OllamaEmbeddingFunction(url="http://localhost:11434", model_name="nomic-embed-text")

col = client.get_or_create_collection("documents", embedding_function=ef,
        metadata={"hnsw:space": "cosine"})
col.add(ids=["1", "2"],
        documents=["Panne de lien WAN", "Rotation des sauvegardes"],
        metadatas=[{"categorie": "reseau"}, {"categorie": "stockage"}])

res = col.query(query_texts=["coupure internet"], n_results=3,
                where={"categorie": "reseau"})                  # filtre de métadonnées
```

Chroma gère les **fonctions d'embedding** (Ollama, OpenAI, Sentence Transformers par défaut), les **filtres** `where` (métadonnées) et `where_document` (contenu), la distance (`hnsw:space` = `cosine`/`l2`/`ip`). Il ne vise pas les très gros volumes ni la haute disponibilité : pour cela, Qdrant, Milvus ou Weaviate.

## Choisir

| Besoin | Outil |
| --- | --- |
| Déjà sous PostgreSQL, volumes modérés | [[13-extensions-postgresql/04-pgvector\|pgvector]] |
| Prototype, notebook, petite app RAG | **Chroma** (ou Milvus Lite) |
| Production, filtrage riche, quantification | [[01-qdrant\|Qdrant]] |
| Vectorisation intégrée + hybride + RAG | **Weaviate** |
| Très grande échelle (milliards), distribué | [[02-milvus\|Milvus]] |

Commandes : [[90-aide-memoire|aide-mémoire]].
