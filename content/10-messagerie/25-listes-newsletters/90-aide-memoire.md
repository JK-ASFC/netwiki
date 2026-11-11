---
title: Newsletters et listes de diffusion — aide-mémoire
description: Commandes de Listmonk (installation, mise à jour, API), phpList (cron processqueue et processbounces), Mautic (tâches cron, Messenger) et Sympa (création, synchronisation, commandes par e-mail).
tags: [aide-mémoire, listmonk, phplist, mautic, sympa, newsletter]
icon: terminal
---

Explications : [[01-listmonk-phplist|Listmonk et phpList]] · [[02-mautic|Mautic]] · [[03-sympa|Sympa]].

## Listmonk

```bash
./listmonk --new-config ; ./listmonk --install ; ./listmonk --upgrade
docker compose up -d                               # interface http://serveur:9000
curl -u 'api_user:jeton' "http://serveur:9000/api/subscribers?per_page=5" | jq '.data.total'
```

## phpList

```bash
php /var/www/phplist/lists/admin/index.php -pprocessqueue -c /var/www/phplist/lists/config/config.php
php /var/www/phplist/lists/admin/index.php -pprocessbounces -c /var/www/phplist/lists/config/config.php
```

## Mautic

```bash
php bin/console mautic:segments:update ; php bin/console mautic:campaigns:update ; php bin/console mautic:campaigns:trigger
php bin/console messenger:consume email --limit=500 --time-limit=110
php bin/console mautic:import ; php bin/console mautic:maintenance:cleanup --days-old=365
php bin/console cache:clear
```

## Sympa

```bash
sudo -u sympa /usr/lib/sympa/bin/sympa.pl --health_check
sudo -u sympa /usr/lib/sympa/bin/sympa.pl --sync_include=liste@listes.exemple.fr
# Par e-mail à sympa@listes.exemple.fr : SUBSCRIBE liste Prénom Nom | SIGNOFF liste | LISTS | REVIEW liste | HELP
```
