---
title: Frigate, ZoneMinder et Shinobi
description: Systèmes de vidéosurveillance auto-hébergés (NVR) — Frigate (détection d'objets en temps réel par IA, accélération Coral/GPU, intégration Home Assistant et MQTT, flux RTSP, go2rtc intégré, enregistrements et captures, config.yml, Docker port 5000/8971), ZoneMinder (NVR historique LAMP, moniteurs, zones de détection par mouvement, montages, API, stockage), Shinobi (Node.js, moteurs de détection, interface par moniteurs) ; dimensionnement (CPU/GPU, stockage), flux principal et secondaire, et cadre légal de la vidéosurveillance.
tags: [vidéosurveillance, nvr, frigate, zoneminder, shinobi, rtsp, détection, home assistant, rgpd]
icon: cctv
---

Un **NVR** (*Network Video Recorder*) logiciel enregistre et analyse les flux de caméras IP. Ces trois solutions couvrent du simple enregistrement sur mouvement à la **détection d'objets par intelligence artificielle**.

## Frigate

**Frigate** est le NVR moderne de référence pour l'auto-hébergement : il fait de la **détection d'objets** (personne, voiture, animal…) en temps réel sur les flux RTSP, avec une accélération matérielle (**Google Coral**, GPU, iGPU) pour ne pas saturer le CPU. Intégration poussée à **Home Assistant** et à **MQTT**.

```yaml config/config.yml
mqtt:
  host: 192.0.2.50
  user: frigate
  password: "{FRIGATE_MQTT_PASSWORD}"
detectors:
  coral:
    type: edgetpu
    device: usb
cameras:
  entree:
    ffmpeg:
      inputs:
        - path: rtsp://user:mdp@10.0.50.21:554/Streaming/Channels/101    # flux principal (enregistrement)
          roles: [ record ]
        - path: rtsp://user:mdp@10.0.50.21:554/Streaming/Channels/102    # sous-flux (détection)
          roles: [ detect ]
    detect: { width: 640, height: 360, fps: 5 }
    objects: { track: [ person, car ] }
record:
  enabled: true
  retain: { days: 7, mode: motion }
  events: { retain: { default: 30 } }
```

```bash
docker run -d --name frigate --restart unless-stopped \
  --device /dev/bus/usb -e FRIGATE_MQTT_PASSWORD='…' \
  -v /srv/frigate/config:/config -v /srv/frigate/media:/media/frigate \
  --shm-size=256m -p 127.0.0.1:5000:5000 -p 127.0.0.1:8971:8971 \
  ghcr.io/blakeblackshear/frigate:stable
```

- **Deux flux par caméra** : un sous-flux basse résolution pour la détection (économise le CPU), le flux principal pour l'enregistrement.
- **go2rtc** est intégré (relais et visualisation à faible latence, WebRTC).
- Alertes par MQTT/Home Assistant avec image de l'objet détecté.

## ZoneMinder

**ZoneMinder** est le NVR libre **historique** (pile LAMP, Perl) : robuste et éprouvé, mais détection par **mouvement classique** (zones, seuils), sans IA native. Interface par **moniteurs** (une caméra = un moniteur), montages, modes (Modect, Record, Nodect), API REST, « event server » pour notifications.

```bash
docker run -d --name zoneminder -p 127.0.0.1:8080:80 \
  -v /srv/zm/data:/var/cache/zoneminder -v /srv/zm/config:/config \
  -e TZ=Europe/Paris dlandon/zoneminder:latest
```

Pour ajouter la détection par objets, on le couple à des projets tiers (zmeventnotification + détection ML). Convient si l'on veut un système mûr et très configurable sans dépendre du matériel d'IA.

## Shinobi

**Shinobi** (Node.js) propose une interface moderne par moniteurs, plusieurs moteurs de détection (mouvement, et détection d'objets via des modules), enregistrement continu ou sur événement, multi-utilisateurs.

```bash
# Image communautaire, base MariaDB ; configuration par l'interface (super-admin puis comptes)
docker run -d --name shinobi -p 127.0.0.1:8080:8080 \
  -v /srv/shinobi/config:/config -v /srv/shinobi/videos:/home/Shinobi/videos \
  registry.gitlab.com/shinobi-systems/shinobi:dev
```

## Dimensionnement

| Facteur | Conseil |
| --- | --- |
| CPU/GPU | Sans IA : CPU modeste. Détection d'objets : **Coral** ou GPU fortement conseillé (Frigate) |
| Flux | Toujours un **sous-flux** pour la détection/aperçu, le principal pour l'enregistrement |
| Stockage | Calculer selon débit × caméras × rétention ; disques adaptés à l'écriture continue (surveillance) |
| Réseau | VLAN **caméras isolé**, sans accès Internet sortant pour les caméras |

## Cadre légal (France)

> [!WARNING]
> La vidéosurveillance est **réglementée**. En entreprise : information des salariés et du CSE, **signalétique** visible, déclaration selon les cas, finalité limitée, durée de conservation proportionnée (souvent **1 mois** maximum sans raison particulière), pas de caméra sur les zones de pause ni filmant en continu un poste de travail. Filmer la voie publique relève d'une autorisation préfectorale. Tenir un registre des traitements (RGPD) et restreindre l'accès aux images.

Voir aussi : [[02-motion-scrypted-go2rtc|Motion, motionEye, Kerberos.io, Scrypted et go2rtc]]. Commandes : [[90-aide-memoire|aide-mémoire]].
