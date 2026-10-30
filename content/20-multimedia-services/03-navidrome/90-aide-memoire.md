---
title: Navidrome — aide-mémoire des commandes
description: Commandes Navidrome avec exemples — installation (binaire, Docker), configuration (navidrome.toml, variables ND_), analyse de la bibliothèque (scan complet), API Subsonic (ping, recherche, listes), sauvegarde de la base, clients compatibles, proxy inverse, journaux.
tags: [aide-mémoire, navidrome, musique, subsonic, docker, streaming]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-installation-configuration|Navidrome]].

## Installation et configuration

```bash
docker run -d --name navidrome -p 4533:4533 -e ND_SCANSCHEDULE=1h -e ND_LOGLEVEL=info -e ND_BASEURL="" \
  -v /srv/navidrome/data:/data -v /srv/musique:/music:ro --restart unless-stopped deluan/navidrome:latest
sudo systemctl status navidrome
navidrome --version
```

```toml
# /etc/navidrome/navidrome.toml
MusicFolder = "/srv/musique"
DataFolder = "/var/lib/navidrome"
ScanSchedule = "@every 1h"
Address = "127.0.0.1"
Port = 4533
EnableSharing = true
DefaultLanguage = "fr"
```

## Analyse de la bibliothèque

```bash
navidrome scan --full --configfile /etc/navidrome/navidrome.toml
docker exec navidrome /app/navidrome scan --full
```

## API Subsonic

```bash
N=https://musique.exemple.fr/rest; Q="u=amartin&p=$MDP&v=1.16.1&c=netwiki&f=json"
curl -s "$N/ping?$Q" | jq '."subsonic-response".status'
curl -s "$N/search3?$Q&query=daft" | jq '."subsonic-response".searchResult3.album[]?.name'
curl -s "$N/getPlaylists?$Q" | jq '."subsonic-response".playlists.playlist[]?.name'
```

(Préférer l'authentification par jeton Subsonic `t` + `s` plutôt que le mot de passe en clair dans l'URL.)

## Sauvegarde et journaux

```bash
sqlite3 /var/lib/navidrome/navidrome.db ".backup '/srv/sauvegardes/navidrome-$(date +%F).db'"
sudo journalctl -u navidrome -f
```

Clients compatibles : interface web intégrée, Symfonium, Substreamer, Feishin, Sonixd et tous les clients Subsonic (Android, iOS, Windows, macOS, Linux).
