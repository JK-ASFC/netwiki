---
title: Polars et Apache Arrow
description: Apache Arrow (format colonnaire en mémoire, échange sans copie entre langages, PyArrow, Parquet, Arrow Flight et Flight SQL, ADBC, acero) et Polars (DataFrames en Rust pour Python : API expressive, mode paresseux et optimiseur de requêtes, streaming au-delà de la mémoire, lecture CSV, Parquet, bases SQL et S3, SQL intégré, comparaison avec pandas et DuckDB) ; exemples et usages en exploitation.
tags: [polars, apache arrow, pyarrow, dataframe, parquet, python, rust, analyse de données]
icon: table-2
---

## Apache Arrow

**Apache Arrow** définit un **format colonnaire en mémoire** standard. Lorsque plusieurs outils l'utilisent (pandas, Polars, DuckDB, Spark, R…), ils s'échangent les données **sans conversion ni copie**. Arrow fournit aussi des bibliothèques pour lire et écrire Parquet, CSV et JSON, et calculer.

| Brique | Rôle |
| --- | --- |
| Format en mémoire | Colonnes contiguës, adapté aux processeurs modernes (SIMD) |
| Fichiers IPC / Feather | Arrow sur disque, lecture instantanée |
| **Parquet** | Format de stockage colonnaire compressé (implémentation dans Arrow) |
| **Arrow Flight** / Flight SQL | Transfert réseau rapide de données Arrow (gRPC) |
| **ADBC** | Connecteurs de bases qui renvoient directement de l'Arrow (alternative à ODBC/JDBC) |

```python
import pyarrow as pa, pyarrow.parquet as pq, pyarrow.compute as pc, pyarrow.dataset as ds

table = pq.read_table("ventes.parquet", columns=["client", "montant"])
print(table.schema, table.num_rows)
print(pc.sum(table["montant"]))

dataset = ds.dataset("s3://lac/ventes/", format="parquet", partitioning="hive")
fr = dataset.to_table(filter=ds.field("pays") == "FR")
pq.write_table(fr, "ventes_fr.parquet", compression="zstd")
```

```bash
python3 -m pip install pyarrow
python3 -c "import pyarrow.parquet as pq; print(pq.read_metadata('ventes.parquet'))"   # schéma, groupes de lignes
```

## Polars

**Polars** est une bibliothèque de **DataFrames** écrite en Rust, utilisable en Python (et Rust, Node.js), fondée sur Arrow. Elle est **multi-cœur** par défaut et nettement plus rapide que pandas sur la plupart des traitements.

```python
import polars as pl

# Mode immédiat
df = pl.read_csv("acces.csv")
print(df.group_by("ip").agg(pl.len().alias("requetes")).sort("requetes", descending=True).head(10))

# Mode paresseux : l'optimiseur ne lit que les colonnes et lignes utiles
resultat = (
    pl.scan_parquet("s3://lac/ventes/*.parquet")
      .filter(pl.col("pays") == "FR")
      .group_by(pl.col("date_cmd").dt.truncate("1mo").alias("mois"))
      .agg(pl.col("montant").sum().alias("ca"), pl.col("client").n_unique().alias("clients"))
      .sort("mois")
      .collect(engine="streaming")      # traite par morceaux, au-delà de la mémoire disponible
)
resultat.write_parquet("ca_mensuel.parquet")

# SQL sur des DataFrames
ctx = pl.SQLContext(ventes=pl.scan_parquet("ventes.parquet"))
print(ctx.execute("SELECT pays, sum(montant) AS ca FROM ventes GROUP BY pays", eager=True))
```

```bash
python3 -m pip install polars            # « polars[all] » pour les extensions (Excel, bases, cloud…)
```

Usages côté exploitation : analyser rapidement de gros journaux (CSV, JSON lignes), préparer des exports, remplacer des scripts pandas trop lents ou trop gourmands en mémoire.

## Polars, pandas ou DuckDB ?

| Critère | pandas | Polars | DuckDB |
| --- | --- | --- | --- |
| Interface | DataFrame (Python) | DataFrame expressif | SQL |
| Performance | Monocœur, mémoire importante | Multi-cœur, paresseux | Multi-cœur, moteur SQL |
| Au-delà de la mémoire | Non | Streaming | Oui |
| Écosystème | Le plus vaste | En forte croissance | Très large (extensions) |

Les trois échangent leurs données via **Arrow** : `pl.from_pandas(df)`, `df.to_arrow()`, `duckdb.sql("SELECT …").pl()`.

Voir aussi : [[01-dbt-sqlmesh|dbt Core et SQLMesh]] · [[04-lac-donnees/01-iceberg-delta-hudi|formats de lac de données]]. Commandes : [[90-aide-memoire|aide-mémoire]].
