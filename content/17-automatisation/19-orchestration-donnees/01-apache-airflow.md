---
title: Apache Airflow
description: Apache Airflow (Apache 2.0) — orchestration de pipelines et de tâches planifiées définis en Python (DAG) : architecture (planificateur, serveur d'API et interface, exécuteurs Local, Celery, Kubernetes, base de métadonnées PostgreSQL, processeur de DAG, triggerer), Airflow 3 et ses changements, installation (pip avec contraintes, Docker Compose officiel, Helm), écriture d'un DAG (TaskFlow, opérateurs Bash, Python, SSH, SQL, capteurs, dépendances, reprises, planification cron et calendriers de données), connexions et variables, fournisseurs, secrets externes, interface (grille, graphe, journaux), supervision, sécurité et bonnes pratiques.
tags: [airflow, dag, orchestration, ordonnancement, python, pipelines]
icon: info
---

**Airflow** remplace des crontabs éparpillées par des **DAG** (graphes de tâches) écrits en Python : dépendances, **reprises** automatiques, rattrapage (*backfill*), journal par tâche, alertes et interface de suivi. C'est la référence pour orchestrer extractions, chargements de données, rapports, sauvegardes applicatives ou traitements nocturnes.

## Installation (Docker Compose officiel)

```bash
mkdir airflow && cd airflow
curl -LfO 'https://airflow.apache.org/docs/apache-airflow/stable/docker-compose.yaml'
mkdir -p dags logs plugins config && echo -e "AIRFLOW_UID=$(id -u)" > .env
docker compose up airflow-init && docker compose up -d       # http://<hôte>:8080 (airflow/airflow à changer)
```

Installation Python : `pip install "apache-airflow==<version>" --constraint <fichier de contraintes de la version>` (sur Linux ou macOS ; Windows via WSL ou Docker). Kubernetes : chart officiel `apache-airflow/airflow` avec l'exécuteur **KubernetesExecutor**.

## Un DAG

```python
# dags/sauvegarde_configs.py
from datetime import datetime, timedelta
from airflow.sdk import dag, task                      # Airflow 3 ; « from airflow.decorators » en Airflow 2
from airflow.providers.ssh.operators.ssh import SSHOperator

@dag(schedule="30 1 * * *", start_date=datetime(2026, 1, 1), catchup=False,
     default_args={"retries": 2, "retry_delay": timedelta(minutes=10)}, tags=["reseau"])
def sauvegarde_configs():
    export = SSHOperator(task_id="export_oxidized", ssh_conn_id="srv_oxidized", command="oxs export --all /srv/export")

    @task
    def verifier(nb_min: int = 100):
        import pathlib
        n = len(list(pathlib.Path("/mnt/export").glob("*.cfg")))
        if n < nb_min:
            raise ValueError(f"Seulement {n} configurations exportées")
        return n

    export >> verifier()

sauvegarde_configs()
```

**Connexions** (SSH, bases, HTTP) et **variables** se gèrent dans l'interface ou via un **gestionnaire de secrets** externe (OpenBao/Vault, AWS, Azure). Alertes : `on_failure_callback` (e-mail, Teams, Slack via les fournisseurs).

Suite : [[02-kestra-prefect-dagster|Kestra, Prefect, Dagster et DolphinScheduler]] · [[03-interface-graphique|interfaces graphiques]] · [[90-aide-memoire|aide-mémoire]].
