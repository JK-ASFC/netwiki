---
title: Sentry, GlitchTip et Errbit — aide-mémoire
description: Commandes d'exploitation (docker compose, mise à jour de Sentry self-hosted avec install.sh, sentry cleanup, createuser, GlitchTip manage.py createsuperuser et migrations, Errbit), test d'envoi avec sentry-cli (send-event, releases, sourcemaps) et curl, avec exemples.
tags: [aide-mémoire, sentry, glitchtip, errbit, sentry-cli]
icon: terminal
---

Explications : [[01-presentation-installation|Sentry, GlitchTip et Errbit]].

```bash
cd self-hosted && git fetch --tags && git checkout <nouvelle-version> && ./install.sh && docker compose up -d     # mise à jour Sentry
docker compose run --rm web createuser --email admin@corp.exemple.fr --superuser ; docker compose run --rm web cleanup --days 90
docker compose exec web ./manage.py createsuperuser ; docker compose exec web ./manage.py migrate          # GlitchTip
export SENTRY_DSN=https://cle@erreurs.corp.exemple.fr/3 ; sentry-cli send-event -m "Test depuis la CLI"
sentry-cli releases new inventaire@1.8.2 ; sentry-cli releases set-commits inventaire@1.8.2 --auto ; sentry-cli sourcemaps upload dist/
docker compose logs -f --tail=50
```
