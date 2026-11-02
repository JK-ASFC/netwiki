---
title: Groupware et agendas — aide-mémoire des commandes
description: Commandes SOGo (service, sogo-tool backup, restore, expire-sessions, alarmes, journaux), Kopano (kopano-admin), Cal.diy (docker compose), Baïkal (Docker, sauvegarde SQLite) et DAViCal (création de la base), tests CalDAV et CardDAV avec curl.
tags: [aide-mémoire, sogo, caldav, carddav, baikal, davical, cal.com]
icon: terminal
---

Explications : [[01-sogo-kopano|SOGo et Kopano]] · [[02-calcom-baikal-davical|Cal.com, Baïkal, DAViCal]].

```bash
sudo systemctl status sogo ; sudo tail -f /var/log/sogo/sogo.log
sudo -u sogo sogo-tool backup /srv/sauvegardes/sogo ALL
sudo -u sogo sogo-tool restore -l /srv/sauvegardes/sogo jk
sudo -u sogo sogo-tool restore -F ALL /srv/sauvegardes/sogo jk
sudo -u sogo sogo-tool expire-sessions 60
sudo -u sogo /usr/sbin/sogo-ealarms-notify
kopano-admin -l                                        # Kopano (installations existantes)
cd calcom && docker compose up -d database redis calcom && docker compose logs -f calcom
docker exec baikal ls /var/www/baikal/Specific/db
sudo sqlite3 /var/www/baikal/Specific/db/db.sqlite ".backup /srv/sauvegardes/baikal-$(date +%F).sqlite"
sudo -u postgres /usr/share/davical/dba/create-database.sh davical 'MdpAdminDavical2026'
```

## Tests CalDAV et CardDAV

```bash
curl -s -o /dev/null -w "%{http_code} %{redirect_url}\n" https://dav.corp.exemple.fr/.well-known/caldav
curl -s -u jk -X PROPFIND -H 'Depth: 0' https://dav.corp.exemple.fr/dav.php/calendars/jk/ | head -20
curl -s -u jk -X PROPFIND -H 'Depth: 1' https://mail.corp.exemple.fr/SOGo/dav/jk@corp.exemple.fr/Calendar/ | grep -o '<D:href>[^<]*' | head
```
