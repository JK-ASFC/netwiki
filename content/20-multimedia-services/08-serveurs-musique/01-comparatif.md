---
title: Choisir un serveur de musique
description: Comparatif des serveurs de musique auto-hébergés — Navidrome, Ampache, Lyrion Music Server (ex-Logitech Media Server), Mopidy, Airsonic-Advanced et Funkwhale — selon l'usage (écoute sur téléphone et navigateur, lecteurs réseau multiroom, lecture sur le serveur, fédération), la compatibilité Subsonic, les ressources et l'état de maintenance.
tags: [musique, navidrome, ampache, lyrion, mopidy, airsonic, funkwhale, subsonic]
icon: music
---

Deux familles de besoins coexistent :

- **Écouter sa bibliothèque sur ses appareils** (téléphone, navigateur, voiture) : le serveur **diffuse** les fichiers vers des clients, souvent via l'**API Subsonic** qu'utilisent de nombreuses applications.
- **Piloter des lecteurs dans la maison** (enceintes, amplificateurs, Raspberry Pi) : le serveur **commande** la lecture sur des appareils du réseau ou sur sa propre sortie audio.

| Serveur | Langage, licence | Usage principal | API Subsonic | Ressources | État |
| --- | --- | --- | --- | --- | --- |
| **Navidrome** | Go, GPL | Diffusion vers clients | Oui (OpenSubsonic) | Très faibles | Très actif — [[03-navidrome/01-installation-configuration\|page dédiée]] |
| **Ampache** | PHP, AGPL | Diffusion, bibliothèques volumineuses, multi-utilisateurs | Oui + API Ampache | Moyennes (MariaDB) | Actif |
| **Lyrion Music Server** | Perl, GPL | **Lecteurs réseau multiroom** (Squeezebox, piCorePlayer, Squeezelite) | Non (greffons) | Faibles | Actif (communauté) |
| **Mopidy** | Python, Apache 2.0 | **Lecture sur le serveur** (enceinte branchée), compatible MPD | Non | Faibles | Actif |
| **Airsonic-Advanced** | Java, GPL | Diffusion (héritier de Subsonic) | Oui | Élevées (JVM) | **Peu maintenu** |
| **Funkwhale** | Python, AGPL | Bibliothèques **fédérées** (ActivityPub), podcasts, chaînes | Oui | Élevées (PostgreSQL, Redis) | Actif |

## Orientation

| Besoin | Choix |
| --- | --- |
| Usage personnel ou familial, Raspberry Pi | Navidrome |
| Très grosse bibliothèque, catalogues multiples, droits fins | Ampache |
| Son dans plusieurs pièces, vieux Squeezebox, lecteurs DIY | Lyrion Music Server |
| Jukebox sur un Raspberry Pi relié à un ampli | Mopidy (avec l'interface Iris) |
| Partager de la musique entre instances, communauté, podcasts | Funkwhale |
| Installation Airsonic existante | Migrer vers Navidrome ou gonic |

## Points communs

- **Étiquettes** propres (MusicBrainz Picard, beets) : les métadonnées conditionnent la qualité de la bibliothèque.
- **FFmpeg** pour le transcodage à la volée (réduire le débit en 4G).
- **Reverse proxy HTTPS** devant le serveur (voir les pages Nginx, Caddy, Traefik du wiki) et pas d'exposition directe sur Internet sans authentification.
- **Sauvegarde** de la base (playlists, favoris, utilisateurs) en plus des fichiers musicaux.

Pages : [[02-ampache|Ampache]] · [[03-lyrion-music-server|Lyrion Music Server]] · [[04-mopidy|Mopidy]] · [[05-airsonic-advanced|Airsonic-Advanced]] · [[06-funkwhale|Funkwhale]]. Commandes : [[90-aide-memoire|aide-mémoire]].
