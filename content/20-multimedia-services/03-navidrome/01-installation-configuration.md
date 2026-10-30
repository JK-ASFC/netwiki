---
title: Installation, configuration et exploitation
description: Navidrome, serveur de musique personnel compatible avec l'API Subsonic/OpenSubsonic — installation (binaire et systemd, Docker, Windows, macOS), navidrome.toml, organisation et étiquettes de la bibliothèque, transcodage à la volée, utilisateurs et partages, clients web et mobiles, reverse proxy, authentification par en-tête, sauvegarde et dépannage.
tags: [navidrome, musique, subsonic, streaming, docker, reverse proxy]
icon: music
---

**Navidrome** (GPL, écrit en Go) diffuse une collection musicale personnelle : interface web moderne, listes de lecture, favoris, notes, radios internet, et compatibilité avec les nombreux **clients Subsonic** (DSub, Symfonium, Substreamer, Feishin, play:Sub). Léger, il fonctionne aussi bien sur un Raspberry Pi que sur un serveur.

## Installation

```bash
# Binaire + systemd
sudo useradd -r -s /usr/sbin/nologin navidrome
sudo install -d -o navidrome -g navidrome /var/lib/navidrome /opt/navidrome
VERSION=0.58.0   # vérifier la dernière version
wget https://github.com/navidrome/navidrome/releases/download/v${VERSION}/navidrome_${VERSION}_linux_amd64.tar.gz
sudo tar xzf navidrome_${VERSION}_linux_amd64.tar.gz -C /opt/navidrome
sudo apt install ffmpeg            # transcodage
```

```ini /var/lib/navidrome/navidrome.toml
MusicFolder = "/srv/musique"
DataFolder = "/var/lib/navidrome"
Address = "127.0.0.1"
Port = 4533
BaseUrl = ""
ScanSchedule = "@every 1h"
LogLevel = "info"
DefaultLanguage = "fr"
EnableTranscodingConfig = false
EnableSharing = true
SessionTimeout = "24h"
# Authentification déléguée au reverse proxy (SSO) : seulement si le proxy filtre l'en-tête
# ReverseProxyUserHeader = "Remote-User"
# ReverseProxyWhitelist = "127.0.0.1/32"
```

```ini /etc/systemd/system/navidrome.service
[Unit]
Description=Navidrome
After=network-online.target

[Service]
User=navidrome
Group=navidrome
ExecStart=/opt/navidrome/navidrome --configfile /var/lib/navidrome/navidrome.toml
WorkingDirectory=/var/lib/navidrome
Restart=on-failure
ProtectSystem=full
ReadWritePaths=/var/lib/navidrome

[Install]
WantedBy=multi-user.target
```

```yaml compose.yaml (Docker)
services:
  navidrome:
    image: deluan/navidrome:latest
    user: "1000:1000"
    ports: ["127.0.0.1:4533:4533"]
    environment:
      ND_SCANSCHEDULE: 1h
      ND_DEFAULTLANGUAGE: fr
    volumes:
      - ./data:/data
      - /srv/musique:/music:ro
    restart: unless-stopped
```

Windows : installateur MSI (service) ; macOS : binaire ou Homebrew. Premier accès : création du compte administrateur.

## Bibliothèque

Navidrome s'appuie sur les **étiquettes** des fichiers (ID3, Vorbis, MP4), pas sur l'arborescence : des étiquettes propres (artiste, artiste de l'album, album, numéro de piste, année, genre, pochette) donnent une bibliothèque propre. **MusicBrainz Picard** ou **beets** corrigent les étiquettes en masse. Formats : MP3, FLAC, Opus, AAC, OGG…

## Transcodage et partages

Le transcodage (FFmpeg) réduit le débit pour les mobiles (Opus 128 kbit/s, MP3) ; les **lecteurs** (clients) ont chacun un format et un débit maximal. Les **partages** créent des liens publics temporaires vers un album ou une liste.

## Accès distant et sécurité

- Reverse proxy HTTPS ([[03-nginx/05-reverse-proxy-repartition|nginx]], Caddy, Traefik) vers `127.0.0.1:4533`, ou accès par VPN.
- Comptes avec mots de passe forts ; l'API Subsonic utilise des jetons dérivés du mot de passe (certains anciens clients l'envoient presque en clair : HTTPS obligatoire).
- Limitation des tentatives intégrée ; [[01-fail2ban/01-presentation-configuration|Fail2ban]] possible sur les journaux.
- `ReverseProxyUserHeader` seulement si le proxy **supprime** l'en-tête envoyé par les clients et n'est joignable que par lui.

## Sauvegarde et dépannage

Sauvegardez `DataFolder` (base `navidrome.db` : utilisateurs, listes, favoris, statistiques) — commande intégrée `navidrome backup create` dans les versions récentes, ou copie service arrêté.

| Symptôme | Cause | Solution |
| --- | --- | --- |
| Albums éclatés ou en double | Étiquettes incohérentes (artiste de l'album, compilations) | Corriger les étiquettes (Picard), relancer une analyse complète |
| Pochettes absentes | Pas d'image intégrée ni de `cover.jpg` | Ajouter les images, `CoverArtPriority` |
| Fichiers ignorés | Droits de lecture, format non reconnu | Droits de l'utilisateur du service, journal de l'analyse |
| Client Subsonic refuse la connexion | URL (BaseUrl), certificat, version de l'API | URL complète, certificat valide |
