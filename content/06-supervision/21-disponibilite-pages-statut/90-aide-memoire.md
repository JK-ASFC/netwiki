---
title: Disponibilité et pages de statut — aide-mémoire
description: Commandes Uptime Kuma (Docker, sauvegarde du volume, réinitialisation du mot de passe avec npm run reset-password), Gatus (validation et rechargement de la configuration, API /api/v1/endpoints/statuses, badges), Healthchecks (ping start/succès/échec/code de sortie, API v3 checks, manage.py createsuperuser) et Statping-ng avec exemples.
tags: [aide-mémoire, uptime kuma, gatus, healthchecks]
icon: terminal
---

Explications : [[01-uptime-kuma-gatus|Uptime Kuma et Gatus]] · [[02-pages-statut-healthchecks|pages de statut et Healthchecks]].

```bash
docker exec -it uptime-kuma npm run reset-password ; docker run --rm -v uptime-kuma:/d -v $PWD:/s alpine tar czf /s/kuma.tgz -C /d .
curl -s http://gatus:8080/api/v1/endpoints/statuses | jq '.[] | {name, ok: .results[-1].success}' ; curl -s http://gatus:8080/api/v1/endpoints/web_intranet/health/badge.svg
curl -fsS -m 10 https://hc.corp.exemple.fr/ping/UUID ; curl -fsS https://hc.corp.exemple.fr/ping/UUID/start ; curl -fsS https://hc.corp.exemple.fr/ping/UUID/fail ; curl -fsS https://hc.corp.exemple.fr/ping/UUID/$?
curl -s -H "X-Api-Key: $CLE" https://hc.corp.exemple.fr/api/v3/checks/ | jq '.checks[] | {name, status}'
docker exec -it healthchecks ./manage.py createsuperuser
```
