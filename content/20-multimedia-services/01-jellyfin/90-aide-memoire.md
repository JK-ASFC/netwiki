---
title: Jellyfin — aide-mémoire des commandes
description: Commandes Jellyfin avec exemples — installation (dépôt officiel, Docker, Windows, macOS), service et chemins (configuration, données, cache, journaux), transcodage matériel (VA-API/QSV, NVENC, groupe render, vérification ffmpeg), droits sur les médias, API REST (clé, bibliothèques, rafraîchissement, utilisateurs, sessions), sauvegarde et restauration, proxy inverse.
tags: [aide-mémoire, jellyfin, multimédia, transcodage, docker, api]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-installation|Jellyfin]].

## Installation et service

```bash
curl https://repo.jellyfin.org/install-debuntu.sh | sudo bash
sudo systemctl status jellyfin
sudo journalctl -u jellyfin -f
ls /etc/jellyfin /var/lib/jellyfin /var/cache/jellyfin /var/log/jellyfin
docker run -d --name jellyfin --network host -v /srv/jellyfin/config:/config -v /srv/jellyfin/cache:/cache \
  -v /srv/medias:/media:ro --device /dev/dri:/dev/dri --restart unless-stopped jellyfin/jellyfin
```

```powershell
winget install Jellyfin.Server          # Windows (ou installeur officiel)
```

macOS : application Jellyfin Server (archive officielle). Interface : `http://<serveur>:8096`.

## Transcodage matériel

```bash
sudo usermod -aG render,video jellyfin && sudo systemctl restart jellyfin     # VA-API / QSV (Intel, AMD)
ls -l /dev/dri
/usr/lib/jellyfin-ffmpeg/vainfo --display drm --device /dev/dri/renderD128
/usr/lib/jellyfin-ffmpeg/ffmpeg -hide_banner -hwaccels
nvidia-smi                                                                  # NVENC (NVIDIA)
```

Activation : *Tableau de bord → Lecture → Transcodage* (choisir l'accélération et cocher les codecs pris en charge par le matériel).

## Droits sur les médias

```bash
sudo setfacl -R -m u:jellyfin:rx /srv/medias
sudo -u jellyfin ls /srv/medias/Films | head
```

## API REST

```bash
J=http://127.0.0.1:8096; H=(-s -H "Authorization: MediaBrowser Token=\"$CLE_API\"")
curl "${H[@]}" $J/System/Info | jq '{ServerName, Version}'
curl "${H[@]}" $J/Library/VirtualFolders | jq '.[] | {Name, Locations}'
curl "${H[@]}" -X POST $J/Library/Refresh                        # analyser toutes les bibliothèques
curl "${H[@]}" $J/Users | jq '.[].Name'
curl "${H[@]}" $J/Sessions | jq '.[] | {UserName, Client, DeviceName, NowPlaying: .NowPlayingItem.Name}'
```

Clé d'API : *Tableau de bord → Clés API*.

## Sauvegarde et restauration

```bash
sudo systemctl stop jellyfin
sudo tar czf /srv/sauvegardes/jellyfin-$(date +%F).tar.gz /etc/jellyfin /var/lib/jellyfin
sudo systemctl start jellyfin
```

## Proxy inverse (Nginx)

```nginx
location / {
    proxy_pass http://127.0.0.1:8096;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_buffering off;
}
```
