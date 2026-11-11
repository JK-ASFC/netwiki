---
title: Serveurs de streaming — aide-mémoire
description: Ports, adresses de publication et de lecture et commandes de MediaMTX, SRS, OvenMediaEngine, Ant Media Server, Red5 et Restreamer ; tests avec FFmpeg, ffplay et VLC.
tags: [aide-mémoire, mediamtx, srs, ovenmediaengine, ant media, red5, restreamer, ffmpeg]
icon: terminal
---

Explications : [[01-protocoles-comparatif|protocoles]] · [[02-mediamtx|MediaMTX]] · [[03-srs|SRS]] · [[04-ovenmediaengine|OvenMediaEngine]] · [[05-ant-media-red5|Ant Media, Red5]] · [[06-restreamer|Restreamer]].

## Ports

| Serveur | Entrées | Sorties, administration |
| --- | --- | --- |
| MediaMTX | RTSP 8554, RTMP 1935, SRT 8890/udp, WebRTC 8889 | HLS 8888, WebRTC 8889 + 8189/udp, API 9997, métriques 9998 |
| SRS | RTMP 1935, SRT 10080/udp, WebRTC 8000/udp | HTTP 8080 (HLS, FLV, console), API 1985 |
| OvenMediaEngine | RTMP 1935, SRT 9999/udp, WHIP 3333 | WebRTC et LL-HLS 3333/3334, TURN 3478, ICE 10000-10004/udp |
| Ant Media Server | RTMP 1935, SRT 4200/udp, WebRTC | 5080/5443 |
| Red5 | RTMP 1935 | 5080 |
| Restreamer | RTMP 1935, RTMPS 1936, SRT 6000/udp | 8080/8181 |

## Publier et lire pour tester

```bash
ffmpeg -re -stream_loop -1 -i video.mp4 -c copy -f flv rtmp://serveur/live/test          # RTMP (SRS, Red5…)
ffmpeg -re -stream_loop -1 -i video.mp4 -c copy -f rtsp rtsp://serveur:8554/test          # RTSP (MediaMTX)
ffmpeg -re -i video.mp4 -c copy -f mpegts "srt://serveur:8890?streamid=publish:test"      # SRT (MediaMTX)
ffplay rtsp://serveur:8554/test ; ffplay rtmp://serveur/live/test
vlc http://serveur:8888/test/index.m3u8                                                     # HLS (MediaMTX)
```

## Administration

```bash
curl -s http://127.0.0.1:9997/v3/paths/list | jq          # MediaMTX
curl -s http://serveur:1985/api/v1/streams/ | jq           # SRS
sudo systemctl status antmedia ; sudo /usr/local/antmedia/enable_ssl.sh -d diffusion.exemple.fr
docker logs -f restreamer
```
