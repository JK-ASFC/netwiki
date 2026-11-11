---
title: Kodi
description: Kodi, media center libre (GPL) — plates-formes (LibreELEC et OSMC sur Raspberry Pi ou mini-PC, Android TV, Windows, Linux, macOS), sources réseau (SMB, NFS, WebDAV, UPnP), bibliothèques et scrapers, base MySQL/MariaDB partagée entre plusieurs Kodi, clients Jellyfin et Plex, télécommandes et API JSON-RPC, extensions et sécurité.
tags: [kodi, libreelec, osmc, media center, smb, nfs, mariadb, jellyfin, json-rpc]
icon: tv
---

**Kodi** transforme un téléviseur en **centre multimédia** : il lit les films, séries et musiques d'un NAS ou d'un serveur, avec affiches, résumés et reprise de lecture.

## Où l'installer

| Plate-forme | Remarque |
| --- | --- |
| **LibreELEC** | Système minimal dédié à Kodi (Raspberry Pi, mini-PC x86) : démarre directement dans Kodi, mises à jour simples |
| **OSMC** | Distribution Debian avec Kodi, plus ouverte (paquets supplémentaires) |
| Android TV, Google TV, Fire TV | Application Kodi du magasin |
| Windows, Linux, macOS | Application classique (`winget install XBMCFoundation.Kodi`, `flatpak install flathub tv.kodi.Kodi`) |

## Ajouter des sources

*Vidéos → Fichiers → Ajouter des vidéos* puis *Parcourir* :

| Protocole | Exemple | Remarque |
| --- | --- | --- |
| **SMB** | `smb://nas.local/Films/` | Le plus courant ; activer SMB 2/3 minimum dans *Paramètres → Services → SMB* |
| **NFS** | `nfs://nas.local/volume1/films/` | Léger et rapide sur un réseau local Linux |
| WebDAV | `davs://nas.exemple.fr/films/` | Accès distant via HTTPS |
| UPnP/DLNA | Découverte automatique | Pas de bibliothèque locale riche |

Définir pour chaque source le **type de contenu** (films, séries) et le **scraper** (The Movie Database, TheTVDB) qui récupère les métadonnées. Nommer les fichiers proprement (`Titre (Année).mkv`, `Série/Saison 01/Série S01E01.mkv`).

## Plusieurs téléviseurs : base partagée

Pour partager l'état « vu » et la reprise de lecture entre plusieurs Kodi, utiliser une base **MariaDB** commune :

```xml ~/.kodi/userdata/advancedsettings.xml
<advancedsettings>
  <videodatabase>
    <type>mysql</type>
    <host>192.168.1.20</host>
    <port>3306</port>
    <user>kodi</user>
    <pass>MotDePasse</pass>
  </videodatabase>
  <musicdatabase>
    <type>mysql</type>
    <host>192.168.1.20</host>
    <port>3306</port>
    <user>kodi</user>
    <pass>MotDePasse</pass>
  </musicdatabase>
</advancedsettings>
```

Les sources doivent avoir **exactement le même chemin** (`smb://…`) sur tous les Kodi. Alternative plus simple aujourd'hui : un serveur **Jellyfin** ou **Plex** et le greffon **Jellyfin for Kodi** ou **PlexKodiConnect** (voir les pages Jellyfin et Plex du wiki).

## Télécommandes et API

- *Paramètres → Services → Contrôle* : autoriser le contrôle à distance par HTTP (port 8080, identifiant et mot de passe) et par les applications.
- Applications : **Kore** (officielle, Android), Yatse, ou télécommande du téléviseur (HDMI-CEC).
- API **JSON-RPC** pour l'automatisation (domotique) :

```bash
curl -s -u kodi:MotDePasse -H 'Content-Type: application/json' \
  -d '{"jsonrpc":"2.0","method":"Player.GetActivePlayers","id":1}' http://192.168.1.30:8080/jsonrpc
curl -s -u kodi:MotDePasse -H 'Content-Type: application/json' \
  -d '{"jsonrpc":"2.0","method":"VideoLibrary.Scan","id":1}' http://192.168.1.30:8080/jsonrpc
```

## Extensions et sécurité

- N'installer des extensions que depuis le **dépôt officiel** ; les dépôts tiers de « streaming gratuit » diffusent souvent du contenu illégal et des logiciels malveillants.
- Mettre un mot de passe sur le contrôle à distance et ne pas l'exposer hors du réseau local.

Voir aussi : [[02-vlc-mpv|VLC et mpv]]. Commandes : [[90-aide-memoire|aide-mémoire]].
