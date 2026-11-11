---
title: Outils de téléchargement — aide-mémoire
description: Commandes aria2c (connexions multiples, reprise, listes, BitTorrent, Metalink, démon RPC) et yt-dlp (formats, audio, sous-titres, listes de lecture, archive, configuration, aria2).
tags: [aide-mémoire, aria2, yt-dlp, téléchargement]
icon: terminal
---

Explications : [[01-aria2|aria2]] · [[02-yt-dlp|yt-dlp]].

## aria2

```bash
aria2c -x 8 -s 8 -c -d /srv/iso https://exemple.fr/debian.iso
aria2c -i liste.txt -j 3 --max-overall-download-limit=20M
aria2c --checksum=sha-256=<empreinte> https://exemple.fr/debian.iso
aria2c --seed-time=0 fichier.torrent ; aria2c "magnet:?xt=urn:btih:…"
aria2c --conf-path=$HOME/.config/aria2/aria2.conf -D            # démon RPC (port 6800, rpc-secret)
curl -s http://127.0.0.1:6800/jsonrpc -d '{"jsonrpc":"2.0","id":"1","method":"aria2.tellActive","params":["token:JETON"]}'
```

## yt-dlp

```bash
yt-dlp -U ; yt-dlp -F "URL"
yt-dlp -S "res:1080,vcodec:h264" --merge-output-format mp4 "URL"
yt-dlp -x --audio-format mp3 "URL"
yt-dlp --write-subs --sub-langs "fr,en" --embed-subs --embed-chapters "URL"
yt-dlp --download-archive archive.txt -o "%(uploader)s/%(title)s.%(ext)s" "URL_CHAINE"
yt-dlp --downloader aria2c --downloader-args "aria2c:-x 8" "URL"
yt-dlp -j "URL" | jq '{title, duration}'
```
