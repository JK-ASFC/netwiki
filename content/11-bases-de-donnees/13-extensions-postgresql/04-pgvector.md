---
title: pgvector
description: pgvector — extension PostgreSQL de recherche vectorielle pour l'IA (RAG, recherche sémantique, recommandation) : installation (paquet, compilation, image Docker pgvector/pgvector, Debian, Ubuntu, RHEL, macOS), types vector, halfvec, bit et sparsevec, opérateurs de distance (<->, <#>, <=>, <+>), index HNSW et IVFFlat et leurs paramètres (m, ef_construction, lists), réglages de requête (hnsw.ef_search, ivfflat.probes), recherche k plus proches voisins, filtrage et recherche hybride, quantification, pgvectorscale et exploitation.
tags: [pgvector, postgresql, vecteurs, embeddings, rag, recherche sémantique, hnsw]
icon: info
---

**pgvector** ajoute à [[02-postgresql/01-presentation|PostgreSQL]] un type **`vector`** et la **recherche par similarité** : on stocke les *embeddings* produits par un modèle (OpenAI, [[21-outils/05-ia-productivite/04-ollama-open-webui|Ollama]], Sentence Transformers) à côté des données métier, et on retrouve les éléments les plus proches d'une requête. C'est la brique des applications **RAG**, de la recherche sémantique et de la recommandation, sans ajouter de base dédiée : on garde le SQL, les jointures, les transactions et les sauvegardes de PostgreSQL.

## Installation

```bash
# Debian / Ubuntu (paquet pour la version majeure de PostgreSQL)
sudo apt install postgresql-17-pgvector
# RHEL / Rocky / Alma (dépôt PGDG)
sudo dnf install pgvector_17
```

```bash
# Compilation depuis les sources (si pas de paquet)
sudo apt install build-essential postgresql-server-dev-17
git clone --branch v0.8.0 https://github.com/pgvector/pgvector.git && cd pgvector
make && sudo make install
```

| Système | Méthode |
| --- | --- |
| Docker | Image `pgvector/pgvector:pg17` (PostgreSQL + extension préinstallée) |
| macOS | `brew install pgvector` (avec le PostgreSQL de Homebrew) |
| Windows | DLL compilée avec `nmake` (Visual Studio) ou image Docker |
| Services gérés | Souvent déjà disponible (RDS, Cloud SQL, Supabase…) : il suffit de l'activer |

```sql
CREATE EXTENSION IF NOT EXISTS vector;
SELECT extversion FROM pg_extension WHERE extname = 'vector';
```

## Types et stockage

```sql
CREATE TABLE documents (
  id        bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  titre     text NOT NULL,
  categorie text,
  contenu   text,
  embedding vector(1536)        -- dimension = sortie du modèle (ex. 1536 pour text-embedding-3-small)
);
```

| Type | Usage |
| --- | --- |
| `vector(n)` | Vecteur de `n` flottants 32 bits (jusqu'à 2000 dimensions indexables) |
| `halfvec(n)` | Flottants 16 bits : moitié moins d'espace, index plus légers (jusqu'à 4000 dim.) |
| `bit(n)` | Vecteurs binaires (distance de Hamming/Jaccard) |
| `sparsevec(n)` | Vecteurs creux (nombreux zéros, ex. embeddings lexicaux) |

## Opérateurs de distance

| Opérateur | Distance | Classe d'opérateurs d'index |
| --- | --- | --- |
| `<->` | L2 (euclidienne) | `vector_l2_ops` |
| `<#>` | Produit scalaire négatif | `vector_ip_ops` |
| `<=>` | Cosinus | `vector_cosine_ops` |
| `<+>` | L1 (Manhattan, 0.7+) | `vector_l1_ops` |

Choisir l'opérateur **selon le modèle** : la plupart des *embeddings* modernes se comparent en **cosinus** (`<=>`). L'index doit utiliser la classe d'opérateurs correspondante.

## Index : HNSW et IVFFlat

Sans index, la recherche est **exacte** mais parcourt toute la table (lent au-delà de quelques milliers de lignes). Deux index approximatifs (ANN) :

```sql
-- HNSW : meilleur rappel, construction plus lente, pas besoin de données préchargées
CREATE INDEX ON documents USING hnsw (embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 64);

-- IVFFlat : construction rapide, à créer APRÈS avoir chargé des données représentatives
--   lists ≈ racine(nb_lignes) jusqu'à 1 M, puis nb_lignes / 1000
CREATE INDEX ON documents USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 1000);
```

