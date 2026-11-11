---
title: MediaMTX
description: MediaMTX (ex rtsp-simple-server, Go, MIT) — serveur et passerelle multiprotocole RTSP, RTMP, SRT, HLS et WebRTC (WHIP/WHEP) ; installation binaire, systemd et Docker, ports, mediamtx.yml (chemins, sources caméras à la demande, enregistrement, authentification), publication avec FFmpeg et OBS, lecture dans VLC et le navigateur, API et métriques.
tags: [mediamtx, rtsp, rtmp, srt, hls, webrtc, caméra ip, ffmpeg, streaming]
icon: cast
---

**MediaMTX** est un **binaire unique** qui reçoit et redistribue des flux dans tous les protocoles courants, avec conversion automatique : une caméra RTSP devient lisible dans un navigateur en HLS ou WebRTC, un flux OBS en RTMP devient lisible en RTSP ou SRT.

## Installation

```bash
# Binaire : prendre la dernière version sur la page des publications du projet (architecture amd64, arm64…)
V=1.12.3      # exemple : vérifier la dernière version
wget https://github.com/bluenviron/mediamtx/releases/download/v${V}/mediamtx_v${V}_linux_amd64.tar.gz
sudo mkdir -p /opt/mediamtx && sudo tar xzf mediamtx_v${V}_linux_amd64.tar.gz -C /opt/mediamtx

# Docker (réseau host : plus simple pour RTSP/UDP et WebRTC)
docker run -d --name mediamtx --restart unless-stopped --network host \
  -v /etc/mediamtx/mediamtx.yml:/mediamtx.yml:ro bluenviron/mediamtx:latest
```

```ini /etc/systemd/system/mediamtx.service
[Unit]
Description=MediaMTX
After=network-online.target

[Service]
ExecStart=/opt/mediamtx/mediamtx /etc/mediamtx/mediamtx.yml
Restart=on-failure
User=mediamtx

[Install]
WantedBy=multi-user.target
```

## Ports par défaut

| Port | Protocole |
| --- | --- |
| TCP 8554 (+ UDP 8000/8001 RTP/RTCP) | RTSP |
| TCP 1935 | RTMP |
| UDP 8890 | SRT |
| TCP 8888 | HLS (`http://serveur:8888/<chemin>`) |
| TCP 8889 + UDP 8189 | WebRTC (`http://serveur:8889/<chemin>`, WHIP/WHEP) |
| TCP 9997 / 9998 | API de contrôle / métriques Prometheus (désactivées par défaut) |

## Configuration

```yaml /etc/mediamtx/mediamtx.yml
api: yes
metrics: yes

authInternalUsers:
  - user: diffuseur
    pass: Mot-De-Passe-Long
    permissions:
      - action: publish
  - user: any
    pass:
    permissions:
      - action: read
      - action: playback

paths:
  # Caméra IP tirée seulement quand quelqu'un regarde
  camera-hall:
    source: rtsp://lecture:motdepasse@192.168.10.51:554/Streaming/Channels/101
    sourceOnDemand: yes

  # Flux publié par OBS ou FFmpeg, enregistré sur disque
  conference:
    record: yes
    recordPath: /srv/enregistrements/%path/%Y-%m-%d_%H-%M-%S-%f
    recordDeleteAfter: 7d

  # Tous les autres chemins acceptés en publication
  all_others:
```

## Publier et lire

```bash
# Publier un fichier en boucle (test)
ffmpeg -re -stream_loop -1 -i video.mp4 -c copy -f rtsp rtsp://diffuseur:Mot-De-Passe-Long@serveur:8554/test
# Publier en SRT
ffmpeg -re -i video.mp4 -c copy -f mpegts "srt://serveur:8890?streamid=publish:test:diffuseur:Mot-De-Passe-Long"

# Lire
ffplay rtsp://serveur:8554/camera-hall
vlc rtsp://serveur:8554/conference
# Navigateur : http://serveur:8888/camera-hall (HLS) ou http://serveur:8889/camera-hall (WebRTC)
```

OBS : *Paramètres → Stream*, service personnalisé, serveur `rtmp://serveur:1935`, clé `conference` (avec identifiants : `conference?user=diffuseur&pass=…`), ou **WHIP** vers `http://serveur:8889/conference/whip`.

## API

```bash
curl -s http://127.0.0.1:9997/v3/paths/list | jq '.items[] | {name, ready, readers: (.readers|length)}'
curl -s http://127.0.0.1:9998/metrics | grep paths
```

> [!WARNING]
> Par défaut, tout le monde peut publier et lire. Définissez `authInternalUsers` (ou une authentification HTTP externe) et filtrez les ports avant toute exposition hors du réseau local.

Voir aussi : [[01-protocoles-comparatif|protocoles et comparatif]]. Commandes : [[90-aide-memoire|aide-mémoire]].
