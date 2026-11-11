---
title: Serveurs de musique — aide-mémoire
description: Commandes et ports d'Ampache (Docker, cron updateCatalog), Lyrion Music Server (ports 9000, 3483, 9090, CLI, Squeezelite), Mopidy (mopidyctl, mpc, ports 6680 et 6600), Airsonic-Advanced (port 4040) et Funkwhale (funkwhale-manage, import, sauvegarde).
tags: [aide-mémoire, ampache, lyrion, mopidy, airsonic, funkwhale, musique]
icon: terminal
---

Explications : [[01-comparatif|comparatif]] · [[02-ampache|Ampache]] · [[03-lyrion-music-server|Lyrion]] · [[04-mopidy|Mopidy]] · [[05-airsonic-advanced|Airsonic-Advanced]] · [[06-funkwhale|Funkwhale]].

## Ports

| Serveur | Ports |
| --- | --- |
| Ampache | 80/443 (serveur web) |
| Lyrion Music Server | TCP 9000 (web), TCP/UDP 3483 (lecteurs), TCP 9090 (CLI) |
| Mopidy | TCP 6680 (HTTP, Iris), TCP 6600 (MPD) |
| Airsonic-Advanced | TCP 4040 |
| Funkwhale | 80/443 (front Nginx) |

## Commandes

```bash
# Ampache
docker logs ampache
php /var/www/ampache/bin/cli run:updateCatalog -c -a -g

# Lyrion Music Server
sudo systemctl status lyrionmusicserver
printf 'players 0 10\nexit\n' | nc serveur 9090
squeezelite -l ; squeezelite -n Bureau -o default -s 192.168.1.20

# Mopidy
sudo mopidyctl config ; sudo mopidyctl local scan ; sudo systemctl restart mopidy
mpc -h serveur status ; mpc -h serveur volume 40

# Funkwhale
docker compose run --rm api funkwhale-manage migrate
docker compose run --rm api funkwhale-manage fw users create --superuser
docker compose run --rm api funkwhale-manage import_files <id> "/music/**/*.flac" --recursive --noinput --in-place
docker compose exec -T postgres pg_dumpall -U postgres > funkwhale.sql
```
