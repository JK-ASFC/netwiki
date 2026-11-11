---
title: dbt, SQLMesh, Polars et Arrow — aide-mémoire
description: Commandes dbt Core (debug, run, test, build, sélecteurs, full-refresh, docs, source freshness), SQLMesh (plan, run, audit, test, ui) et extraits Polars et PyArrow pour lire, filtrer et écrire du Parquet.
tags: [aide-mémoire, dbt, sqlmesh, polars, apache arrow, pyarrow]
icon: terminal
---

Explications : [[01-dbt-sqlmesh|dbt Core et SQLMesh]] · [[02-polars-arrow|Polars et Apache Arrow]].

```bash
# dbt Core
python3 -m pip install dbt-core dbt-postgres
dbt debug ; dbt deps
dbt run ; dbt test ; dbt build
dbt run --select modele+ ; dbt run --select +modele ; dbt run --select tag:quotidien
dbt build --select state:modified+ --state ./artefacts-prod
dbt run --full-refresh --select modele
dbt source freshness ; dbt docs generate && dbt docs serve --port 8080

# SQLMesh
sqlmesh init postgres ; sqlmesh plan dev ; sqlmesh plan
sqlmesh run ; sqlmesh audit ; sqlmesh test ; sqlmesh ui

# Polars et PyArrow
python3 -m pip install polars pyarrow
python3 -c "import polars as pl; print(pl.scan_parquet('f.parquet').head(5).collect())"
python3 -c "import pyarrow.parquet as pq; print(pq.read_metadata('f.parquet'))"
```

```python
import polars as pl
(pl.scan_csv("acces.csv")
   .filter(pl.col("statut") >= 500)
   .group_by("chemin").agg(pl.len().alias("erreurs"))
   .sort("erreurs", descending=True)
   .collect())
```
