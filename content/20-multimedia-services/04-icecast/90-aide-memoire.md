---
title: Icecast — aide-mémoire des commandes
description: Commandes Icecast avec exemples — service et configuration (icecast.xml : limites, authentification source/admin, points de montage), sources (ffmpeg, Liquidsoap, butt), interface d'administration et API (stats XML, listclients, moveclients, killsource, metadata), relais, tests d'écoute, journaux.
tags: [aide-mémoire, icecast, streaming, radio, ffmpeg, liquidsoap]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-installation-configuration|Icecast]].

## Service et configuration

```bash
sudo systemctl restart icecast2
sudo journalctl -u icecast2 -f
sudo tail -f /var/log/icecast2/error.log /var/log/icecast2/access.log
```

```xml
<!-- /etc/icecast2/icecast.xml (extraits) -->
<limits>
  <clients>200</clients>
  <sources>4</sources>
</limits>
<authentication>
  <source-password>MotDePasseSource2026</source-password>
  <admin-user>admin</admin-user>
  <admin-password>MotDePasseAdmin2026</admin-password>
</authentication>
<listen-socket>
  <port>8000</port>
</listen-socket>
<mount type="normal">
  <mount-name>/radio.mp3</mount-name>
  <max-listeners>150</max-listeners>
  <public>0</public>
</mount>
```

## Envoyer un flux

```bash
ffmpeg -re -i playlist.mp3 -c:a libmp3lame -b:a 128k -content_type audio/mpeg -f mp3 icecast://source:MotDePasseSource2026@radio.exemple.fr:8000/radio.mp3
ffmpeg -f pulse -i default -c:a libopus -b:a 96k -f ogg icecast://source:MotDePasseSource2026@radio.exemple.fr:8000/direct.ogg
```

```text
# Liquidsoap (radio.liq)
musique = playlist("/srv/musique/radio")
output.icecast(%mp3(bitrate=128), host="radio.exemple.fr", port=8000, password="MotDePasseSource2026", mount="radio.mp3", mksafe(musique))
```

## Administration et API

```bash
A="admin:MotDePasseAdmin2026"; I=http://radio.exemple.fr:8000
curl -s -u $A $I/admin/stats | xmllint --xpath '//source/listeners/text()' -
curl -s $I/status-json.xsl | jq '.icestats.source'
curl -s -u $A "$I/admin/listclients?mount=/radio.mp3"
curl -s -u $A "$I/admin/metadata?mount=/radio.mp3&mode=updinfo&song=Artiste%20-%20Titre"
curl -s -u $A "$I/admin/moveclients?mount=/radio.mp3&destination=/secours.mp3"
curl -s -u $A "$I/admin/killsource?mount=/radio.mp3"
```

## Écoute de test

```bash
ffplay -nodisp http://radio.exemple.fr:8000/radio.mp3
curl -s -o /dev/null -w "%{http_code}\n" --max-time 3 http://radio.exemple.fr:8000/radio.mp3
```
