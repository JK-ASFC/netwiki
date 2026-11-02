---
title: Plateformes d'auto-hébergement — aide-mémoire des commandes
description: Commandes YunoHost (tools, domain, user, group, permission, app, backup, diagnosis, firewall, settings, service), CasaOS (installation, services, désinstallation), Runtipi (runtipi-cli start, restart, update, app, reset-password) et Docker utiles au diagnostic.
tags: [aide-mémoire, yunohost, casaos, runtipi, umbrel]
icon: terminal
---

Références : [[01-presentation-comparatif|comparatif]], [[02-yunohost|YunoHost]], [[03-casaos-runtipi-umbrel|CasaOS, Runtipi et Umbrel]].

## YunoHost

```bash
sudo yunohost tools postinstall
sudo yunohost tools update ; sudo yunohost tools upgrade system ; sudo yunohost tools upgrade apps
sudo yunohost domain list ; sudo yunohost domain add cloud.corp.exemple.fr ; sudo yunohost domain cert install cloud.corp.exemple.fr
sudo yunohost domain dns suggest corp.exemple.fr
sudo yunohost diagnosis run --force ; sudo yunohost diagnosis show --issues
sudo yunohost user list ; sudo yunohost user create bob --fullname "Bob Durand" --domain corp.exemple.fr
sudo yunohost user group list ; sudo yunohost user permission list
sudo yunohost app list ; sudo yunohost app install nextcloud ; sudo yunohost app upgrade nextcloud ; sudo yunohost app remove nextcloud
sudo yunohost backup create ; sudo yunohost backup list ; sudo yunohost backup restore <nom>
sudo yunohost firewall list ; sudo yunohost firewall allow TCP 51820
sudo yunohost settings list ; sudo yunohost service status nginx
sudo yunohost log list ; sudo yunohost log share <journal>
```

## CasaOS

```bash
curl -fsSL https://get.casaos.io | sudo bash
sudo systemctl status casaos ; sudo systemctl restart casaos
casaos-uninstall
ls /DATA/AppData
```

## Runtipi

```bash
sudo ./runtipi-cli start ; sudo ./runtipi-cli stop ; sudo ./runtipi-cli restart
sudo ./runtipi-cli update latest
sudo ./runtipi-cli app start jellyfin ; sudo ./runtipi-cli app stop jellyfin
sudo ./runtipi-cli reset-password
```

## Docker (diagnostic commun)

```bash
docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'
docker logs -f --tail 100 <conteneur>
docker stats --no-stream
docker system df ; docker image prune -a
```
