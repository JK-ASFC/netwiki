---
title: Tdarr, Unmanic et FileFlows
description: Automatiser le transcodage et le nettoyage d'une médiathèque — Tdarr (serveur et nœuds distribués, flux et greffons, GPU, édition gratuite et Pro), Unmanic (Python, greffons, optimisation de bibliothèque) et FileFlows (flux visuels, serveur et nœuds) ; installation Docker, accélération matérielle, dossier de transcodage, règles conseillées (H.265 ou AV1, pistes inutiles, sous-titres), précautions (sauvegarde, tests, droits des fichiers).
tags: [tdarr, unmanic, fileflows, transcodage, médiathèque, ffmpeg, hevc, av1, docker, gpu]
icon: workflow
---

Ces outils parcourent une **médiathèque** (films, séries) et appliquent des **règles** à chaque fichier : transcoder en H.265 ou AV1 pour gagner de la place, retirer les pistes audio et sous-titres inutiles, uniformiser le conteneur (MKV/MP4), normaliser le son. Ils s'appuient sur **FFmpeg** (et parfois HandBrakeCLI) et peuvent répartir le travail sur plusieurs machines.

| | Tdarr | Unmanic | FileFlows |
| --- | --- | --- | --- |
| Architecture | **Serveur + nœuds** (workers CPU/GPU) | Un service (+ nœuds liés possibles) | **Serveur + nœuds** |
| Règles | Greffons empilés ou **flux** graphiques | Greffons par bibliothèque | **Flux** visuels (nœuds glissés-déposés) |
| Licence | Gratuit (code fermé) avec fonctions avancées payantes (Pro) | Libre (GPL) | Gratuit avec fonctions payantes |
| Points forts | Très répandu, nombreux greffons communautaires, statistiques | Simple, entièrement libre | Flux lisibles, traitements variés (vidéo, audio, images, BD) |
| Interface web | Port 8265 | Port 8888 | Port 19200 |

## Installation (Docker)

```yaml docker-compose.yml
services:
  tdarr:
    image: ghcr.io/haveagitgat/tdarr:latest
    ports: ["8265:8265", "8266:8266"]          # interface, serveur pour les nœuds
    environment:
      - serverIP=0.0.0.0
      - serverPort=8266
      - webUIPort=8265
      - internalNode=true                       # un nœud dans le même conteneur
      - nodeName=nas
      - PUID=1000
      - PGID=1000
    volumes:
      - ./tdarr/server:/app/server
      - ./tdarr/configs:/app/configs
      - /srv/medias:/media
      - /srv/transcode-cache:/temp               # disque rapide, beaucoup d'espace
    devices:
      - /dev/dri:/dev/dri                        # Intel/AMD (VAAPI, Quick Sync)

  unmanic:
    image: josh5/unmanic:latest
    ports: ["8888:8888"]
    environment: [PUID=1000, PGID=1000]
    volumes:
      - ./unmanic:/config
      - /srv/medias:/library
      - /srv/transcode-cache:/tmp/unmanic
    devices: ["/dev/dri:/dev/dri"]
```

FileFlows : image `revenz/fileflows`, même principe (dossier de configuration, dossier des médias, dossier temporaire, `/dev/dri`). Pour NVIDIA, utiliser le NVIDIA Container Toolkit (`runtime: nvidia` ou `deploy.resources.reservations.devices`).

## Règles conseillées

1. **Filtrer** : ne traiter que les fichiers en H.264 ou plus anciens, au-dessus d'une certaine taille ou d'un certain débit.
2. **Transcoder** la vidéo en **H.265** (ou **AV1** si les lecteurs le décodent), qualité constante, de préférence par le GPU pour la vitesse.
3. **Pistes audio** : garder la ou les langues utiles, conserver la piste d'origine si elle est de bonne qualité, ajouter une piste AAC stéréo compatible.
4. **Sous-titres** : garder les langues utiles, convertir les formats d'image (PGS) uniquement si nécessaire.
5. **Conteneur** MKV, remplacer le fichier d'origine **seulement après vérification** (durée identique, pas d'erreur).
6. Prévenir **Jellyfin, Plex ou Sonarr/Radarr** pour qu'ils actualisent la bibliothèque (greffons ou webhooks).

## Précautions

- **Tester sur un petit dossier** et comparer à l'œil avant de lancer sur toute la médiathèque ; garder une **sauvegarde** ou une corbeille le temps de valider.
- Le **dossier temporaire** doit être sur un disque rapide avec assez de place pour plusieurs fichiers simultanés.
- Les **droits** (`PUID`/`PGID`) doivent permettre de remplacer les fichiers, sinon les tâches échouent à la fin.
- Limiter le nombre de tâches simultanées pour ne pas pénaliser la lecture en cours sur le même serveur.

Voir aussi : [[12-traitement-video/01-ffmpeg|FFmpeg]] · [[12-traitement-video/03-handbrake|HandBrake]] · [[15-gestion-medias-arr/01-pile-arr|Sonarr, Radarr et compagnie]]. Commandes : [[90-aide-memoire|aide-mémoire]].
