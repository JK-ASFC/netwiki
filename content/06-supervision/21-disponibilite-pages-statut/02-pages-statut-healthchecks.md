---
title: Pages de statut, Healthchecks et Cabot
description: Pages de statut et surveillance complémentaire — Cachet (PHP/Laravel : composants, incidents, maintenances planifiées, abonnés ; version 3 en refonte), Statping-ng (Go : sondes et page de statut, maintenance communautaire réduite), Healthchecks (BSD : surveillance des tâches planifiées par « dead man's switch » — sauvegardes, cron, scripts — avec URL de ping, périodes, délai de grâce, intégrations ; service hébergé ou auto-hébergé Docker) et Cabot (Django, contrôles Graphite/HTTP/Jenkins, projet peu actif), installation, usages et choix.
tags: [cachet, statping-ng, healthchecks, cabot, page de statut, cron, sauvegardes]
icon: info
---

## Pages de statut

Une **page de statut** informe les utilisateurs pendant un incident (et réduit les appels au support). Elle doit être **hébergée hors** de l'infrastructure concernée.

| Outil | Points forts | État |
| --- | --- | --- |
| [[01-uptime-kuma-gatus\|Uptime Kuma / Gatus]] | Pages alimentées automatiquement par les sondes | Actifs |
| **Cachet** | Gestion éditoriale des **incidents** et maintenances, abonnés par e-mail | Version 3 en refonte, v2 ancienne |
| **Statping-ng** | Sondes + page de statut dans un binaire Go | Maintenance réduite |

```bash
docker run -d -p 8080:8080 -v statping:/app adamboutcher/statping-ng      # Statping-ng
# Cachet : application Laravel (PHP 8, MySQL/PostgreSQL) ou image Docker de la communauté ; API pour créer des incidents depuis l'outil d'alerte
```

## Healthchecks : surveiller ce qui doit tourner

Les sondes classiques détectent ce qui **tombe** ; **Healthchecks** détecte ce qui **ne s'exécute pas** : une sauvegarde nocturne, une tâche cron, un script de synchronisation. Chaque tâche appelle une URL unique à la fin de son exécution ; si l'appel n'arrive pas dans la période prévue (+ délai de grâce), une alerte part.

```bash
docker run -d -p 8000:8000 -e SITE_ROOT=https://hc.corp.exemple.fr -e SECRET_KEY=… -e ALLOWED_HOSTS='*' \
  -v hc-data:/data healthchecks/healthchecks          # ou le service hébergé healthchecks.io
```

```bash
# Dans la tâche planifiée (signale début, succès ou échec avec le code de sortie)
URL=https://hc.corp.exemple.fr/ping/0f3a…-uuid
curl -fsS -m 10 --retry 5 "$URL/start" >/dev/null
restic backup /srv/donnees ; curl -fsS -m 10 --retry 5 --data-raw "$(tail -20 /var/log/restic.log)" "$URL/$?" >/dev/null
```

Windows : `Invoke-RestMethod https://hc.corp.exemple.fr/ping/<uuid>` à la fin d'une tâche planifiée. Intégrations : e-mail, Teams, Slack, Telegram, ntfy, webhook.

## Cabot

**Cabot** (Django) combinait contrôles HTTP, Graphite et Jenkins avec astreintes ; le projet n'évolue plus : préférer Uptime Kuma/Gatus pour les sondes et Healthchecks pour les tâches.

Interface : [[03-interface-graphique|interfaces graphiques]] · commandes : [[90-aide-memoire|aide-mémoire]].
