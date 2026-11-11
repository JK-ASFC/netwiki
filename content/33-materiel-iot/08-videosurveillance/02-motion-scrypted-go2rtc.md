---
title: Motion, motionEye, Kerberos.io, Scrypted et go2rtc
description: Compléments de vidéosurveillance — Motion (détecteur de mouvement léger en ligne de commande, motion.conf, webcams et flux réseau), motionEye (interface web pour Motion, en maintenance), Kerberos.io (agent de surveillance conteneurisé et plate-forme Hub/Factory), Scrypted (plate-forme de passerelle caméra : HomeKit Secure Video, Google, Alexa, NVR, Node.js) et go2rtc (relais de flux universel : RTSP, WebRTC, HomeKit, faible latence, utilisé par Frigate et Home Assistant) ; rôles respectifs et choix.
tags: [motion, motioneye, kerberos.io, scrypted, go2rtc, vidéosurveillance, rtsp, webrtc, homekit]
icon: video
---

Autour des NVR complets ([[01-frigate-zoneminder-shinobi|Frigate, ZoneMinder, Shinobi]]), plusieurs outils couvrent des besoins ciblés : détection légère, passerelle vers les écosystèmes grand public, ou simple relais de flux.

## Motion et motionEye

**Motion** est un détecteur de mouvement **léger** en ligne de commande : il surveille une webcam ou un flux réseau et enregistre images ou vidéos quand quelque chose bouge. Idéal sur un Raspberry Pi pour une ou deux caméras.

```text /etc/motion/motion.conf (extrait)
netcam_url rtsp://user:mdp@10.0.50.30:554/stream1
netcam_decoder ffmpeg
threshold 1500
target_dir /srv/motion
picture_output best
movie_output on
```

```bash
sudo apt install motion
sudo systemctl enable --now motion
```

**motionEye** ajoute une **interface web** à Motion (plusieurs caméras, réglages, visionnage).

> [!NOTE]
> motionEye est en **maintenance limitée** ; il reste utile pour un petit poste existant, mais pour un nouveau projet avec interface, préférer Frigate ou Shinobi.

## Kerberos.io

**Kerberos.io** fournit un **agent** de surveillance conteneurisé (un conteneur par caméra) qui enregistre sur événement et expose une interface ; la partie **Hub/Factory** (orchestration de nombreux agents, stockage, IA) vise les déploiements à grande échelle, en partie sous offre commerciale.

```bash
docker run -d --name kerberos -p 127.0.0.1:8080:80 \
  -v /srv/kerberos/config:/etc/opt/kerberosio/config \
  -v /srv/kerberos/recordings:/etc/opt/kerberosio/recordings \
  kerberos/agent:latest
```

## Scrypted

**Scrypted** est une **plate-forme de passerelle caméra** orientée maison connectée : elle expose des caméras hétérogènes vers **HomeKit Secure Video**, **Google Home**, **Alexa**, avec une fonction **NVR** et de la détection. Très efficace pour faire entrer des caméras RTSP dans l'écosystème Apple (HKSV enregistre dans iCloud côté Apple).

```bash
docker run -d --name scrypted --restart unless-stopped --network host \
  -v /srv/scrypted:/server/volume ghcr.io/koush/scrypted
# Interface : https://serveur:10443
```

## go2rtc

**go2rtc** n'est pas un NVR mais un **relais de flux universel** : il prend une source (RTSP, RTMP, caméra USB, ONVIF…) et la rediffuse en **RTSP, WebRTC, HomeKit, MSE/HLS**, avec une **latence minimale** (WebRTC). C'est la brique qui permet d'afficher une caméra instantanément dans un tableau de bord.

```yaml go2rtc.yaml
streams:
  entree:
    - rtsp://user:mdp@10.0.50.21:554/Streaming/Channels/101
  entree_sub:
    - rtsp://user:mdp@10.0.50.21:554/Streaming/Channels/102
webrtc:
  candidates: [ 192.0.2.50:8555 ]
```

```bash
docker run -d --name go2rtc --network host \
  -v /srv/go2rtc/go2rtc.yaml:/config/go2rtc.yaml ghcr.io/alexxit/go2rtc
# Interface : http://serveur:1984
```

go2rtc est **intégré à Frigate** et à Home Assistant ; on l'utilise aussi seul pour normaliser des flux, réduire le nombre de connexions aux caméras (une seule connexion partagée) ou convertir RTSP ↔ WebRTC.

## Choisir

| Besoin | Outil |
| --- | --- |
| Détection par IA, intégration domotique | [[01-frigate-zoneminder-shinobi\|Frigate]] |
| NVR complet éprouvé | [[01-frigate-zoneminder-shinobi\|ZoneMinder, Shinobi]] |
| Détection légère, 1-2 caméras | Motion (+ motionEye) |
| Déploiement multi-agents à grande échelle | Kerberos.io |
| Caméras dans HomeKit/Google/Alexa | Scrypted |
| Relais et affichage de flux à faible latence | go2rtc |

Les mêmes règles de **réseau isolé**, de **cadre légal** et de restriction d'accès aux images s'appliquent (voir la page précédente).

Commandes : [[90-aide-memoire|aide-mémoire]].
