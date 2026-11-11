---
title: Apache Bench, wrk2, Autocannon et oha
description: Outils de micro-test de charge en ligne de commande — Apache Bench (ab : requêtes concurrentes, limites), wrk2 (débit constant imposé pour des latences justes, latence corrigée de l'attente), Autocannon (Node.js : rapide, scriptable, pipelining) et oha (Rust : affichage temps réel, histogramme, sortie JSON) ; méthode (environnement dédié, paliers, percentiles) et complémentarité avec k6, JMeter et Gatling.
tags: [tests de charge, apache bench, ab, wrk2, autocannon, oha, performance, benchmark]
icon: gauge
---

Pour mesurer rapidement le **débit** et la **latence** d'un service web depuis la ligne de commande, ces outils légers suffisent souvent. Pour des **scénarios réalistes** (parcours utilisateur, seuils en CI, protocoles variés), voir plutôt [[18-tests/02-tests-charge|k6, JMeter, Locust et Gatling]].

## Apache Bench (ab)

Fourni avec les outils Apache (`apache2-utils` / `httpd-tools`), présent presque partout. Simple mais daté (HTTP/1.0 par défaut, mono-thread).

```bash
ab -n 2000 -c 50 https://intranet.exemple.fr/          # 2000 requêtes, 50 en parallèle
ab -n 1000 -c 20 -H "Authorization: Bearer $JETON" https://api.exemple.fr/v1/equipements
ab -n 500 -c 10 -p corps.json -T application/json https://api.exemple.fr/v1/echo    # POST
```

Lire : *Requests per second*, *Time per request*, et la répartition des temps. Limites : ne tient pas HTTP/2, mesure de latence peu fiable sous forte charge.

## wrk2

**wrk2** impose un **débit constant** (`-R`) et corrige le biais de *coordinated omission* (l'attente dans la file est comptée) : ses **percentiles de latence** sont bien plus justes que ceux d'ab sous charge.

```bash
# -t threads  -c connexions  -d durée  -R requêtes/seconde visées
wrk2 -t4 -c100 -d30s -R2000 --latency https://intranet.exemple.fr/
wrk2 -t2 -c50 -d1m -R500 -s post.lua https://api.exemple.fr/v1/tickets   # scénario Lua
```

Le script Lua permet en-têtes, corps et chemins dynamiques. C'est l'outil de choix pour **qualifier la latence** à un débit donné.

## Autocannon

**Autocannon** (Node.js) est rapide à lancer, scriptable en JavaScript, et gère le **pipelining**. Pratique dans un environnement Node déjà présent.

```bash
npm install -g autocannon
autocannon -c 100 -d 30 -p 10 https://intranet.exemple.fr/      # 100 connexions, 30 s, pipeline 10
autocannon -c 50 -m POST -H 'content-type=application/json' -b '{"ping":true}' https://api.exemple.fr/echo
autocannon --renderStatusCodes -c 20 https://api.exemple.fr/v1/equipements
```

## oha

**oha** (Rust) affiche un **tableau de bord en temps réel** (requêtes/s, latences, codes) pendant le test, avec histogramme et **sortie JSON** exploitable en CI. HTTP/1 et HTTP/2.

```bash
# binaire des versions GitHub ; brew install oha ; cargo install oha
oha -n 5000 -c 50 https://intranet.exemple.fr/
oha -z 30s -c 100 --latency-correction --disable-keepalive https://api.exemple.fr/v1/equipements
oha -z 20s -c 40 -m POST -H 'Content-Type: application/json' -d '{"ping":true}' --no-tui -j https://api.exemple.fr/echo
```

## Méthode

1. **Environnement dédié** (jamais la production) représentatif de la cible.
2. Tester **par paliers** de charge croissants, pas un seul tir brutal ; chauffer le service avant de mesurer.
3. Lire les **percentiles** (p95, p99), pas seulement la moyenne : la queue de distribution traduit l'expérience réelle.
4. Préférer un **débit imposé** (wrk2, `--latency-correction` d'oha) pour des latences honnêtes.
5. Surveiller **en même temps** la cible (CPU, mémoire, connexions, base de données) pour trouver le goulet d'étranglement, et tester **depuis une autre machine** que la cible.

## Choisir

| Besoin | Outil |
| --- | --- |
| Mesure immédiate, partout | Apache Bench |
| Latence juste à débit imposé | wrk2 |
| Environnement Node, scriptable | Autocannon |
| Affichage temps réel, JSON pour la CI | oha |
| Scénarios réalistes, seuils, rapports | [[18-tests/02-tests-charge\|k6, Gatling, Locust, JMeter]] |

Commandes : [[90-aide-memoire|aide-mémoire]].
