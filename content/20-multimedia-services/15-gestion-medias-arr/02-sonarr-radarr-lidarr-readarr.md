---
title: Sonarr, Radarr, Lidarr et Readarr
description: Configurer les gestionnaires de médiathèque — dossiers racine, client de téléchargement et catégories, profils de qualité et formats personnalisés (guides TRaSH, Recyclarr), nommage des fichiers, import de bibliothèque existante, notifications vers Jellyfin et Plex, liste de surveillance, API ; spécificités de Sonarr (saisons, séries animées), Radarr (films, collections), Lidarr (métadonnées MusicBrainz) et Readarr (archivé, alternatives).
tags: [sonarr, radarr, lidarr, readarr, profils de qualité, recyclarr, trash guides, médiathèque]
icon: library
---

Sonarr, Radarr, Lidarr et Readarr partagent la **même base de code** et la même interface : la configuration se fait dans le même ordre.

## Configuration commune

| Étape | Où | Conseil |
| --- | --- | --- |
| 1. Authentification | *Settings → General* | Formulaire, mot de passe fort |
| 2. Dossier racine | *Settings → Media Management → Root Folders* | `/data/media/series`, `/data/media/films`… |
| 3. Import | *Settings → Media Management* | Activer **Use Hardlinks instead of Copy** ; renommage activé |
| 4. Client de téléchargement | *Settings → Download Clients* | qBittorrent ou SABnzbd, avec une **catégorie** par application (`sonarr`, `radarr`) |
| 5. Indexeurs | Via **Prowlarr** (synchronisation automatique) | Voir [[03-prowlarr-jackett-bazarr\|Prowlarr]] |
| 6. Profils de qualité | *Settings → Profiles* | 1080p ou 2160p selon les écrans et la place disponible |
| 7. Connexions | *Settings → Connect* | Prévenir Jellyfin, Plex ou Emby après chaque import ; notifications (ntfy, Gotify, Discord, e-mail) |

## Profils de qualité et formats personnalisés

Les **profils** listent les qualités acceptables et l'ordre de préférence ; les **formats personnalisés** (*Custom Formats*) attribuent des points selon le codec, la langue, la source ou le groupe de publication. Les **guides TRaSH** proposent des profils éprouvés, et **Recyclarr** les synchronise automatiquement :

```yaml recyclarr.yml
sonarr:
  series:
    base_url: http://sonarr:8989
    api_key: !secret sonarr_cle
    quality_definition:
      type: series
radarr:
  films:
    base_url: http://radarr:7878
    api_key: !secret radarr_cle
    quality_definition:
      type: movie
```

```bash
docker run --rm -v ./recyclarr:/config ghcr.io/recyclarr/recyclarr sync
```

## Nommage

Un nommage cohérent facilite la reconnaissance par Jellyfin et Plex :

```text
Sonarr : {Series TitleYear}/Season {season:00}/{Series TitleYear} - S{season:00}E{episode:00} - {Episode CleanTitle} [{Quality Full}]
Radarr : {Movie CleanTitle} ({Release Year})/{Movie CleanTitle} ({Release Year}) [{Quality Full}]
```

## Importer une bibliothèque existante

*Series → Library Import* (Sonarr) ou *Movies → Library Import* (Radarr) : sélectionner le dossier racine, vérifier les correspondances proposées, puis importer **sans lancer de recherche** pour ne pas tout retélécharger.

## Spécificités

| Application | Particularités |
| --- | --- |
| **Sonarr** | Suivi par saison et épisode, types de séries (standard, quotidienne, **anime** avec numérotation absolue), surveillance des seules nouvelles saisons |
| **Radarr** | Films, **collections**, disponibilité minimale (annoncé, en salle, sorti), listes (TMDb, Trakt, IMDb) |
| **Lidarr** | Métadonnées **MusicBrainz**, profils de métadonnées (albums, EP, singles), formats audio (FLAC, MP3) |
| **Readarr** | Livres et livres audio (Goodreads, Calibre) ; **projet archivé**, plus de mises à jour : préférer d'autres outils (Calibre-Web, Audiobookshelf pour l'écoute) |

## API

Toutes exposent une API REST (`/api/v3` pour Sonarr et Radarr, `/api/v1` pour Lidarr et Readarr) avec l'en-tête `X-Api-Key` :

```bash
curl -s -H "X-Api-Key: $SONARR_CLE" http://serveur:8989/api/v3/system/status | jq '.version'
curl -s -H "X-Api-Key: $RADARR_CLE" http://serveur:7878/api/v3/queue | jq '.totalRecords'
curl -s -X POST -H "X-Api-Key: $SONARR_CLE" -H 'Content-Type: application/json' \
  -d '{"name":"RefreshSeries"}' http://serveur:8989/api/v3/command
```

Voir aussi : [[01-pile-arr|architecture]] · [[03-prowlarr-jackett-bazarr|Prowlarr, Jackett, Bazarr]]. Commandes : [[90-aide-memoire|aide-mémoire]].
