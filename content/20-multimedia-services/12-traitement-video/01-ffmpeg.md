---
title: FFmpeg
description: FFmpeg, le couteau suisse audio et vidéo (LGPL/GPL) — installation, ffprobe pour analyser un fichier, conversion et transcodage (H.264, H.265, AV1, AAC, Opus), qualité CRF et presets, copie sans réencodage, découpe, concaténation, extraction et remplacement de pistes, sous-titres, redimensionnement, images et GIF, captures d'écran, accélération matérielle (VAAPI, NVENC, Quick Sync, VideoToolbox), diffusion RTMP, SRT et HLS, enregistrement d'une caméra RTSP, scripts par lots.
tags: [ffmpeg, ffprobe, transcodage, vidéo, audio, h264, hevc, av1, nvenc, vaapi, hls, rtmp]
icon: film
---

**FFmpeg** lit et écrit presque tous les formats audio et vidéo. La plupart des serveurs multimédias (Jellyfin, Owncast, PeerTube, Tdarr…) l'utilisent en coulisse ; l'administrateur s'en sert directement pour convertir, découper, diagnostiquer un fichier ou enregistrer un flux.

```bash
sudo apt install ffmpeg ; sudo dnf install ffmpeg      # Fedora : dépôt RPM Fusion pour la version complète
brew install ffmpeg ; winget install Gyan.FFmpeg
ffmpeg -hide_banner -encoders | grep -E "264|265|av1"  # encodeurs disponibles
```

## Analyser un fichier : ffprobe

```bash
ffprobe -hide_banner video.mkv                                   # conteneur, pistes, codecs, durée
ffprobe -v error -show_entries format=duration,bit_rate -of default=nw=1 video.mkv
ffprobe -v error -select_streams v:0 -show_entries stream=codec_name,width,height,r_frame_rate -of csv=p=0 video.mkv
ffprobe -v error -show_streams -of json video.mkv | jq '.streams[] | {index, codec_type, codec_name, tags}'
```

## Structure d'une commande

```text
ffmpeg [options globales] [options d'entrée] -i entrée [options de sortie] sortie
```

| Option | Rôle |
| --- | --- |
| `-c:v libx264` / `-c:a aac` | Encodeur vidéo / audio |
| `-c copy` | **Copier sans réencoder** (instantané, sans perte) |
| `-crf 23` | Qualité constante (x264 : 18 très bon, 23 défaut, 28 plus léger) |
| `-preset slow` | Compromis vitesse / taille (ultrafast … veryslow) |
| `-b:v 3M` / `-b:a 160k` | Débit vidéo / audio cible |
| `-vf` / `-af` | Filtres vidéo / audio |
| `-map 0:v -map 0:a:1` | Choisir les pistes (ici vidéo + deuxième piste audio) |
| `-ss` / `-to` / `-t` | Début, fin, durée |
| `-y` / `-n` | Écraser / ne jamais écraser la sortie |

## Recettes courantes

```bash
# Changer de conteneur sans réencoder (MKV → MP4)
ffmpeg -i video.mkv -c copy video.mp4

# Transcoder en H.264 + AAC compatible partout
ffmpeg -i entree.mov -c:v libx264 -crf 22 -preset medium -c:a aac -b:a 160k -movflags +faststart sortie.mp4

# H.265 (fichiers plus petits) et AV1 (encore plus petits, encodage lent)
ffmpeg -i entree.mp4 -c:v libx265 -crf 26 -preset medium -c:a copy sortie-hevc.mkv
ffmpeg -i entree.mp4 -c:v libsvtav1 -crf 32 -preset 8 -c:a libopus -b:a 128k sortie-av1.mkv

# Découper sans réencoder (coupe sur image clé) ou précisément (réencodage)
ffmpeg -ss 00:01:30 -to 00:03:00 -i video.mp4 -c copy extrait.mp4
ffmpeg -i video.mp4 -ss 00:01:30 -to 00:03:00 -c:v libx264 -crf 20 -c:a aac extrait-precis.mp4

# Concaténer des fichiers de même format
printf "file '%s'\n" partie1.mp4 partie2.mp4 > liste.txt
ffmpeg -f concat -safe 0 -i liste.txt -c copy complet.mp4

# Extraire l'audio, retirer l'audio, remplacer l'audio
ffmpeg -i video.mp4 -vn -c:a copy son.m4a
ffmpeg -i video.mp4 -an -c:v copy muet.mp4
ffmpeg -i video.mp4 -i voix.wav -map 0:v -map 1:a -c:v copy -c:a aac -shortest doublage.mp4

# Redimensionner (largeur 1280, hauteur proportionnelle paire)
ffmpeg -i entree.mp4 -vf "scale=1280:-2" -c:a copy sortie-720p.mp4

# Incruster des sous-titres, ou les ajouter comme piste
ffmpeg -i video.mp4 -vf "subtitles=sous-titres.srt" -c:a copy incruste.mp4
ffmpeg -i video.mp4 -i sous-titres.srt -c copy -c:s mov_text -metadata:s:s:0 language=fra avec-st.mp4

# Normaliser le volume (EBU R128)
ffmpeg -i entree.mp4 -af loudnorm=I=-16:TP=-1.5:LRA=11 -c:v copy normalise.mp4

# Images : une vignette, une image par seconde, un GIF
ffmpeg -ss 00:00:10 -i video.mp4 -frames:v 1 vignette.jpg
ffmpeg -i video.mp4 -vf fps=1 images/img_%04d.png
ffmpeg -ss 5 -t 4 -i video.mp4 -vf "fps=12,scale=480:-1:flags=lanczos" anim.gif
```

