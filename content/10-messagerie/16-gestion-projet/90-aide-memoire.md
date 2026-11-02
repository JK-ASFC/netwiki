---
title: Gestion de projet — aide-mémoire des commandes
description: Commandes des outils de gestion de projet avec exemples — OpenProject (openproject configure, run backup, console, config:set, Docker), Redmine (rake db:migrate, plugins, courriels IMAP, Docker), Taiga (launch-taiga.sh, taiga-manage.sh), Plane (setup.sh), Leantime (docker compose), Tuleap (docker compose), Trac (trac-admin, tracd), Phorge (bin/config, bin/storage, bin/phd), Kanboard (cli cronjob), Wekan (snap set), Vikunja (vikunja user).
tags: [aide-mémoire, openproject, redmine, taiga, plane, kanboard, vikunja, phorge, trac]
icon: terminal
---

Explications : [[01-openproject|OpenProject]] · [[02-redmine|Redmine]] · [[03-taiga-plane-leantime|Taiga, Plane, Leantime]] · [[04-tuleap-trac-phorge|Tuleap, Trac, Phorge]] · [[05-kanban-taches|Kanboard, Wekan, Vikunja]].

## OpenProject

```bash
sudo openproject configure ; sudo openproject reconfigure
sudo openproject config:set SERVER_PROTOCOL_FORCE_HTTPS="true"
sudo openproject run backup ; ls /var/db/openproject/backup
sudo openproject run console ; sudo openproject restart
docker logs -f openproject
docker exec openproject su - postgres -c 'pg_dump -d openproject -x -O' > /srv/sauvegardes/openproject-$(date +%F).sql
```

## Redmine

```bash
cd /opt/redmine
sudo RAILS_ENV=production bundle exec rake db:migrate
sudo RAILS_ENV=production bundle exec rake redmine:plugins:migrate
sudo -u redmine RAILS_ENV=production bundle exec rake redmine:email:receive_imap host=imap.corp.exemple.fr ssl=1 username=support@corp.exemple.fr password=MdpImap2026 project=support
sudo tail -f log/production.log
docker logs -f redmine ; docker exec -it redmine bundle exec rails console -e production
```

## Taiga, Plane, Leantime, Tuleap

```bash
cd taiga-docker && ./launch-taiga.sh && ./taiga-manage.sh createsuperuser
cd /opt/plane && ./setup.sh                      # Install, Start, Stop, Upgrade, Logs, Backup
cd docker-leantime && docker compose up -d && docker compose logs -f
cd tuleap && docker compose up -d && docker compose logs -f web
```

## Trac et Phorge

```bash
sudo /opt/trac/bin/trac-admin /srv/trac/infra initenv "Projet infrastructure" sqlite:db/trac.db
sudo /opt/trac/bin/trac-admin /srv/trac/infra permission add jk TRAC_ADMIN
sudo /opt/trac/bin/trac-admin /srv/trac/infra upgrade
sudo /opt/trac/bin/tracd --port 8000 /srv/trac/infra
cd /var/www/phorge
sudo ./bin/config set phabricator.base-uri 'https://phorge.corp.exemple.fr/'
sudo ./bin/storage upgrade
sudo ./bin/phd restart ; sudo ./bin/phd status
cd /var/www/phorge && sudo git pull && cd ../arcanist && sudo git pull     # mise à jour, puis storage upgrade
```

## Kanboard, Wekan, Vikunja

```bash
cd /var/www/kanboard && sudo -u www-data ./cli cronjob
docker exec -it kanboard ./cli cronjob
sudo snap set wekan root-url='https://kanban.corp.exemple.fr' ; sudo snap set wekan port='3001'
sudo systemctl restart snap.wekan.wekan ; sudo snap logs wekan
docker exec vikunja /app/vikunja/vikunja user create -u jk -e jk@corp.exemple.fr -p 'MdpTemporaire2026!'
docker exec vikunja /app/vikunja/vikunja user list
```
