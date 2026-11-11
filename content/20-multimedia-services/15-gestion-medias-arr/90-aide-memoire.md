---
title: Pile *arr — aide-mémoire
description: Ports, images Docker, arborescence /data, droits et commandes API de Sonarr, Radarr, Lidarr, Readarr, Prowlarr, Jackett et Bazarr, et synchronisation Recyclarr.
tags: [aide-mémoire, sonarr, radarr, lidarr, readarr, prowlarr, jackett, bazarr]
icon: terminal
---

Explications : [[01-pile-arr|architecture]] · [[02-sonarr-radarr-lidarr-readarr|Sonarr, Radarr, Lidarr, Readarr]] · [[03-prowlarr-jackett-bazarr|Prowlarr, Jackett, Bazarr]].

## Ports et images

| Application | Port | Image LinuxServer | API |
| --- | --- | --- | --- |
| Sonarr | 8989 | `lscr.io/linuxserver/sonarr` | `/api/v3` |
| Radarr | 7878 | `lscr.io/linuxserver/radarr` | `/api/v3` |
| Lidarr | 8686 | `lscr.io/linuxserver/lidarr` | `/api/v1` |
| Readarr (archivé) | 8787 | `lscr.io/linuxserver/readarr` | `/api/v1` |
| Prowlarr | 9696 | `lscr.io/linuxserver/prowlarr` | `/api/v1` |
| Jackett | 9117 | `lscr.io/linuxserver/jackett` | Torznab |
| Bazarr | 6767 | `lscr.io/linuxserver/bazarr` | `/api` |

## Commandes

```bash
sudo mkdir -p /srv/data/{torrents,media}/{films,series,musique} && sudo chown -R 1000:1000 /srv/data
docker compose up -d ; docker compose logs -f sonarr
stat -c '%h %n' /srv/data/media/films/*/*.mkv | head      # nombre de liens > 1 : lien physique OK
curl -s -H "X-Api-Key: $SONARR_CLE" http://serveur:8989/api/v3/system/status | jq '.version'
curl -s -X POST -H "X-Api-Key: $SONARR_CLE" -H 'Content-Type: application/json' -d '{"name":"RefreshSeries"}' http://serveur:8989/api/v3/command
docker run --rm -v ./recyclarr:/config ghcr.io/recyclarr/recyclarr sync
```
