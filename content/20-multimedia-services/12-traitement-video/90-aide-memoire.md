---
title: Traitement vidéo — aide-mémoire
description: Commandes essentielles de FFmpeg et ffprobe (analyse, conversion, copie, découpe, concaténation, audio, sous-titres, images, accélération matérielle, RTMP, RTSP, HLS), GStreamer (gst-launch-1.0, gst-inspect-1.0, GST_DEBUG) et HandBrakeCLI.
tags: [aide-mémoire, ffmpeg, ffprobe, gstreamer, handbrake, transcodage]
icon: terminal
---

Explications : [[01-ffmpeg|FFmpeg]] · [[02-gstreamer|GStreamer]] · [[03-handbrake|HandBrake]].

## FFmpeg

```bash
ffprobe -hide_banner video.mkv
ffmpeg -i in.mkv -c copy out.mp4                                         # changer de conteneur
ffmpeg -i in.mov -c:v libx264 -crf 22 -preset medium -c:a aac -b:a 160k -movflags +faststart out.mp4
ffmpeg -i in.mp4 -c:v libx265 -crf 26 -c:a copy out.mkv
ffmpeg -ss 00:01:30 -to 00:03:00 -i in.mp4 -c copy extrait.mp4
ffmpeg -f concat -safe 0 -i liste.txt -c copy complet.mp4
ffmpeg -i in.mp4 -vn -c:a copy son.m4a ; ffmpeg -i in.mp4 -an -c:v copy muet.mp4
ffmpeg -i in.mp4 -vf "scale=1280:-2" out.mp4
ffmpeg -ss 10 -i in.mp4 -frames:v 1 vignette.jpg
ffmpeg -hwaccel cuda -i in.mp4 -c:v hevc_nvenc -cq 26 out.mp4             # NVIDIA
ffmpeg -re -stream_loop -1 -i in.mp4 -c:v libx264 -preset veryfast -c:a aac -f flv rtmp://serveur/live/cle
ffmpeg -rtsp_transport tcp -i rtsp://user:mdp@cam/stream1 -c copy cam.mkv
ffmpeg -i in.mp4 -c:v libx264 -c:a aac -f hls -hls_time 4 -hls_playlist_type vod out/index.m3u8
```

## GStreamer

```bash
gst-inspect-1.0 | grep -i 264 ; gst-inspect-1.0 x264enc
gst-launch-1.0 playbin uri=file:///chemin/video.mkv
gst-launch-1.0 -e rtspsrc location=rtsp://cam/stream1 ! rtph264depay ! h264parse ! matroskamux ! filesink location=cam.mkv
GST_DEBUG=3 gst-launch-1.0 videotestsrc ! autovideosink
```

## HandBrakeCLI

```bash
HandBrakeCLI --preset-list
HandBrakeCLI -i in.mkv -o out.mp4 --preset "Fast 1080p30"
HandBrakeCLI -i in.mkv -o out.mkv -e x265 -q 24 --all-audio --all-subtitles
HandBrakeCLI --scan -i in.mkv
```
