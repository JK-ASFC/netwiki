---
title: Nginx RTMP — aide-mémoire des commandes
description: Commandes et configuration du module RTMP de Nginx avec exemples — installation (libnginx-mod-rtmp), bloc rtmp (applications live, enregistrement, HLS), restriction de la publication, clés de diffusion (on_publish), statistiques (rtmp_stat), diffusion avec ffmpeg et OBS, relais vers des plateformes (push), lecture HLS, tests et journaux.
tags: [aide-mémoire, nginx, rtmp, hls, ffmpeg, obs, direct]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-diffusion-direct|Nginx RTMP]].

## Installation et configuration

```bash
sudo apt install nginx libnginx-mod-rtmp
sudo nginx -t && sudo systemctl reload nginx
sudo ss -ltnp | grep 1935
```

```nginx
# /etc/nginx/nginx.conf (hors du bloc http)
rtmp {
    server {
        listen 1935;
        chunk_size 4096;
        application live {
            live on;
            allow publish 10.0.0.0/8;
            deny publish all;
            on_publish http://127.0.0.1:8080/auth;          # vérification de la clé de diffusion
            record all;
            record_path /srv/enregistrements;
            record_unique on;
            hls on;
            hls_path /var/www/hls;
            hls_fragment 3;
            hls_playlist_length 60;
            push rtmp://a.rtmp.youtube.com/live2/CLE-YOUTUBE;    # relais (optionnel)
        }
    }
}
```

```nginx
# Dans http { server { … } } : lecture HLS et statistiques
location /hls {
    types { application/vnd.apple.mpegurl m3u8; video/mp2t ts; }
    root /var/www;
    add_header Cache-Control no-cache;
}
location /stat {
    rtmp_stat all;
    allow 10.0.99.0/24;
    deny all;
}
```

## Diffuser

```bash
ffmpeg -re -i video.mp4 -c:v libx264 -preset veryfast -b:v 3000k -maxrate 3000k -bufsize 6000k -g 60 -c:a aac -b:a 128k -f flv "rtmp://direct.exemple.fr/live/cle-secrete"
ffmpeg -f v4l2 -i /dev/video0 -f alsa -i default -c:v libx264 -preset ultrafast -c:a aac -f flv rtmp://direct.exemple.fr/live/camera
```

OBS Studio : *Paramètres → Stream → Personnalisé*, serveur `rtmp://direct.exemple.fr/live`, clé `cle-secrete`.

## Lire et vérifier

```bash
ffplay rtmp://direct.exemple.fr/live/cle-secrete
ffplay https://direct.exemple.fr/hls/cle-secrete.m3u8
curl -s http://127.0.0.1/stat | xmllint --format - | grep -E "<name>|<nclients>"
ls -lh /var/www/hls/ /srv/enregistrements/
sudo tail -f /var/log/nginx/error.log
```
