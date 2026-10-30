---
title: Présentation, installation et bibliothèques
description: Jellyfin, serveur multimédia libre (fork d'Emby) — architecture (serveur, clients web, mobiles, TV), installation sous Debian/Ubuntu (dépôt officiel), Docker, Windows et macOS, emplacement des données, organisation et nommage des bibliothèques (films, séries, musique), métadonnées, utilisateurs et contrôle parental, transcodage matériel (Intel Quick Sync/VA-API, NVIDIA NVENC, AMD) et direct play.
tags: [jellyfin, multimédia, streaming, transcodage, docker, installation, bibliothèques]
icon: info
---

**Jellyfin** (GPL) organise films, séries, musique, photos et livres stockés sur vos disques, et les diffuse vers un navigateur, des applications mobiles, des téléviseurs connectés et des boîtiers (Android TV, Fire TV, Roku, Kodi). Entièrement libre, sans compte en ligne ni abonnement : c'est l'alternative auto-hébergée à [[02-plex/01-presentation-installation-exploitation|Plex]].

## Installation

```bash
# Debian / Ubuntu : script du dépôt officiel (ajoute le dépôt et installe jellyfin)
curl -fsSL https://repo.jellyfin.org/install-debuntu.sh -o install-jellyfin.sh
less install-jellyfin.sh && sudo bash install-jellyfin.sh
systemctl status jellyfin
# Interface : http://serveur:8096 → assistant (langue, compte administrateur, bibliothèques)
```

```yaml compose.yaml (Docker)
services:
  jellyfin:
    image: jellyfin/jellyfin:10.11      # épingler la version
    user: "1000:1000"
    network_mode: host                  # découverte DLNA/locale ; sinon publier 8096
    volumes:
      - ./config:/config
      - ./cache:/cache
      - /srv/medias:/media:ro           # médias en lecture seule
    devices:
      - /dev/dri:/dev/dri               # GPU Intel/AMD pour le transcodage matériel
    restart: unless-stopped
```

**Windows** : installateur (service ou application de la barre des tâches) ; **macOS** : application `.dmg`. Les médias peuvent être sur un NAS (montage NFS/SMB en lecture seule côté serveur).

| Port | Usage |
| --- | --- |
| **8096/TCP** | HTTP (interface, API) |
| 8920/TCP | HTTPS intégré (préférer un reverse proxy) |
| 7359/UDP, 1900/UDP | Découverte locale des clients, DLNA |

Données : `/var/lib/jellyfin` (base, métadonnées), `/etc/jellyfin` (configuration), `/var/cache/jellyfin` (images, transcodage) sous Linux.

## Bibliothèques et nommage

Le nommage des fichiers conditionne l'identification correcte des métadonnées :

```text Organisation recommandée
/srv/medias/
├── Films/
│   └── Le Fabuleux Destin d'Amélie Poulain (2001)/
│       └── Le Fabuleux Destin d'Amélie Poulain (2001).mkv
├── Series/
│   └── Kaamelott (2005)/
│       └── Season 01/
│           └── Kaamelott S01E01.mkv
└── Musique/
    └── Artiste/
        └── Album (Année)/
            └── 01 - Titre.flac
```

- Un type de contenu par bibliothèque (*Films*, *Séries*, *Musique*), langue des métadonnées en français.
- Fournisseurs de métadonnées : TMDb, TheTVDB (extension), MusicBrainz ; images et sous-titres (extension OpenSubtitles).
- Analyse planifiée des bibliothèques ou surveillance en temps réel (*inotify* : augmenter `fs.inotify.max_user_watches` pour les grandes bibliothèques).

## Utilisateurs

Comptes locaux (ou extension LDAP/SSO), droits par bibliothèque, **contrôle parental** (classification maximale, horaires), limite de débit par utilisateur pour l'accès distant, profil de lecture par appareil.

## Transcodage

Quand un client ne sait pas lire un format (codec, conteneur, sous-titres incrustés, débit), le serveur **transcode** en temps réel avec FFmpeg (version *jellyfin-ffmpeg* fournie). Le transcodage logiciel est très coûteux : utilisez l'**accélération matérielle**.

| Matériel | Méthode | Remarques |
| --- | --- | --- |
| **Intel** (iGPU 7ᵉ génération et plus) | QSV / VA-API | Excellent rapport efficacité/prix ; HEVC 10 bits, AV1 selon la génération |
| NVIDIA | NVENC/NVDEC | Pilotes propriétaires, *NVIDIA Container Toolkit* en Docker |
| AMD | VA-API (AMF sous Windows) | Qualité variable selon la génération |

*Tableau de bord → Lecture → Transcodage* : choisir l'accélération, cocher les codecs décodés par le matériel, activer le mappage de tons (HDR → SDR) si le GPU le permet. L'utilisateur du service doit appartenir aux groupes `render`/`video`.

Le meilleur transcodage est celui qu'on évite : **lecture directe** (*direct play*) avec des formats largement compatibles (H.264/HEVC + AAC dans MP4/MKV) et des sous-titres texte (SRT) plutôt qu'image (PGS).

Suite : [[02-acces-distant-exploitation|accès distant, sécurité et exploitation]].
