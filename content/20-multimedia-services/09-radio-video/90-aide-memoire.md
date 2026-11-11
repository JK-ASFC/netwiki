---
title: Radio web et plates-formes vidéo — aide-mémoire
description: Commandes et ports d'AzuraCast (docker.sh install, update, backup, restore, reset-password), LibreTime (Docker Compose, migrate), Owncast (installation, admin, RTMP 1935), PeerTube (Docker, reset-password, import, prune-storage, sauvegarde) et MediaCMS (Docker Compose, manage.py, sauvegarde).
tags: [aide-mémoire, azuracast, libretime, owncast, peertube, mediacms, radio, vidéo]
icon: terminal
---

Explications : [[01-azuracast-libretime|AzuraCast et LibreTime]] · [[02-owncast|Owncast]] · [[03-peertube|PeerTube]] · [[04-mediacms|MediaCMS]].

## Ports

| Service | Ports |
| --- | --- |
| AzuraCast | 80/443, 8000 et suivants par station (flux, entrée des animateurs) |
| LibreTime | 8080 (web), 8000 (Icecast), 8001/8002 (entrées live) |
| Owncast | 8080 (web, admin), 1935 (RTMP) |
| PeerTube | 80/443, 1935 (RTMP pour les directs) |
| MediaCMS | 80/443 |

## Commandes

```bash
# AzuraCast (dans /var/azuracast)
sudo ./docker.sh install ; sudo ./docker.sh update-self && sudo ./docker.sh update
sudo ./docker.sh backup /var/azuracast/backups/azuracast.zip ; sudo ./docker.sh restore /var/azuracast/backups/azuracast.zip
sudo ./docker.sh cli azuracast:account:reset-password admin@exemple.fr

# LibreTime
docker compose run --rm api libretime-api migrate ; docker compose up -d

# Owncast
curl -s https://owncast.online/install.sh | bash
docker run -d -p 8080:8080 -p 1935:1935 -v owncast_data:/app/data owncast/owncast:latest
# Admin : http://serveur:8080/admin (changer le mot de passe abc123) ; OBS : rtmp://serveur:1935/live + clé

# PeerTube (dans /var/www/peertube)
docker compose exec -u peertube peertube npm run reset-password -- -u root
docker compose exec -u peertube peertube npm run prune-storage
docker compose exec -T postgres pg_dump -U peertube -Fc peertube_prod > peertube.dump

# MediaCMS (dans /opt/mediacms)
docker compose exec web python manage.py createsuperuser
docker compose exec web python manage.py changepassword admin
docker compose exec -T db pg_dump -U mediacms -Fc mediacms > mediacms.dump
```
