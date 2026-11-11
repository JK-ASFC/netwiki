---
title: dbt Core et SQLMesh
description: Transformer les données dans l'entrepôt avec du SQL versionné — dbt Core (projet, modèles, ref et source, matérialisations table, view, incremental, tests, documentation et lignage, profiles.yml, adaptateurs PostgreSQL, DuckDB, Trino, Spark, commandes dbt run, build, test, docs, sélecteurs, licence de dbt Fusion) et SQLMesh (plans et environnements virtuels, modèles SQL et Python, audits, détection des changements cassants, compatibilité dbt) ; bonnes pratiques et choix.
tags: [dbt, dbt core, sqlmesh, elt, transformation, sql, entrepôt de données, analytics engineering]
icon: table-2
---

Une fois les données chargées dans l'entrepôt (ELT), il faut les **nettoyer, joindre et agréger**. **dbt** et **SQLMesh** permettent de le faire en **SQL versionné dans Git**, avec dépendances, tests et documentation, à la manière d'un projet logiciel.

## dbt Core

**dbt Core** (Apache 2.0) compile des modèles SQL avec Jinja et les exécute dans l'entrepôt, dans l'ordre des dépendances.

> [!NOTE]
> dbt Core reste libre. Le nouveau moteur **dbt Fusion** (réécrit en Rust) et la plate-forme dbt Cloud relèvent d'autres licences ; vérifier lesquelles s'appliquent avant de changer de moteur.

```bash
python3 -m venv .venv && . .venv/bin/activate
python3 -m pip install dbt-core dbt-postgres          # ou dbt-duckdb, dbt-trino, dbt-spark, dbt-snowflake…
dbt init entrepot && cd entrepot
dbt debug                                              # teste la connexion
```

```yaml ~/.dbt/profiles.yml
entrepot:
  target: dev
  outputs:
    dev:
      type: postgres
      host: localhost
      port: 5432
      user: dbt
      password: "{{ env_var('DBT_MDP') }}"
      dbname: analyse
      schema: dbt_dev
      threads: 4
```

```sql models/marts/ca_mensuel.sql
{{ config(materialized='incremental', unique_key='mois') }}

select date_trunc('month', c.date_cmd) as mois,
       sum(c.montant)                  as chiffre_affaires,
       count(distinct c.client_id)     as clients
from {{ ref('stg_commandes') }} c
{% if is_incremental() %}
where c.date_cmd >= (select max(mois) from {{ this }})
{% endif %}
group by 1
```

```yaml models/marts/schema.yml
version: 2
models:
  - name: ca_mensuel
    description: Chiffre d'affaires et nombre de clients par mois.
    columns:
      - name: mois
        data_tests: [ unique, not_null ]
```

| Matérialisation | Effet |
| --- | --- |
| `view` | Vue (par défaut) |
| `table` | Table recréée à chaque exécution |
| `incremental` | Ajout ou fusion des seules nouvelles lignes |
| `ephemeral` | Sous-requête intégrée aux modèles qui l'utilisent |
| Instantané (*snapshot*) | Historisation des changements (dimension lente de type 2) |

```bash
dbt run ; dbt test ; dbt build                  # build = run + test + seeds + snapshots, dans l'ordre
dbt run --select ca_mensuel+                    # le modèle et ses descendants
dbt build --select state:modified+ --state ./artefacts-prod   # seulement ce qui a changé
dbt run --full-refresh --select ca_mensuel
dbt source freshness                            # fraîcheur des sources
dbt docs generate && dbt docs serve --port 8080 # documentation et graphe de lignage
dbt deps                                        # paquets (dbt_utils…)
```

En production, lancer `dbt build` depuis un ordonnanceur (Airflow, Dagster, cron, CI) avec un compte dédié et une cible `prod`.

## SQLMesh

**SQLMesh** (Apache 2.0) reprend l'idée de dbt avec deux apports : il **comprend le SQL** (analyse sémantique) et gère des **environnements virtuels** bon marché.

- `sqlmesh plan dev` calcule l'impact d'une modification : quels modèles changent, si le changement est **cassant** ou non, quelles périodes recalculer.
- Les environnements réutilisent les tables déjà calculées (vues pointant vers des tables versionnées) : créer un environnement de test ne recopie pas les données.
- **Audits** (tests bloquants), tests unitaires, modèles SQL ou Python, lecture des projets dbt existants.

```bash
python3 -m pip install "sqlmesh[web,postgres]"
sqlmesh init postgres
sqlmesh plan dev                 # environnement de développement
sqlmesh plan                     # promotion vers prod
sqlmesh run                      # exécute les intervalles dus
sqlmesh audit ; sqlmesh test
sqlmesh ui                       # interface web
```

```sql models/ca_mensuel.sql
MODEL (
  name analyse.ca_mensuel,
  kind INCREMENTAL_BY_TIME_RANGE (time_column mois),
  cron '@daily',
  grain mois,
  audits (not_null(columns := (mois)))
);

SELECT date_trunc('month', date_cmd) AS mois, sum(montant) AS chiffre_affaires
FROM analyse.stg_commandes
WHERE date_cmd BETWEEN @start_ds AND @end_ds
GROUP BY 1
```

## Choisir

| Critère | dbt Core | SQLMesh |
| --- | --- | --- |
| Écosystème | Très large (paquets, adaptateurs, formations) | Plus récent |
| Environnements de test | Schémas recalculés | Virtuels, sans recopie |
| Analyse d'impact | Sélecteurs `state:modified` | Détection des changements cassants |
| Migration | — | Lit les projets dbt |

Bonnes pratiques communes : couches `staging` → `intermediate` → `marts`, tests sur les clés, revue de code des modèles, documentation des colonnes exposées.

Voir aussi : [[02-polars-arrow|Polars et Apache Arrow]] · [[02-integration-donnees/03-meltano-singer|Meltano]]. Commandes : [[90-aide-memoire|aide-mémoire]].
