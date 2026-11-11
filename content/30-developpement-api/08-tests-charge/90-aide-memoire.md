---
title: Micro-tests de charge — aide-mémoire
description: Commandes Apache Bench (ab), wrk2, Autocannon et oha pour mesurer débit et latence d'un service web, avec options POST, en-têtes, débit imposé et sortie JSON.
tags: [aide-mémoire, apache bench, ab, wrk2, autocannon, oha, charge]
icon: terminal
---

Explications : [[01-ab-wrk2-autocannon-oha|Apache Bench, wrk2, Autocannon et oha]]. Pour les scénarios : [[18-tests/02-tests-charge|k6, JMeter, Locust, Gatling]].

```bash
# Apache Bench (apache2-utils / httpd-tools)
ab -n 2000 -c 50 https://cible/
ab -n 1000 -c 20 -H "Authorization: Bearer $JETON" https://api/x
ab -n 500 -c 10 -p corps.json -T application/json https://api/echo

# wrk2 (débit imposé -R, percentiles justes)
wrk2 -t4 -c100 -d30s -R2000 --latency https://cible/
wrk2 -t2 -c50 -d1m -R500 -s post.lua https://api/x

# Autocannon (Node.js)
npm install -g autocannon
autocannon -c 100 -d 30 -p 10 https://cible/
autocannon -c 50 -m POST -H 'content-type=application/json' -b '{"ping":true}' https://api/echo

# oha (Rust)
oha -z 30s -c 100 --latency-correction https://cible/
oha -z 20s -c 40 --no-tui -j https://api/x > resultat.json
```

| À lire | Pourquoi |
| --- | --- |
| Requêtes/seconde | Débit soutenu |
| p95 / p99 de latence | Expérience réelle (pas la moyenne) |
| Codes ≠ 2xx | Erreurs sous charge |
| CPU/mémoire de la cible | Goulet d'étranglement |