| | **HNSW** | **IVFFlat** |
| --- | --- | --- |
| Rappel / vitesse | Excellent rappel, très rapide | Bon, dépend de `lists`/`probes` |
| Construction | Plus lente, plus de mémoire | Rapide |
| Prérequis | Aucun | Table déjà peuplée (sinon mauvais centroïdes) |
| Paramètres clés | `m`, `ef_construction` (build) ; `hnsw.ef_search` (requête) | `lists` (build) ; `ivfflat.probes` (requête) |

```sql
-- Réglages au moment de la requête (compromis rappel / latence)
SET hnsw.ef_search = 100;      -- défaut 40 ; plus haut = meilleur rappel, plus lent
SET ivfflat.probes = 10;       -- défaut 1 ; nombre de listes sondées
-- Construction plus rapide des gros index
SET max_parallel_maintenance_workers = 7;
SET maintenance_work_mem = '2GB';
```

## Rechercher les k plus proches voisins

```sql
-- $1 = embedding de la requête (vector(1536)) fourni par l'application
SELECT id, titre, 1 - (embedding <=> $1) AS similarite
FROM documents
ORDER BY embedding <=> $1          -- l'index ne s'emploie QUE sur ORDER BY … LIMIT
LIMIT 5;

-- Filtrage métier + vectoriel (recherche « filtrée »)
SELECT id, titre
FROM documents
WHERE categorie = 'reseau'
ORDER BY embedding <=> $1
LIMIT 5;
```

> [!WARNING]
> L'index ANN n'est utilisé que par `ORDER BY distance ... LIMIT k`, pas par un `WHERE distance < seuil`. Pour un **filtrage** sélectif combiné au vecteur, un index partiel, `iterative scan` (0.8+ : `SET hnsw.iterative_scan = relaxed_order`) ou l'extension **pgvectorscale** (index StreamingDiskANN) améliorent le rappel.

### Recherche hybride (texte + vecteur)

```sql
-- Combiner la recherche plein texte de PostgreSQL et la similarité vectorielle
SELECT id, titre,
       ts_rank(to_tsvector('french', contenu), plainto_tsquery('french', $2)) AS rang_texte,
       1 - (embedding <=> $1) AS sim_vecteur
FROM documents
WHERE to_tsvector('french', contenu) @@ plainto_tsquery('french', $2)
ORDER BY (0.5 * ts_rank(to_tsvector('french', contenu), plainto_tsquery('french', $2))
          + 0.5 * (1 - (embedding <=> $1))) DESC
LIMIT 10;
```

## Exemple côté application

```python
import psycopg
from pgvector.psycopg import register_vector

conn = psycopg.connect("dbname=app user=app")
register_vector(conn)
emb = modele.encode("panne de lien WAN")          # liste de 1536 flottants
rows = conn.execute(
    "SELECT titre FROM documents ORDER BY embedding <=> %s LIMIT 5", (emb,)
).fetchall()
```

Pilotes avec prise en charge native : `pgvector-python`, `pgvector-node`, `pgvector-go`, `pgvector-rust`, et les ORM (SQLAlchemy, Django `pgvector.django`).

## Exploitation

- **Dimensionner la mémoire** : un index HNSW doit tenir en RAM (`shared_buffers`, cache de l'OS) pour être rapide ; `halfvec` divise l'empreinte par deux.
- **Quantification** : `halfvec` (16 bits) ou index binaire (`bit`) avec reclassement exact sur les candidats, pour les très gros volumes.
- **Maintenance** : `REINDEX INDEX CONCURRENTLY` après un gros chargement ; `VACUUM` normal (l'index suit les suppressions).
- **pgvectorscale** (Timescale, licence spécifique) ajoute l'index **StreamingDiskANN** (sur disque) et la quantification pour des centaines de millions de vecteurs.
- Sauvegarde et réplication : **identiques à PostgreSQL** ([[02-postgresql/05-sauvegarde-pitr|pg_dump/PITR]], [[02-postgresql/06-replication-haute-disponibilite|réplication]]).

Pour des volumes massifs ou des fonctions vectorielles avancées (multi-tenancy, quantification intégrée, API dédiée), comparez avec les [[31-bases-vectorielles/01-qdrant|bases vectorielles dédiées]].

Commandes : [[90-aide-memoire|aide-mémoire]].
