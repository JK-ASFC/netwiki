---
title: Files de tâches — aide-mémoire
description: Ports et commandes de Beanstalkd (stats, kick), Gearman (gearman, gearadmin), Celery (worker, beat, inspect, flower), Dramatiq, RQ (worker, info, requeue), BullMQ (Redis), pg-boss et Graphile Worker.
tags: [aide-mémoire, beanstalkd, gearman, celery, dramatiq, rq, bullmq, pg-boss, graphile worker]
icon: terminal
---

Explications : [[01-beanstalkd-gearman|Beanstalkd et Gearman]] · [[02-celery-dramatiq-rq|Celery, Dramatiq et RQ]] · [[03-bullmq-pg-boss-graphile|BullMQ, pg-boss et Graphile Worker]].

| Outil | Stockage | Port / interface |
| --- | --- | --- |
| Beanstalkd | Lui-même (binlog `-b`) | 11300 |
| Gearman | Lui-même (persistance optionnelle) | 4730 |
| Celery | RabbitMQ ou Redis | Flower 5555 |
| Dramatiq | RabbitMQ ou Redis | — |
| RQ | Redis | rq-dashboard 9181 |
| BullMQ | Redis | Bull Board |
| pg-boss, Graphile Worker | PostgreSQL | — |

```bash
# Beanstalkd
printf 'stats\r\n' | nc -q1 127.0.0.1 11300 | grep current-jobs
printf 'use mails\r\nkick 100\r\n' | nc -q1 127.0.0.1 11300

# Gearman
gearadmin --status ; gearadmin --workers

# Celery
celery -A taches worker -l INFO -c 4 ; celery -A taches beat -l INFO
celery -A taches inspect active ; celery -A taches control ping
celery -A taches flower --port=5555

# Dramatiq
dramatiq taches --processes 2 --threads 8

# RQ
rq worker mails --url redis://localhost:6379/0 ; rq info ; rq requeue --all --queue mails

# BullMQ (Redis)
redis-cli config get maxmemory-policy        # doit valoir noeviction

# Graphile Worker
npx graphile-worker -c postgres://app:…@localhost/app --jobs 8
```
