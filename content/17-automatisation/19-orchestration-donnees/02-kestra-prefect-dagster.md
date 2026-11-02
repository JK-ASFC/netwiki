---
title: Kestra, Prefect, Dagster et DolphinScheduler
description: Alternatives à Airflow — Kestra (Apache 2.0 : workflows déclaratifs en YAML, éditeur intégré, plus de 600 greffons, déclencheurs planifiés et événementiels, Docker Compose), Prefect (Apache 2.0 : flux et tâches Python décorés, serveur auto-hébergé ou cloud, déploiements, workers et work pools), Dagster (Apache 2.0 : orientation actifs de données, lignage, tests, Dagster UI) et Apache DolphinScheduler (Apache 2.0 : ordonnanceur visuel distribué avec glisser-déposer, multi-locataires, très utilisé en Asie), installation, exemples et critères de choix.
tags: [kestra, prefect, dagster, dolphinscheduler, orchestration, workflows]
icon: info
---

| Outil | Définition des workflows | Points forts | Pour |
| --- | --- | --- | --- |
| [[01-apache-airflow\|Airflow]] | Python (DAG) | Écosystème immense, standard du marché | Équipes data et exploitation |
| **Kestra** | **YAML** déclaratif + scripts | Éditeur intégré, événements, très accessible | Exploitation, intégration, équipes mixtes |
| **Prefect** | Python (décorateurs) | Code Python « normal », reprises, dynamique | Développeurs Python |
| **Dagster** | Python, orienté **actifs de données** | Lignage, qualité, tests | Plates-formes de données |
| **DolphinScheduler** | Interface **visuelle** (glisser-déposer) | Multi-locataires, distribué | Équipes préférant le visuel |

## Kestra

```bash
curl -o docker-compose.yml https://raw.githubusercontent.com/kestra-io/kestra/develop/docker-compose.yml
docker compose up -d          # http://<hôte>:8080
```

```yaml
id: purge_journaux
namespace: corp.exploitation
tasks:
  - id: purge
    type: io.kestra.plugin.scripts.shell.Commands
    taskRunner: { type: io.kestra.plugin.core.runner.Process }
    commands:
      - find /srv/journaux -name '*.log' -mtime +30 -delete
  - id: alerte
    type: io.kestra.plugin.notifications.teams.TeamsIncomingWebhook
    url: "{{ secret('TEAMS_WEBHOOK') }}"
    payload: '{"text": "Purge des journaux terminée"}'
triggers:
  - id: chaque_nuit
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "0 3 * * *"
```

## Prefect

```bash
pip install prefect && prefect server start          # interface http://127.0.0.1:4200 (ou Docker)
```

```python
from prefect import flow, task

@task(retries=3, retry_delay_seconds=60)
def verifier_site(url: str) -> int:
    import httpx
    return httpx.get(url, timeout=10).status_code

@flow(log_prints=True)
def controle_sites(urls: list[str]):
    for u in urls:
        print(u, verifier_site(u))

if __name__ == "__main__":
    controle_sites.serve(name="controle-horaire", cron="0 * * * *", parameters={"urls": ["https://intranet.corp.exemple.fr"]})
```

## Dagster et DolphinScheduler

```bash
pip install dagster dagster-webserver && dagster dev -f actifs.py          # interface http://localhost:3000
docker run -d --name dolphinscheduler -p 12345:12345 apache/dolphinscheduler-standalone-server   # http://localhost:12345/dolphinscheduler/ui (admin/dolphinscheduler123 à changer)
```

Interface : [[03-interface-graphique|interfaces graphiques]] · commandes : [[90-aide-memoire|aide-mémoire]].
