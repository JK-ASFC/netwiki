---
title: Empaquetage et transcodage automatisé — aide-mémoire
description: Commandes de préparation des qualités avec FFmpeg, Shaka Packager (DASH et HLS), Bento4 (mp4info, mp4fragment, mp4dash, mp4hls, mp4encrypt), et ports et volumes de Tdarr, Unmanic et FileFlows.
tags: [aide-mémoire, shaka packager, bento4, tdarr, unmanic, fileflows, dash, hls]
icon: terminal
---

Explications : [[01-shaka-packager-bento4|Shaka Packager et Bento4]] · [[02-tdarr-unmanic-fileflows|Tdarr, Unmanic, FileFlows]].

## Préparer et empaqueter

```bash
ffmpeg -i source.mp4 -an -c:v libx264 -crf 22 -vf "scale=-2:720" -g 48 -keyint_min 48 -sc_threshold 0 video_720p.mp4
packager in=video_720p.mp4,stream=video,output=v720.mp4,playlist_name=v720.m3u8 \
         in=audio.mp4,stream=audio,output=audio.mp4,playlist_name=audio.m3u8,hls_group_id=audio,hls_name=FR \
         --segment_duration 4 --mpd_output manifest.mpd --hls_master_playlist_output master.m3u8
mp4info video.mp4 ; mp4dump --verbosity 1 video.mp4
mp4fragment video.mp4 frag.mp4 && mp4dash --hls --output-dir=sortie frag.mp4
mp4hls video.mp4
```

## Transcodage automatisé

| Outil | Image Docker | Ports | Volumes principaux |
| --- | --- | --- | --- |
| Tdarr | `ghcr.io/haveagitgat/tdarr` (nœud : `tdarr_node`) | 8265 (web), 8266 (nœuds) | `/app/server`, `/app/configs`, `/media`, `/temp` |
| Unmanic | `josh5/unmanic` | 8888 | `/config`, `/library`, `/tmp/unmanic` |
| FileFlows | `revenz/fileflows` | 19200 | configuration, médias, temporaire |

```bash
ls -l /dev/dri                          # périphériques GPU Intel/AMD à passer au conteneur
docker compose logs -f tdarr
```
