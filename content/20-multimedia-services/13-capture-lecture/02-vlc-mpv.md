---
title: VLC et mpv
description: VLC et mpv pour l'administrateur — lire et vérifier des flux réseau (RTSP, RTMP, HLS, SRT, UDP multicast), informations sur les codecs et statistiques, conversion et enregistrement avec VLC, diffusion d'un flux en ligne de commande (cvlc), interfaces HTTP et telnet, déploiement en entreprise ; mpv (lecteur minimaliste, mpv.conf, raccourcis, IPC, yt-dlp, accélération matérielle).
tags: [vlc, cvlc, mpv, lecteur, rtsp, multicast, hls, flux réseau, diagnostic]
icon: play
---

Au-delà de la lecture de fichiers, **VLC** et **mpv** servent à **vérifier un flux** (une caméra RTSP, un flux HLS, un multicast IPTV) et, pour VLC, à **convertir** ou **rediffuser**.

| | VLC | mpv |
| --- | --- | --- |
| Interface | Graphique complète, menus | Minimaliste, pilotée au clavier et par fichier de configuration |
| Licence | GPL / LGPL | GPL / LGPL |
| Points forts | Lit tout, conversion, diffusion, interfaces distantes | Qualité d'image, scripts Lua, IPC, intégration yt-dlp |

```powershell
winget install VideoLAN.VLC ; winget install mpv.net     # mpv.net : mpv avec interface pour Windows
```

```bash
sudo apt install vlc mpv ; brew install --cask vlc ; brew install mpv
flatpak install flathub org.videolan.VLC io.mpv.Mpv
```

## Lire et vérifier un flux

```bash
vlc rtsp://user:mdp@192.168.10.51:554/stream1          # caméra IP
vlc --rtsp-tcp rtsp://192.168.10.51/stream1            # forcer RTSP sur TCP (pare-feu, pertes)
vlc https://serveur/live/index.m3u8                     # HLS
vlc udp://@239.1.1.1:5000                               # multicast (IPTV, encodeurs)
vlc "srt://serveur:9000?mode=caller"
mpv rtsp://192.168.10.51/stream1 --rtsp-transport=tcp --profile=low-latency
mpv https://serveur/live/index.m3u8
```

- VLC : *Outils → Informations sur le média* → onglets **Codec** (format, résolution, débit) et **Statistiques** (images perdues, débit d'entrée).
- mpv : touche `i` (statistiques), `Maj+I` (statistiques persistantes), `` ` `` (console).

## Convertir et enregistrer avec VLC

*Média → Convertir / Enregistrer* : choisir la source (fichier ou flux réseau), un profil (H.264 + MP3/AAC en MP4…) et le fichier de destination. En ligne de commande :

```bash
# Enregistrer un flux RTSP pendant une heure sans réencodage
cvlc rtsp://192.168.10.51/stream1 --sout=file/mp4:hall.mp4 --run-time=3600 vlc://quit

# Transcoder un fichier
cvlc entree.avi --sout '#transcode{vcodec=h264,vb=2000,acodec=mp4a,ab=128}:std{access=file,mux=mp4,dst=sortie.mp4}' vlc://quit

# Rediffuser un fichier en HTTP (test d'un décodeur ou d'un écran)
cvlc video.mp4 --loop --sout '#std{access=http,mux=ts,dst=:8080/flux}'
```

Pour des conversions régulières, [[12-traitement-video/01-ffmpeg|FFmpeg]] reste plus simple et plus prévisible.

## VLC piloté à distance

```bash
cvlc --intf http --http-host 0.0.0.0 --http-port 8080 --http-password 'MotDePasse' playlist.m3u
cvlc --intf telnet --telnet-password 'MotDePasse' playlist.m3u     # port 4212
```

Utile pour un écran d'affichage ou une salle de réunion (lecture pilotée depuis un autre poste).

## mpv

```ini ~/.config/mpv/mpv.conf
hwdec=auto-safe
profile=gpu-hq
save-position-on-quit=yes
sub-auto=fuzzy
slang=fr,fre,fra,en
alang=fr,fre,fra,en
ytdl-format=bestvideo[height<=1080]+bestaudio/best
```

```bash
mpv --input-ipc-server=/tmp/mpv.sock video.mkv
echo '{ "command": ["set_property", "pause", true] }' | socat - /tmp/mpv.sock    # pilotage par script
mpv "https://www.youtube.com/watch?v=…"                                        # lecture via yt-dlp
```

Raccourcis : `espace` pause, `←/→` ±5 s, `↑/↓` ±1 min, `f` plein écran, `j` sous-titres, `#` piste audio, `s` capture, `q` quitter (`Q` en mémorisant la position).

## En entreprise

- VLC se déploie par MSI (Windows) avec des options dans `vlcrc` ; désactiver la vérification des mises à jour si elles sont gérées centralement.
- Les codecs inclus évitent l'installation de « packs de codecs » douteux sur les postes.

Voir aussi : [[01-obs-studio|OBS Studio]] · [[03-kodi|Kodi]]. Commandes : [[90-aide-memoire|aide-mémoire]].
