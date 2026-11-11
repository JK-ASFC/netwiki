---
title: Prowlarr, Jackett et Bazarr
description: Les compagnons des *arr — Prowlarr (indexeurs centralisés, synchronisation vers Sonarr, Radarr et Lidarr, profils de synchronisation, proxy, FlareSolverr, historique et statistiques), Jackett (passerelle Torznab historique, migration vers Prowlarr) et Bazarr (sous-titres : fournisseurs, langues, profils, synchronisation, recherche automatique, OpenSubtitles).
tags: [prowlarr, jackett, bazarr, indexeurs, torznab, newznab, sous-titres, opensubtitles]
icon: library
---

## Prowlarr

**Prowlarr** gère les **indexeurs** (moteurs de recherche de fichiers, Usenet ou BitTorrent) **une seule fois** et les pousse vers Sonarr, Radarr, Lidarr et Readarr.

1. *Indexers → Add Indexer* : ajouter les indexeurs auxquels vous avez accès (identifiants ou clé d'API de l'indexeur).
2. *Settings → Apps* : ajouter chaque application *arr avec son adresse (`http://sonarr:8989`) et sa **clé d'API** ; choisir la synchronisation **Full Sync**.
3. Les indexeurs apparaissent automatiquement dans les applications, avec les bonnes catégories.

| Fonction | Usage |
| --- | --- |
| **Sync Profiles** | Activer recherche automatique, recherche interactive, flux RSS par application |
| **Indexer Proxies** | Proxy HTTP/SOCKS, ou **FlareSolverr** pour les sites protégés par un défi anti-robot |
| History / Stats | Requêtes, échecs, temps de réponse par indexeur |
| Recherche | Recherche manuelle sur tous les indexeurs depuis Prowlarr |

## Jackett

**Jackett** traduit les recherches des applications en requêtes vers les sites d'indexeurs et répond au format **Torznab**. Chaque indexeur doit être ajouté **à la main** dans chaque application (URL Torznab + clé d'API Jackett).

```text
http://jackett:9117/api/v2.0/indexers/<indexeur>/results/torznab/
```

Prowlarr fait la même chose avec la synchronisation en plus : pour une nouvelle installation, préférez **Prowlarr** ; pour migrer, recréer les indexeurs dans Prowlarr, ajouter les applications, puis supprimer les anciens indexeurs Jackett des *arr.

## Bazarr

**Bazarr** se connecte à Sonarr et Radarr, lit leur bibliothèque et **télécharge les sous-titres** manquants dans les langues voulues.

| Étape | Où |
| --- | --- |
| Connexion à Sonarr et Radarr | *Settings → Sonarr / Radarr* (adresse, clé d'API, correspondance des chemins si différente) |
| Langues | *Settings → Languages* : langues souhaitées, **profils de langues** (par exemple français puis anglais, sous-titres forcés) |
| Fournisseurs | *Settings → Providers* : OpenSubtitles.com (compte), Addic7ed, Podnapisi, Subscene… |
| Recherche | Automatique à l'import, puis périodique pour les sous-titres manquants ou de meilleure qualité |
| Synchronisation | Option de recalage automatique des sous-titres sur l'audio (ffsubsync) |

Les sous-titres sont enregistrés à côté de la vidéo (`Film (2024).fr.srt`), reconnus directement par Jellyfin et Plex.

Voir aussi : [[01-pile-arr|architecture]] · [[02-sonarr-radarr-lidarr-readarr|Sonarr, Radarr, Lidarr, Readarr]]. Commandes : [[90-aide-memoire|aide-mémoire]].
