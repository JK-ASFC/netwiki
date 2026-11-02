---
title: Orchestration de données — aide-mémoire des commandes
description: Commandes Airflow (dags list/trigger/pause/unpause/test/backfill, tasks test/list, connections add/list, variables set/get, users create, db migrate, config get-value, dags list-import-errors), Kestra (CLI flow validate/namespace update, API), Prefect (server start, deploy, worker start, flow-run ls, deployment run), Dagster (dev, job execute) avec exemples.
tags: [aide-mémoire, airflow, kestra, prefect, dagster]
icon: terminal
---

Explications : [[01-apache-airflow|Airflow]] · [[02-kestra-prefect-dagster|Kestra, Prefect, Dagster et DolphinScheduler]].

```bash
airflow version ; airflow dags list ; airflow dags list-import-errors ; airflow dags trigger sauvegarde_configs ; airflow dags pause sauvegarde_configs
airflow dags test sauvegarde_configs 2026-11-02 ; airflow tasks test sauvegarde_configs verifier 2026-11-02 ; airflow dags backfill -s 2026-10-01 -e 2026-10-07 sauvegarde_configs
airflow connections add srv_oxidized --conn-type ssh --conn-host oxidized.corp.exemple.fr --conn-login airflow ; airflow connections list
airflow variables set seuil 100 ; airflow variables get seuil ; airflow db migrate ; airflow config get-value core executor
docker compose exec airflow-scheduler airflow dags list
curl -s -u admin:$MDP http://kestra:8080/api/v1/flows/search | jq '.results[].id'
prefect server start ; prefect deploy ; prefect worker start --pool par-defaut ; prefect flow-run ls ; prefect deployment run 'controle-sites/controle-horaire'
dagster dev -f actifs.py ; dagster job execute -f actifs.py -j ma_tache
```
