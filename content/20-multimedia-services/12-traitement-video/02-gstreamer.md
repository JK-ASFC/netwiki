---
title: GStreamer
description: GStreamer, framework multimédia en pipelines (LGPL) — éléments, pads et caps, jeux de greffons (base, good, bad, ugly, libav), gst-launch-1.0 et gst-inspect-1.0, recettes (lecture, conversion, caméra, RTSP vers fichier ou WebRTC, diffusion RTMP et SRT, gst-rtsp-server), accélération matérielle (VA-API, NVCODEC), débogage avec GST_DEBUG, différences avec FFmpeg.
tags: [gstreamer, gst-launch, pipeline, multimédia, rtsp, rtmp, srt, vaapi, linux]
icon: film
---

**GStreamer** assemble des **éléments** (sources, décodeurs, filtres, encodeurs, sorties) en **pipelines**. C'est le moteur multimédia de GNOME, de nombreux lecteurs, d'applications embarquées (caméras, Raspberry Pi, NVIDIA Jetson) et de serveurs (Mopidy, Kurento, Egress de LiveKit). En ligne de commande, `gst-launch-1.0` permet de tester un pipeline en une ligne.

```bash
sudo apt install gstreamer1.0-tools gstreamer1.0-plugins-{base,good,bad,ugly} gstreamer1.0-libav gstreamer1.0-vaapi
sudo dnf install gstreamer1-plugins-{base,good,bad-free} gstreamer1-plugins-ugly-free   # RPM Fusion pour les codecs non libres
brew install gstreamer
```

| Jeu de greffons | Contenu |
| --- | --- |
| **base** | Éléments essentiels, bien maintenus |
| **good** | Qualité et licence sans problème (RTSP, RTP, V4L2, PulseAudio…) |
| **bad** | Qualité ou API à revoir, mais très utiles (WebRTC, SRT, HLS, RTMP2, NVCODEC…) |
| **ugly** | Bonne qualité, licences ou brevets délicats (x264…) |
| **libav** | Décodeurs et encodeurs de FFmpeg |

## Notions

- Les éléments sont reliés par `!` ; chaque élément a des **pads** d'entrée et de sortie.
- Les **caps** décrivent le format qui circule (`video/x-raw,width=1280,height=720`) et forcent une négociation.
- `decodebin` / `uridecodebin` choisissent automatiquement le démultiplexeur et le décodeur ; `autovideosink` la meilleure sortie vidéo.
- `queue` découpe le pipeline en threads (indispensable quand le flux se divise avec `tee`).

```bash
gst-inspect-1.0 | grep -i 264              # éléments disponibles
gst-inspect-1.0 x264enc                     # propriétés et caps d'un élément
```

## Recettes

```bash
# Mire de test et lecture d'un fichier
gst-launch-1.0 videotestsrc ! autovideosink
gst-launch-1.0 playbin uri=file:///srv/videos/film.mkv

# Convertir en H.264 + AAC dans un MP4
gst-launch-1.0 -e filesrc location=entree.mov ! decodebin name=d \
  d. ! queue ! videoconvert ! x264enc bitrate=3000 speed-preset=medium ! h264parse ! mp4mux name=m ! filesink location=sortie.mp4 \
  d. ! queue ! audioconvert ! audioresample ! avenc_aac ! m.

# Enregistrer une caméra IP RTSP sans réencoder
gst-launch-1.0 -e rtspsrc location=rtsp://user:mdp@192.168.10.51/stream1 protocols=tcp ! rtph264depay ! h264parse ! matroskamux ! filesink location=hall.mkv

# Webcam vers RTMP
gst-launch-1.0 -e v4l2src device=/dev/video0 ! videoconvert ! x264enc tune=zerolatency bitrate=2500 key-int-max=60 ! h264parse ! flvmux streamable=true ! rtmp2sink location=rtmp://serveur/live/cle

# Envoi en SRT (mode appelant)
gst-launch-1.0 -e videotestsrc is-live=true ! x264enc tune=zerolatency ! mpegtsmux ! srtsink uri="srt://serveur:8890?streamid=publish:test"

# Encodage matériel Intel/AMD (VA-API) et NVIDIA
gst-launch-1.0 -e filesrc location=in.mkv ! decodebin ! videoconvert ! vah264enc ! h264parse ! mp4mux ! filesink location=out.mp4
gst-launch-1.0 -e filesrc location=in.mkv ! decodebin ! nvh264enc ! h264parse ! mp4mux ! filesink location=out.mp4
```

L'option `-e` envoie une fin de flux propre à l'arrêt (`Ctrl+C`), indispensable pour obtenir un MP4 lisible.

## Serveur RTSP

La bibliothèque **gst-rtsp-server** fournit un serveur RTSP programmable ; son exemple `test-launch` publie n'importe quel pipeline :

```bash
./test-launch "( v4l2src ! videoconvert ! x264enc tune=zerolatency ! rtph264pay name=pay0 pt=96 )"
# Lecture : rtsp://machine:8554/test
```

Pour un serveur multiprotocole sans programmation, voir [[10-serveurs-streaming/02-mediamtx|MediaMTX]].

## Débogage

```bash
GST_DEBUG=3 gst-launch-1.0 …                      # avertissements et erreurs
GST_DEBUG=rtspsrc:6,*:2 gst-launch-1.0 …          # détail d'un élément
GST_DEBUG_DUMP_DOT_DIR=/tmp gst-launch-1.0 …      # graphe du pipeline (fichiers .dot à convertir avec Graphviz)
```

## GStreamer ou FFmpeg ?

| | FFmpeg | GStreamer |
| --- | --- | --- |
| Ligne de commande | Très complète, une commande par tâche | Pipelines plus verbeux, idéaux pour le temps réel |
| Intégration dans une application | Bibliothèques libav* | API orientée flux, liaisons Python, Rust, C# |
| Points forts | Conversion de fichiers, filtres, formats | Flux en direct, embarqué, WebRTC, latence |

Voir aussi : [[01-ffmpeg|FFmpeg]] · [[03-handbrake|HandBrake]]. Commandes : [[90-aide-memoire|aide-mémoire]].
