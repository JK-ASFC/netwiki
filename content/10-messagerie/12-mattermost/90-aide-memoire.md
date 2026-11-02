---
title: Mattermost — aide-mémoire des commandes
description: Commandes Mattermost avec exemples — service systemd, journaux, test de l'API, mmctl (connexion, mode local, utilisateurs, équipes, canaux, rôles, configuration, greffons, LDAP, export), Docker Compose officiel, sauvegarde et restauration PostgreSQL, clients winget et Homebrew.
tags: [aide-mémoire, mattermost, mmctl, docker, postgresql]
icon: terminal
---

Explications : [[01-presentation-installation|installation]] · [[02-configuration-exploitation|configuration]] · [[03-interface-graphique|interface]].

## Service et diagnostic

```bash
sudo systemctl status mattermost ; sudo systemctl restart mattermost
sudo journalctl -u mattermost -f
sudo tail -f /opt/mattermost/logs/mattermost.log | jq -r '.msg'
curl -s http://localhost:8065/api/v4/system/ping?get_server_status=true | jq
/opt/mattermost/bin/mattermost version
```

## mmctl

```bash
export PATH=$PATH:/opt/mattermost/bin
mmctl auth login https://chat.corp.exemple.fr --name corp --username admin
sudo -u mattermost /opt/mattermost/bin/mmctl --local system status          # mode local (socket Unix)
mmctl system version
mmctl user create --email jk@corp.exemple.fr --username jk --password 'MdpTemporaire2026!' --system-admin
mmctl user search jk@corp.exemple.fr
mmctl user list
mmctl user change-password jk --password 'NouveauMdp2026!'
mmctl user deactivate ancien.agent@corp.exemple.fr
mmctl user activate ancien.agent@corp.exemple.fr
mmctl permissions role assign system_admin jk
mmctl team create --name infra --display-name "Équipe infrastructure"
mmctl team list
mmctl team users add infra jk@corp.exemple.fr
mmctl channel create --team infra --name supervision --display-name "Supervision"
mmctl channel create --team infra --name astreinte --display-name "Astreinte" --private
mmctl channel users add infra:supervision jk@corp.exemple.fr
mmctl channel list infra
mmctl channel archive infra:ancien-projet
mmctl config get ServiceSettings.SiteURL
mmctl config set TeamSettings.EnableOpenServer false
mmctl plugin list ; mmctl plugin enable com.mattermost.calls
mmctl ldap sync                                   # édition Enterprise
mmctl export create ; mmctl export list
```

## Docker Compose officiel

```bash
cd mattermost-docker
docker compose -f docker-compose.yml -f docker-compose.without-nginx.yml up -d
docker compose -f docker-compose.yml -f docker-compose.without-nginx.yml logs -f mattermost
docker compose -f docker-compose.yml -f docker-compose.without-nginx.yml pull     # après changement de MATTERMOST_IMAGE_TAG
docker compose -f docker-compose.yml -f docker-compose.without-nginx.yml exec mattermost mmctl --local system status
```

## Sauvegarde et restauration

```bash
sudo -u postgres pg_dump -Fc mattermost > /srv/sauvegardes/mattermost-$(date +%F).dump
sudo tar czf /srv/sauvegardes/mattermost-fichiers-$(date +%F).tar.gz -C /opt/mattermost data config
sudo systemctl stop mattermost
sudo -u postgres pg_restore --clean --if-exists -d mattermost /srv/sauvegardes/mattermost-2026-11-02.dump
sudo systemctl start mattermost
```

## Clients et webhooks

```powershell
winget install --id Mattermost.MattermostDesktop -e
```

```bash
brew install --cask mattermost
curl -s -X POST -H 'Content-Type: application/json' -d '{"text": "Sauvegarde terminée sur srv-bkp-01"}' https://chat.corp.exemple.fr/hooks/xxxgenerexxx
```
