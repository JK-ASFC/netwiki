---
title: Présentation, installation et utilisation
description: Orchestration durable — Temporal (MIT : workflows et activités écrits en Go, Java, TypeScript, Python, .NET, PHP ; exécution reprise exactement après panne grâce à l'historique d'événements ; temporisations longues, signaux, requêtes, réessais, compensation ; serveur avec Cassandra, PostgreSQL ou MySQL et Elasticsearch ; CLI temporal et serveur de développement ; interface web ; Helm) et Conductor (Netflix puis Orkes, Apache 2.0 : workflows JSON de microservices, workers par file de tâches, interface, Docker), cas d'usage (provisionnement de bout en bout, processus métier longs) et différences avec Airflow.
tags: [temporal, conductor, orchestration, workflows durables, microservices, saga]
icon: info
---

Les orchestrateurs de **données** ([[19-orchestration-donnees/01-apache-airflow|Airflow]]) planifient des traitements. **Temporal** et **Conductor** orchestrent des **processus applicatifs** longs et critiques : créer un compte client sur plusieurs systèmes, provisionner un environnement complet, traiter une commande avec paiement, livraison et remboursement en cas d'échec (*saga*). Leur promesse : un workflow **reprend exactement où il en était** après une panne de serveur, même s'il dure des jours.

| | **Temporal** | **Conductor** |
| --- | --- | --- |
| Définition | **Code** (SDK Go, Java, TypeScript, Python, .NET, PHP) | **JSON** (ou SDK) + workers |
| Garanties | Historique d'événements, exécution déterministe, reprises | File de tâches, reprises, délais |
| Écosystème | Temporal Technologies (cloud ou auto-hébergé) | Netflix (archivé) → **Orkes Conductor** (communautaire) |

## Temporal

```bash
# CLI (Linux, macOS, Windows) : brew install temporal ; ou binaire ; puis serveur de développement tout-en-un
temporal server start-dev --ui-port 8233          # interface http://localhost:8233
# Production : chart Helm temporalio/temporal ou Docker Compose (temporalio/docker-compose) avec PostgreSQL ou Cassandra
```

```python
# Python SDK : pip install temporalio
from datetime import timedelta
from temporalio import workflow, activity

@activity.defn
async def creer_vm(nom: str) -> str: ...
@activity.defn
async def enregistrer_netbox(nom: str, ip: str) -> None: ...
@activity.defn
async def supprimer_vm(nom: str) -> None: ...

@workflow.defn
class Provisionnement:
    @workflow.run
    async def run(self, nom: str) -> str:
        ip = await workflow.execute_activity(creer_vm, nom, start_to_close_timeout=timedelta(minutes=20))
        try:
            await workflow.execute_activity(enregistrer_netbox, args=[nom, ip], start_to_close_timeout=timedelta(minutes=2))
        except Exception:
            await workflow.execute_activity(supprimer_vm, nom, start_to_close_timeout=timedelta(minutes=10))   # compensation
            raise
        return ip
```

Un **worker** (processus) exécute workflows et activités ; le serveur conserve l'historique et redistribue le travail.

## Conductor (Orkes, communautaire)

```bash
git clone https://github.com/conductor-oss/conductor.git && cd conductor && docker compose -f docker/docker-compose.yaml up -d   # interface http://localhost:5000
```

Workflows décrits en JSON (tâches SIMPLE exécutées par des workers, HTTP, SWITCH, FORK/JOIN, WAIT, SUB_WORKFLOW).

<!-- CAPTURE: Temporal — interface web, historique d'un workflow | _assets/temporal-ui.png -->

Commandes : [[90-aide-memoire|aide-mémoire]].
