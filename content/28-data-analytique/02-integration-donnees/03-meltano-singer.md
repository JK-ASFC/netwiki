---
title: Meltano et Singer
description: Le standard Singer (taps et targets, messages SCHEMA, RECORD et STATE sur la sortie standard, catalogue, état incrémental, tap | target) et Meltano (projet ELT en ligne de commande : meltano init, add, config, run, plugins du Meltano Hub, environnements, état, planification, intégration dbt, SDK pour écrire un tap) ; comparaison avec Airbyte.
tags: [meltano, singer, elt, taps, targets, python, dbt, ligne de commande]
icon: git-merge
---

## Le standard Singer

**Singer** est une spécification simple pour l'extraction et le chargement de données :

- un **tap** lit une source et écrit des messages **JSON** sur sa sortie standard ;
- un **target** les lit sur son entrée standard et les écrit dans une destination ;
- on les relie par un **tube** : `tap-postgres | target-jsonl`.

| Message | Contenu |
| --- | --- |
| `SCHEMA` | Structure d'un flux (schéma JSON, clés primaires) |
| `RECORD` | Un enregistrement |
| `STATE` | Point de reprise (signet) pour l'extraction incrémentale suivante |

```bash
python3 -m venv ~/.venvs/tap-csv && ~/.venvs/tap-csv/bin/pip install tap-csv
python3 -m venv ~/.venvs/target-jsonl && ~/.venvs/target-jsonl/bin/pip install target-jsonl
~/.venvs/tap-csv/bin/tap-csv --config tap.json --discover > catalogue.json
~/.venvs/tap-csv/bin/tap-csv --config tap.json --catalog catalogue.json --state etat.json \
  | ~/.venvs/target-jsonl/bin/target-jsonl --config target.json > nouvel-etat.json
```

Chaque tap et target s'installe dans son **propre environnement virtuel** pour éviter les conflits de dépendances : c'est précisément ce que Meltano automatise.

## Meltano

**Meltano** (MIT) gère un **projet ELT** en fichiers texte, versionnable dans Git : connecteurs Singer, configuration par environnement, état incrémental, transformations dbt et planification.

```bash
pipx install meltano
meltano init entrepot && cd entrepot
meltano add extractor tap-postgres
meltano add loader target-snowflake            # ou target-postgres, target-duckdb…
meltano config tap-postgres set host db.exemple.fr
meltano config tap-postgres set password '…'   # stocké dans .env, à ne pas versionner
meltano config tap-postgres list
meltano select tap-postgres public-commandes "*"
meltano run tap-postgres target-snowflake
meltano run tap-postgres target-snowflake dbt-snowflake:run   # avec transformation
meltano state list ; meltano state get <identifiant>
meltano --environment=prod run tap-postgres target-snowflake
```

```yaml meltano.yml
version: 1
default_environment: dev
plugins:
  extractors:
    - name: tap-postgres
      variant: meltanolabs
      config: { host: db.exemple.fr, port: 5432, user: lecture, database: boutique }
      select: [ public-commandes.*, public-clients.* ]
  loaders:
    - name: target-postgres
      variant: meltanolabs
schedules:
  - name: chargement-nocturne
    interval: "0 2 * * *"
    job: chargement
jobs:
  - name: chargement
    tasks: [ tap-postgres target-postgres ]
environments: [ { name: dev }, { name: prod } ]
```

Les connecteurs disponibles et leurs variantes sont recensés sur le **Meltano Hub**. Pour une source interne, le **Meltano SDK** (Python) génère un tap conforme en quelques dizaines de lignes. La planification passe par le système d'ordonnancement de votre choix (cron, Airflow, Dagster) avec `meltano run`.

## Meltano ou Airbyte ?

| Critère | Meltano + Singer | [[02-seatunnel-airbyte\|Airbyte]] |
| --- | --- | --- |
| Interface | Ligne de commande, fichiers YAML | Interface web, API |
| Infrastructure | Un environnement Python | Plate-forme sur Kubernetes |
| Versionnage | Natif (Git) | Via Terraform ou API |
| Connecteurs | Taps Singer, qualité variable | Catalogue large, maintenu |
| Public | Équipes data « en code » | Équipes qui préfèrent une interface |

Commandes : [[90-aide-memoire|aide-mémoire]].
