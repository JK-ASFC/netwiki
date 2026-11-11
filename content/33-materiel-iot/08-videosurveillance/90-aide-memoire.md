---
title: Vidéosurveillance — aide-mémoire
description: Ports, déploiement et flux RTSP de Frigate, ZoneMinder, Shinobi, Motion/motionEye, Kerberos.io, Scrypted et go2rtc, et test d'un flux caméra avec ffprobe/ffmpeg.
tags: [aide-mémoire, frigate, zoneminder, shinobi, motion, scrypted, go2rtc, rtsp]
icon: terminal
---

Explications : [[01-frigate-zoneminder-shinobi|Frigate, ZoneMinder et Shinobi]] · [[02-motion-scrypted-go2rtc|Motion, Kerberos.io, Scrypted et go2rtc]].

| Outil | Port |
| --- | --- |
| Frigate | 5000 (8971 authentifié), 8554 RTSP, 8555 WebRTC |
| ZoneMinder | 80/8080 |
| Shinobi | 8080 |
| motionEye | 8765 |
| Kerberos agent | 80 |
| Scrypted | 10443 (HTTPS), 11080 |
| go2rtc | 1984 interface, 8554 RTSP, 8555 WebRTC |

```bash
# Tester un flux caméra avant intégration
ffprobe -v error -rtsp_transport tcp "rtsp://user:mdp@10.0.50.21:554/Streaming/Channels/101"
ffmpeg -rtsp_transport tcp -i "rtsp://…/101" -t 10 -c copy test.mp4      # capture 10 s

# Frigate
docker run -d --name frigate --device /dev/bus/usb --shm-size=256m \
  -v /srv/frigate/config:/config -v /srv/frigate/media:/media/frigate \
  -p 5000:5000 -p 8971:8971 ghcr.io/blakeblackshear/frigate:stable

# go2rtc
docker run -d --name go2rtc --network host -v /srv/go2rtc/go2rtc.yaml:/config/go2rtc.yaml ghcr.io/alexxit/go2rtc

# Motion
sudo systemctl enable --now motion ; tail -f /var/log/motion/motion.log
```
