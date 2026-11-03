---
title: Caisses et inventaire — aide-mémoire des commandes
description: Commandes OSPOS (docker compose), uniCenta (sauvegarde MySQL), InvenTree (installateur, invoke update, superuser, backup), Snipe-IT (key:generate, snipeit:backup, snipeit:ldap-sync, migrate, schedule:run) et agent GLPI avec exemples.
tags: [aide-mémoire, ospos, inventree, snipe-it, glpi-agent]
icon: terminal
---

Explications : [[01-caisses-pos|logiciels de caisse]] · [[02-inventaire-actifs|InvenTree, Snipe-IT, OpenBoxes, FusionInventory]].

```bash
cd opensourcepos && docker compose up -d && docker compose logs -f
mysqldump --single-transaction unicentaopos > /srv/sauvegardes/caisse-$(date +%F).sql
wget -qO install.sh https://get.inventree.org && bash install.sh
docker compose run --rm inventree-server invoke update
docker compose run --rm inventree-server invoke superuser
docker compose run --rm inventree-server invoke backup
cd /var/www/snipe-it && sudo php artisan key:generate
sudo -u www-data php artisan snipeit:backup ; sudo -u www-data php artisan snipeit:ldap-sync --summary
git pull && composer install --no-dev && php artisan migrate --force && php artisan config:clear
glpi-agent --server https://glpi.corp.exemple.fr/front/inventory.php        # inventaire immédiat (agent GLPI)
```
