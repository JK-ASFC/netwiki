---
title: LMS — aide-mémoire des commandes
description: Commandes Moodle (admin/cli install, cron, upgrade, maintenance, purge_caches, reset_password), Canvas (rake), Chamilo, ILIAS (cli/setup.php install, update, status) et Open edX avec Tutor (local launch, do createuser, logs) avec exemples.
tags: [aide-mémoire, moodle, ilias, chamilo, open edx, tutor, canvas]
icon: terminal
---

Explications : [[01-moodle|Moodle]] · [[02-canvas-chamilo-ilias-openedx|Canvas, Chamilo, ILIAS, Open edX]].

```bash
cd /var/www/moodle
sudo -u www-data php admin/cli/cron.php
sudo -u www-data php admin/cli/maintenance.php --enable ; sudo -u www-data php admin/cli/maintenance.php --disable
sudo -u www-data php admin/cli/upgrade.php --non-interactive
sudo -u www-data php admin/cli/purge_caches.php
sudo -u www-data php admin/cli/reset_password.php
sudo -u www-data php admin/cli/cfg.php --name=debug --set=0
cd /var/canvas && RAILS_ENV=production bundle exec rake db:migrate && RAILS_ENV=production bundle exec rake canvas:compile_assets
cd /var/www/ilias && sudo -u www-data php cli/setup.php update /var/www/config/ilias.json ; sudo -u www-data php cli/setup.php status /var/www/config/ilias.json
tutor local launch ; tutor local status ; tutor local logs -f lms
tutor local do createuser --staff --superuser jk-admin admin@corp.exemple.fr
tutor local do importdemocourse
```
