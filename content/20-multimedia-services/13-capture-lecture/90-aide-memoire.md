---
title: Capture et lecture — aide-mémoire
description: Réglages et raccourcis d'OBS Studio (sortie, diffusion RTMP/SRT/WHIP, WebSocket 4455), commandes VLC et cvlc (flux réseau, enregistrement, transcodage, interfaces HTTP et telnet), mpv (flux, IPC, raccourcis) et Kodi (sources, advancedsettings.xml, JSON-RPC).
tags: [aide-mémoire, obs studio, vlc, mpv, kodi]
icon: terminal
---

Explications : [[01-obs-studio|OBS Studio]] · [[02-vlc-mpv|VLC et mpv]] · [[03-kodi|Kodi]].

## OBS Studio

| Réglage | Valeur conseillée |
| --- | --- |
| Diffusion 1080p30 | Encodeur matériel, CBR 4 500-6 000 kbit/s, images clés 2 s, AAC 160 kbit/s |
| Serveur personnalisé | `rtmp://serveur/live` + clé ; `srt://serveur:port?streamid=…` ; WHIP |
| Enregistrement | MKV puis *Fichier → Remuxer* en MP4 |
| Contrôle à distance | WebSocket, port 4455, mot de passe |

## VLC et mpv

```bash
vlc --rtsp-tcp rtsp://cam/stream1 ; vlc udp://@239.1.1.1:5000 ; vlc https://serveur/live/index.m3u8
cvlc rtsp://cam/stream1 --sout=file/mp4:cam.mp4 --run-time=3600 vlc://quit
cvlc in.avi --sout '#transcode{vcodec=h264,vb=2000,acodec=mp4a,ab=128}:std{access=file,mux=mp4,dst=out.mp4}' vlc://quit
cvlc --intf http --http-port 8080 --http-password 'mdp' playlist.m3u
mpv --rtsp-transport=tcp rtsp://cam/stream1 ; mpv --input-ipc-server=/tmp/mpv.sock video.mkv
```

## Kodi

```bash
curl -s -u kodi:mdp -H 'Content-Type: application/json' -d '{"jsonrpc":"2.0","method":"VideoLibrary.Scan","id":1}' http://tv:8080/jsonrpc
# Base partagée : ~/.kodi/userdata/advancedsettings.xml (videodatabase / musicdatabase type mysql)
```
