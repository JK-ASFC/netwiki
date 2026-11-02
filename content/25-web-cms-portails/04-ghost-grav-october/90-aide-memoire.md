---
title: Ghost, Grav et October — aide-mémoire des commandes
description: Commandes Ghost-CLI (install, ls, status, log, doctor, restart, update), Ghost Docker, Grav (bin/grav install, clearcache, backup, bin/gpm install, update, selfupgrade, bin/plugin login new-user) et October CMS (october:install, october:update, october:migrate, schedule:run) avec exemples.
tags: [aide-mémoire, ghost, grav, october cms]
icon: terminal
---

Explications : [[01-ghost|Ghost]] · [[02-grav-october|Grav et October CMS]].

```bash
cd /var/www/ghost && ghost install ; ghost ls ; ghost status ; ghost log ; ghost doctor ; ghost restart ; ghost update
docker compose logs -f ghost
cd /var/www/site-grav && bin/grav install ; bin/grav clearcache ; bin/grav backup
bin/gpm index ; bin/gpm install admin ; bin/gpm update ; bin/gpm selfupgrade
bin/plugin login new-user -u redacteur -p 'MdpTemporaire2026!' -e redacteur@corp.exemple.fr -P b -N "Rédacteur" -t "Rédacteur"
cd /var/www/site-october && php artisan october:install ; php artisan october:update ; php artisan october:migrate
php artisan schedule:run ; php artisan cache:clear
```
