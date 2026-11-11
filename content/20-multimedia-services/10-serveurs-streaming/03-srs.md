---
title: SRS (Simple Realtime Server)
description: SRS, serveur de streaming haute performance en C++ (MIT) — RTMP, HLS, HTTP-FLV, WebRTC (WHIP/WHEP), SRT et DASH ; installation Docker, ports 1935, 1985, 8080, 8000/udp et 10080/udp, fichier srs.conf (vhost, HLS, DVR, transcodage, rappels HTTP), console et API, publication OBS et FFmpeg, grappes origine-périphérie.
tags: [srs, rtmp, hls, http-flv, webrtc, srt, streaming, docker]
icon: cast
---

**SRS** (*Simple Realtime Server*) est un serveur de diffusion très performant, utilisé par des plates-formes de direct. Il reçoit en **RTMP**, **SRT** ou **WebRTC** et distribue en **HLS**, **HTTP-FLV**, **DASH** ou **WebRTC**.

## Installation (Docker)

```bash
docker run -d --name srs --restart unless-stopped \
  -p 1935:1935 -p 1985:1985 -p 8080:8080 -p 8000:8000/udp -p 10080:10080/udp \
  -v /etc/srs/srs.conf:/usr/local/srs/conf/srs.conf:ro \
  ossrs/srs:6            # version majeure à adapter
```

| Port | Usage |
| --- | --- |
| TCP 1935 | RTMP (OBS, encodeurs) |
| TCP 1985 | API HTTP (statistiques, WHIP/WHEP pour WebRTC) |
| TCP 8080 | Serveur HTTP : HLS, HTTP-FLV, console et lecteurs de démonstration |
| UDP 8000 | Médias WebRTC |
| UDP 10080 | SRT |

## Configuration

```nginx /etc/srs/srs.conf
listen              1935;
max_connections     1000;
daemon              off;
srs_log_tank        console;

http_api    { enabled on; listen 1985; }
http_server { enabled on; listen 8080; dir ./objs/nginx/html; }

rtc_server  { enabled on; listen 8000; candidate $CANDIDATE; }   # adresse IP publique du serveur
srt_server  { enabled on; listen 10080; }

vhost __defaultVhost__ {
    hls {
        enabled         on;
        hls_fragment    2;
        hls_window      10;
    }
    http_remux { enabled on; mount [vhost]/[app]/[stream].flv; }
    rtc { enabled on; rtmp_to_rtc on; rtc_to_rtmp on; }
    dvr {
        enabled         on;
        dvr_path        ./objs/nginx/html/[app]/[stream].[timestamp].mp4;
        dvr_plan        session;
    }
    http_hooks {
        enabled         on;
        on_publish      http://127.0.0.1:8085/api/publish;   # refuser les flux non autorisés
    }
}
```

La syntaxe est proche de celle de Nginx. `$CANDIDATE` doit valoir l'adresse IP que les navigateurs peuvent joindre (variable d'environnement `CANDIDATE` du conteneur), sinon WebRTC échoue.

## Publier et lire

```bash
ffmpeg -re -i video.mp4 -c copy -f flv rtmp://serveur/live/demo      # OBS : serveur rtmp://serveur/live, clé demo
ffplay rtmp://serveur/live/demo
# HLS : http://serveur:8080/live/demo.m3u8   HTTP-FLV : http://serveur:8080/live/demo.flv
# WebRTC : console http://serveur:8080/ (lecteurs de démonstration, WHIP/WHEP)
curl -s http://serveur:1985/api/v1/streams/ | jq '.streams[] | {name, clients}'
```

## Sécurité et montée en charge

- **Rappels HTTP** (`on_publish`, `on_play`) : SRS interroge une application qui accepte ou refuse selon la clé ; c'est le mécanisme d'authentification.
- **Grappe origine / périphérie (edge)** : les serveurs edge tirent le flux de l'origine et servent les spectateurs ; HLS peut aussi passer par un CDN.

Voir aussi : [[01-protocoles-comparatif|protocoles et comparatif]]. Commandes : [[90-aide-memoire|aide-mémoire]].
