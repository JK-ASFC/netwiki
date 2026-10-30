---
title: Clients BitTorrent serveur — aide-mémoire des commandes
description: Commandes Transmission (transmission-remote, settings.json), qBittorrent-nox (WebUI, API Web v2 avec curl), Deluge (deluge-console) avec exemples — ajout de torrents et de liens magnet, liste, pause, suppression, limites de débit, ports, dossiers, vérification, usage légal (distributions Linux, ISO) et sécurité.
tags: [aide-mémoire, bittorrent, transmission, qbittorrent, deluge, iso]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-transmission|Transmission]], [[02-qbittorrent|qBittorrent]] et [[03-deluge|Deluge]]. Usage visé : distribution légale (images ISO de distributions, contenus libres, fichiers internes).

## Transmission (transmission-remote)

```bash
R="transmission-remote 127.0.0.1:9091 -n admin:$MDP"
$R -l                                                      # liste
$R -a https://cdimage.debian.org/debian-cd/current/amd64/bt-cd/debian-12.7.0-amd64-netinst.iso.torrent
$R -a "magnet:?xt=urn:btih:..."
$R -t 3 -i                                                 # détail
$R -t 3 -S                                                 # pause
$R -t 3 -s                                                 # reprise
$R -t 3 -v                                                 # vérifier les données
$R -t 3 -r                                                 # retirer (garder les fichiers) ; --remove-and-delete pour les effacer
$R -d 5000 -u 1000                                         # limites globales en Ko/s
$R -si                                                     # statistiques de session
sudo systemctl stop transmission-daemon && sudo nano /etc/transmission-daemon/settings.json && sudo systemctl start transmission-daemon
```

## qBittorrent-nox (API Web v2)

```bash
Q=http://127.0.0.1:8080
curl -s -c cookie.txt --data "username=admin&password=$MDP" $Q/api/v2/auth/login
curl -s -b cookie.txt $Q/api/v2/app/version
curl -s -b cookie.txt "$Q/api/v2/torrents/info?filter=downloading" | jq '.[] | {name, progress, dlspeed}'
curl -s -b cookie.txt -F "urls=https://releases.ubuntu.com/24.04/ubuntu-24.04.1-live-server-amd64.iso.torrent" -F "savepath=/srv/iso" $Q/api/v2/torrents/add
curl -s -b cookie.txt -d "hashes=all" $Q/api/v2/torrents/stop          # (pause dans les versions < 5)
curl -s -b cookie.txt -d "hashes=<hash>&deleteFiles=false" $Q/api/v2/torrents/delete
curl -s -b cookie.txt -d 'json={"dl_limit":5242880,"up_limit":1048576}' $Q/api/v2/app/setPreferences
```

## Deluge (deluge-console)

```bash
deluge-console "connect 127.0.0.1:58846 admin $MDP; info"
deluge-console "connect 127.0.0.1:58846 admin $MDP; add -p /srv/iso https://example.org/image.iso.torrent"
deluge-console "connect 127.0.0.1:58846 admin $MDP; pause *"
deluge-console "connect 127.0.0.1:58846 admin $MDP; config -s max_download_speed 5000"
```

## Sécurité

- Interfaces web (9091, 8080, 8112) uniquement en local ou derrière un proxy authentifié ; jamais exposées sans mot de passe.
- Service sous un compte dédié, dossiers de téléchargement sans droits d'exécution, port d'écoute unique ouvert sur le pare-feu.
- Respect du droit d'auteur : ne partagez que des contenus dont la diffusion est autorisée.
