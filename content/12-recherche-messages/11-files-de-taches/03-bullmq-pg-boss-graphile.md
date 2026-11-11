---
title: BullMQ, pg-boss et Graphile Worker (Node.js)
description: Files de tâches Node.js — BullMQ (Redis : Queue, Worker, tâches répétées, priorités, flux parent-enfant, limitation de débit, Bull Board, persistance Redis), pg-boss (PostgreSQL : SKIP LOCKED, send, work, schedule, archives) et Graphile Worker (PostgreSQL : LISTEN/NOTIFY, add_job en SQL, crontab, tâches en fichiers) ; quand une file dans PostgreSQL suffit.
tags: [bullmq, pg-boss, graphile worker, node.js, files de tâches, redis, postgresql]
icon: list-checks
---

## BullMQ (Redis)

Successeur de Bull, écrit en TypeScript, très utilisé avec NestJS et Express.

```javascript
import { Queue, Worker } from "bullmq";
const connexion = { host: "127.0.0.1", port: 6379 };

const file = new Queue("mails", { connection: connexion });
await file.add("bienvenue", { a: "alice@exemple.fr" }, {
  attempts: 5, backoff: { type: "exponential", delay: 10000 },
  removeOnComplete: 1000, removeOnFail: 5000,
});
await file.add("rapport", {}, { repeat: { pattern: "0 7 * * 1-5" } });   // tâche répétée (cron)

new Worker("mails", async (job) => {
  // envoyer job.data.a
}, { connection: connexion, concurrency: 10, limiter: { max: 50, duration: 1000 } });
```

- **Redis** doit être persistant (AOF) et configuré avec `maxmemory-policy noeviction`, sinon des tâches peuvent disparaître.
- **Bull Board** (`@bull-board/express`) fournit une interface web : à protéger par authentification.

```bash
npm install bullmq
redis-cli config get maxmemory-policy
redis-cli --scan --pattern 'bull:mails:*' | head
```

## pg-boss (PostgreSQL)

File de tâches dans **PostgreSQL** (`SELECT … FOR UPDATE SKIP LOCKED`) : pas de serveur supplémentaire, transactions partagées avec l'application.

```javascript
import PgBoss from "pg-boss";
const boss = new PgBoss("postgres://app:…@localhost/app");
await boss.start();
await boss.createQueue("mails");
await boss.send("mails", { a: "alice@exemple.fr" }, { retryLimit: 3, retryBackoff: true });
await boss.schedule("rapport", "0 7 * * 1-5", {}, { tz: "Europe/Paris" });
await boss.work("mails", async ([job]) => { /* job.data */ });
```

Ses tables vivent dans le schéma `pgboss` ; les tâches terminées sont archivées puis supprimées selon la rétention.

## Graphile Worker (PostgreSQL)

Autre file sur PostgreSQL, réactive grâce à **LISTEN/NOTIFY** ; les tâches peuvent être ajoutées **directement en SQL** (déclencheurs, fonctions).

```bash
npm install graphile-worker
npx graphile-worker -c postgres://app:…@localhost/app --jobs 8    # charge ./tasks/*.js
```

```sql
SELECT graphile_worker.add_job('envoyer_mail', json_build_object('a', 'alice@exemple.fr'), max_attempts => 5);
```

```text crontab
# minute heure jour mois jour-semaine tâche
0 7 * * 1-5 rapport_quotidien
```

## Redis ou PostgreSQL ?

| Critère | BullMQ (Redis) | pg-boss / Graphile Worker |
| --- | --- | --- |
| Débit | Très élevé | Bon (milliers de tâches par seconde) |
| Infrastructure | Redis persistant à exploiter | La base existante |
| Cohérence | Séparée de la base | Tâche créée dans la même transaction que les données |
| Sauvegarde | Celle de Redis | Celle de PostgreSQL |

Pour la plupart des applications de taille moyenne, une file dans **PostgreSQL** évite un composant de plus.

Voir aussi : [[01-beanstalkd-gearman|principe]] · [[02-celery-dramatiq-rq|Python]]. Commandes : [[90-aide-memoire|aide-mémoire]].
