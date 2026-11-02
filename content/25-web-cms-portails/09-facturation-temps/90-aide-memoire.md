---
title: Facturation et temps — aide-mémoire des commandes
description: Commandes Invoice Ninja (key:generate, docker compose, journaux), Akaunting (php artisan install, schedule:run), Kimai (kimai:install, kimai:user:create, list, reload, mail:test, Docker) avec exemples.
tags: [aide-mémoire, invoice ninja, akaunting, kimai]
icon: terminal
---

Explications : [[01-invoice-ninja-akaunting-kimai-crater|Invoice Ninja, Akaunting, Kimai, Crater]].

```bash
docker run --rm -it invoiceninja/invoiceninja-debian php artisan key:generate --show
cd invoiceninja && docker compose up -d && docker compose logs -f app
php artisan install --db-name="akaunting" --db-username="akaunting" --db-password="MdpAkaunting2026" --admin-email="compta@corp.exemple.fr" --admin-password='MdpAdmin2026!'
php artisan schedule:run
docker compose exec kimai /opt/kimai/bin/console kimai:user:list
bin/console kimai:install -n ; bin/console kimai:reload
bin/console kimai:user:create jk jk@corp.exemple.fr ROLE_SUPER_ADMIN
bin/console kimai:user:password jk ; bin/console kimai:mail:test temps@corp.exemple.fr
```
