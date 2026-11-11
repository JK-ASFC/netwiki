---
title: Beanstalkd et Gearman
description: Principe des files de tâches (producteur, file, travailleur, nouvelles tentatives, tâches différées) puis deux serveurs indépendants des langages — Beanstalkd (protocole texte, tubes, priorités, délais, états ready/reserved/delayed/buried, binlog, beanstalk-console) et Gearman (gearmand, fonctions, tâches synchrones et en arrière-plan, gearadmin) ; supervision et sécurité.
tags: [files de tâches, beanstalkd, gearman, job queue, travailleurs, arrière-plan]
icon: list-checks
---

## Principe d'une file de tâches

Une application web ne doit pas faire attendre l'utilisateur pendant l'envoi d'un courriel, la génération d'un PDF ou le redimensionnement d'une image. Elle **dépose une tâche** dans une file ; des **travailleurs** (*workers*) la prennent, l'exécutent et signalent la réussite ou l'échec.

| Notion | Rôle |
| --- | --- |
| Producteur | Dépose la tâche (nom + données) |
| File / courtier | Stocke les tâches : serveur dédié, Redis, RabbitMQ ou PostgreSQL |
| Travailleur | Processus qui exécute les tâches, en parallèle |
| Nouvelle tentative | Réessai après échec, souvent avec délai croissant |
| Tâche différée / planifiée | À exécuter plus tard ou périodiquement |
| File des échecs | Tâches abandonnées, à analyser |

Les pages suivantes présentent les solutions par langage : [[02-celery-dramatiq-rq|Python]] et [[03-bullmq-pg-boss-graphile|Node.js]].

## Beanstalkd

Serveur minimaliste (C, MIT), protocole texte sur TCP **11300**, clients dans la plupart des langages.

- Les tâches sont rangées dans des **tubes** et ont une **priorité** (0 = la plus urgente), un **délai** et un **TTR** (temps maximal avant remise en file).
- États : `ready` → `reserved` (en cours) → supprimée ; `delayed` ; `buried` (mise de côté après échec, à examiner puis `kick`).

```bash
sudo apt install beanstalkd          # dnf install beanstalkd ; brew install beanstalkd
```

```text /etc/default/beanstalkd
BEANSTALKD_LISTEN_ADDR=127.0.0.1
BEANSTALKD_LISTEN_PORT=11300
BEANSTALKD_EXTRA="-b /var/lib/beanstalkd -f 1000"
```

L'option `-b` active le **binlog** : sans elle, les tâches sont perdues au redémarrage.

```bash
# Dialogue direct (protocole texte)
printf 'stats\r\n' | nc -q1 127.0.0.1 11300 | grep -E 'current-jobs|total-jobs|current-workers'
printf 'list-tubes\r\n' | nc -q1 127.0.0.1 11300
printf 'use mails\r\nput 0 0 60 5\r\nhello\r\n' | nc -q1 127.0.0.1 11300
printf 'use mails\r\nkick 100\r\n' | nc -q1 127.0.0.1 11300   # remet en file les tâches enterrées
```

Interfaces : beanstalk-console (PHP), Aurora ; métriques via un exportateur Prometheus.

## Gearman

**Gearman** répartit des **fonctions** : un client demande l'exécution de `redimensionner`, le serveur **gearmand** la confie à un travailleur qui a déclaré savoir la faire. Port **4730**.

- Tâche **synchrone** (le client attend le résultat) ou **en arrière-plan**.
- Persistance optionnelle (MySQL, PostgreSQL, SQLite, Redis) pour les tâches d'arrière-plan.

```bash
sudo apt install gearman-job-server gearman-tools
gearmand -d --listen=127.0.0.1 --port=4730 -q libsqlite3 --libsqlite3-db=/var/lib/gearman/file.db

gearman -w -f inverser -- rev &              # travailleur de démonstration
echo "bonjour" | gearman -f inverser         # appel synchrone
gearman -b -f inverser "tâche de fond"       # en arrière-plan
gearadmin --status                           # fonction, en file, en cours, travailleurs
gearadmin --workers
```

> [!NOTE]
> Gearman évolue très peu ; on le trouve surtout dans des applications PHP existantes. Pour un nouveau projet, préférer une solution maintenue de votre langage.

## Sécurité

Ni Beanstalkd ni Gearman n'ont d'**authentification** : les écouter sur `127.0.0.1` ou un réseau privé filtré, jamais sur Internet.

Commandes : [[90-aide-memoire|aide-mémoire]].
