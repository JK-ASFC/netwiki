---
title: Celery, Dramatiq et RQ (Python)
description: Files de tâches Python — Celery (courtier RabbitMQ ou Redis, backend de résultats, celery worker, beat pour les tâches planifiées, routage, nouvelles tentatives, Flower, inspect et control, service systemd), Dramatiq (acteurs, middlewares, nouvelles tentatives par défaut) et RQ (Redis Queue, rq worker, rq info, rq-scheduler, rq-dashboard) ; comparaison et bonnes pratiques.
tags: [celery, dramatiq, rq, python, files de tâches, redis, rabbitmq, flower]
icon: list-checks
---

## Celery

La file de tâches Python la plus répandue (Django, Flask, FastAPI). Elle s'appuie sur un **courtier** (RabbitMQ ou Redis) et, si besoin, un **backend de résultats** (Redis, base SQL).

```python taches.py
from celery import Celery

app = Celery("taches", broker="redis://localhost:6379/0", backend="redis://localhost:6379/1")
app.conf.update(task_acks_late=True, worker_prefetch_multiplier=1, timezone="Europe/Paris")

@app.task(bind=True, autoretry_for=(ConnectionError,), retry_backoff=True, max_retries=5)
def envoyer_mail(self, destinataire):
    ...

app.conf.beat_schedule = {
    "purge-nocturne": {"task": "taches.purger", "schedule": 3600.0 * 24},
}
```

```bash
python3 -m pip install "celery[redis]" flower
celery -A taches worker --loglevel=INFO --concurrency=4 -Q default,mails
celery -A taches beat --loglevel=INFO          # planificateur : une seule instance
celery -A taches inspect active ; celery -A taches inspect registered
celery -A taches control ping
celery -A taches purge                          # vide les files (attention)
celery -A taches flower --port=5555             # interface web de supervision
```

```ini /etc/systemd/system/celery.service
[Unit]
Description=Travailleur Celery
After=network.target redis.service

[Service]
User=app
WorkingDirectory=/srv/app
ExecStart=/srv/app/venv/bin/celery -A taches worker --loglevel=INFO --concurrency=4
Restart=always

[Install]
WantedBy=multi-user.target
```

Bonnes pratiques : tâches **idempotentes** (rejouables sans effet double), passer des identifiants plutôt que des objets volumineux, `task_acks_late` pour ne pas perdre une tâche si le travailleur meurt, protéger Flower par authentification.

## Dramatiq

Alternative plus simple à Celery : des **acteurs** décorés, RabbitMQ ou Redis, nouvelles tentatives activées par défaut.

```python
import dramatiq
from dramatiq.brokers.redis import RedisBroker

dramatiq.set_broker(RedisBroker(url="redis://localhost:6379/0"))

@dramatiq.actor(max_retries=3, queue_name="mails")
def envoyer_mail(destinataire):
    ...

envoyer_mail.send("alice@exemple.fr")
```

```bash
python3 -m pip install "dramatiq[redis, watch]"
dramatiq taches --processes 2 --threads 8 --queues mails
```

## RQ (Redis Queue)

Le plus léger : uniquement Redis, une tâche est une simple fonction Python.

```python
from redis import Redis
from rq import Queue, Retry
from taches import envoyer_mail

q = Queue("mails", connection=Redis())
job = q.enqueue(envoyer_mail, "alice@exemple.fr", retry=Retry(max=3, interval=[10, 60, 300]))
```

```bash
python3 -m pip install rq rq-dashboard
rq worker mails default --url redis://localhost:6379/0
rq info --url redis://localhost:6379/0           # files, travailleurs, tâches en échec
rq requeue --all --queue mails                   # relance les tâches en échec
rq-dashboard --redis-url redis://localhost:6379/0   # interface web (port 9181)
```

## Choisir

| Critère | Celery | Dramatiq | RQ |
| --- | --- | --- | --- |
| Courtiers | RabbitMQ, Redis, SQS… | RabbitMQ, Redis | Redis seul |
| Tâches planifiées | beat intégré | via APScheduler ou périodiques | `enqueue_in`, rq-scheduler |
| Complexité | Élevée, très complet | Moyenne | Faible |
| Supervision | Flower | Dashboard | rq-dashboard |

Voir aussi : [[01-beanstalkd-gearman|principe et serveurs indépendants]] · [[03-bullmq-pg-boss-graphile|Node.js]]. Commandes : [[90-aide-memoire|aide-mémoire]].
