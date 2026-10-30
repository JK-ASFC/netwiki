---
title: Plex Media Server — aide-mémoire des commandes
description: Commandes Plex avec exemples — installation (dépôt, Docker avec PLEX_CLAIM, Windows, macOS), service et chemins de données, jeton X-Plex-Token, API (bibliothèques, analyse, sessions, identité), outil Plex Media Scanner, maintenance de la base (Plex SQLite, vérification), sauvegarde et migration, accès distant et ports, journaux.
tags: [aide-mémoire, plex, multimédia, docker, api, sauvegarde]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-installation-exploitation|Plex]].

## Installation et service

```bash
sudo systemctl status plexmediaserver
sudo journalctl -u plexmediaserver -f
D="/var/lib/plexmediaserver/Library/Application Support/Plex Media Server"
ls "$D"                                         # Preferences.xml, Plug-in Support/Databases, Logs
docker run -d --name plex --network host -e TZ=Europe/Paris -e PLEX_CLAIM="claim-xxxxxxxx" \
  -v /srv/plex/config:/config -v /srv/medias:/data:ro --device /dev/dri:/dev/dri plexinc/pms-docker
```

Le jeton de revendication `PLEX_CLAIM` (valable quelques minutes) s'obtient sur `https://plex.tv/claim`. Interface : `http://<serveur>:32400/web`.

## Jeton et API

```bash
T=$(grep -oP 'PlexOnlineToken="\K[^"]+' "$D/Preferences.xml")
P=http://127.0.0.1:32400
curl -s "$P/identity" | grep -o 'version="[^"]*"'
curl -s -H "Accept: application/json" "$P/library/sections?X-Plex-Token=$T" | jq '.MediaContainer.Directory[] | {key, title, type}'
curl -s "$P/library/sections/1/refresh?X-Plex-Token=$T"                   # analyser une bibliothèque
curl -s -H "Accept: application/json" "$P/status/sessions?X-Plex-Token=$T" | jq '.MediaContainer.Metadata[]? | {title, user: .User.title, player: .Player.title}'
```

## Outils en ligne de commande

```bash
B=/usr/lib/plexmediaserver
sudo -u plex "$B/Plex Media Scanner" --list
sudo -u plex "$B/Plex Media Scanner" --scan --refresh --section 1
# Vérifier la base (service arrêté)
sudo systemctl stop plexmediaserver
sudo -u plex "$B/Plex SQLite" "$D/Plug-in Support/Databases/com.plexapp.plugins.library.db" "PRAGMA integrity_check;"
sudo systemctl start plexmediaserver
```

## Sauvegarde et migration

```bash
sudo systemctl stop plexmediaserver
sudo tar czf /srv/sauvegardes/plex-$(date +%F).tar.gz --exclude='Cache' --exclude='Codecs' -C /var/lib/plexmediaserver "Library/Application Support/Plex Media Server"
sudo systemctl start plexmediaserver
```

Migration : restaurer le répertoire sur le nouveau serveur (mêmes chemins de médias ou réanalyse), puis réclamer le serveur sur le compte Plex.

## Réseau et journaux

| Port | Usage |
| --- | --- |
| TCP 32400 | Serveur (accès distant : redirection de ce port ou relais Plex) |
| UDP 32410-32414, 1900, 5353 | Découverte sur le LAN |

```bash
tail -f "$D/Logs/Plex Media Server.log"
```