## Accélération matérielle

| Matériel | Encodeur H.264 / H.265 | Exemple |
| --- | --- | --- |
| NVIDIA | `h264_nvenc` / `hevc_nvenc` | `ffmpeg -hwaccel cuda -i in.mp4 -c:v hevc_nvenc -preset p5 -cq 26 out.mp4` |
| Intel (Quick Sync) | `h264_qsv` / `hevc_qsv` | `ffmpeg -hwaccel qsv -i in.mp4 -c:v hevc_qsv -global_quality 26 out.mp4` |
| Intel / AMD sous Linux (VAAPI) | `h264_vaapi` / `hevc_vaapi` | `ffmpeg -vaapi_device /dev/dri/renderD128 -i in.mp4 -vf 'format=nv12,hwupload' -c:v hevc_vaapi -qp 26 out.mp4` |
| Apple | `h264_videotoolbox` / `hevc_videotoolbox` | `ffmpeg -i in.mov -c:v hevc_videotoolbox -q:v 60 out.mp4` |

L'encodage matériel est **beaucoup plus rapide** mais, à débit égal, un peu moins efficace qu'un encodage logiciel lent. Dans un conteneur, exposer `/dev/dri` (Intel/AMD) ou le GPU NVIDIA (NVIDIA Container Toolkit).

## Flux en direct

```bash
# Envoyer un fichier en boucle vers un serveur RTMP (test d'Owncast, SRS, YouTube…)
ffmpeg -re -stream_loop -1 -i video.mp4 -c:v libx264 -preset veryfast -b:v 3M -g 60 -c:a aac -b:a 128k -f flv rtmp://serveur/live/cle

# Enregistrer une caméra IP RTSP en fichiers d'une heure, sans réencodage
ffmpeg -rtsp_transport tcp -i "rtsp://user:mdp@192.168.10.51:554/stream1" -c copy \
  -f segment -segment_time 3600 -reset_timestamps 1 -strftime 1 "/srv/cam/hall_%Y%m%d_%H%M.mkv"

# Produire du HLS (segments de 4 s)
ffmpeg -i entree.mp4 -c:v libx264 -crf 21 -g 96 -c:a aac -f hls -hls_time 4 -hls_playlist_type vod sortie/index.m3u8

# Capturer l'écran (X11) ou une webcam
ffmpeg -f x11grab -framerate 30 -i :0.0 -c:v libx264 -preset ultrafast ecran.mkv
ffmpeg -f v4l2 -i /dev/video0 webcam.mkv
```

## Traiter un dossier

```bash
for f in *.mkv; do
  ffmpeg -n -i "$f" -c:v libx264 -crf 22 -c:a aac -b:a 160k "convertis/${f%.mkv}.mp4"
done
```

Pour automatiser le transcodage d'une médiathèque entière avec une interface et des règles, voir [[14-packaging-transcodage-auto/02-tdarr-unmanic-fileflows|Tdarr, Unmanic et FileFlows]].

Voir aussi : [[02-gstreamer|GStreamer]] · [[03-handbrake|HandBrake]]. Commandes : [[90-aide-memoire|aide-mémoire]].
