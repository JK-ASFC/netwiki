---
title: Transmission (démon et interface web)
description: Client BitTorrent Transmission en mode serveur — usages légitimes (distributions Linux, images, jeux de données), installation de transmission-daemon (Debian, RHEL, Docker, macOS, Windows), settings.json (répertoires, RPC, authentification, liste blanche, ports, chiffrement, limites, listes de blocage), interface web et transmission-remote, réseau (port entrant, UPnP, VPN), sécurité et dépannage.
tags: [transmission, bittorrent, transmission-daemon, rpc, interface web, téléchargement]
icon: download
---

**BitTorrent** distribue des fichiers volumineux de pair à pair. Usages légitimes en infrastructure : téléchargement des **images ISO** de distributions (Debian, Ubuntu, Fedora publient des torrents), de jeux de données publics, distribution interne de gros fichiers. Respectez les droits d'auteur et la politique de sécurité de l'organisation : sur un réseau d'entreprise, le pair à pair est souvent interdit par défaut.

**Transmission** (GPL) est léger, avec un démon (`transmission-daemon`) piloté par une interface web et une API **RPC**.

## Installation

```bash
sudo apt install transmission-daemon          # Debian / Ubuntu (utilisateur debian-transmission)
sudo dnf install transmission-daemon          # RHEL / Fedora (EPEL)
sudo systemctl stop transmission-daemon       # arrêter avant de modifier settings.json (sinon écrasé)
```

```yaml compose.yaml (Docker)
services:
  transmission:
    image: lscr.io/linuxserver/transmission:latest
    environment:
      PUID: "1000"
      PGID: "1000"
      TZ: Europe/Paris
      USER: admin-torrent
      PASS: MotDePasseInterfaceTresLong
    volumes:
      - ./config:/config
      - /srv/torrents:/downloads
    ports:
      - "127.0.0.1:9091:9091"
      - "51413:51413"
      - "51413:51413/udp"
    restart: unless-stopped
```

macOS : application Transmission (avec interface web activable) ; Windows : client Transmission Qt.

## settings.json

```json /etc/transmission-daemon/settings.json (extraits)
{
  "download-dir": "/srv/torrents/termines",
  "incomplete-dir": "/srv/torrents/en-cours",
  "incomplete-dir-enabled": true,
  "rpc-enabled": true,
  "rpc-bind-address": "127.0.0.1",
  "rpc-port": 9091,
  "rpc-authentication-required": true,
  "rpc-username": "admin-torrent",
  "rpc-password": "MotDePasseInterfaceTresLong",
  "rpc-whitelist-enabled": true,
  "rpc-whitelist": "127.0.0.1,10.0.99.*",
  "rpc-host-whitelist-enabled": true,
  "rpc-host-whitelist": "torrent.corp.exemple.fr",
  "peer-port": 51413,
  "port-forwarding-enabled": false,
  "encryption": 1,
  "speed-limit-up": 2000,
  "speed-limit-up-enabled": true,
  "ratio-limit": 2,
  "ratio-limit-enabled": true,
  "blocklist-enabled": false,
  "umask": 2
}
```

Le mot de passe RPC saisi en clair est **haché** au démarrage. Redémarrez ensuite le service : `sudo systemctl start transmission-daemon`.

| Paramètre | Rôle |
| --- | --- |
| `rpc-bind-address` | Interface de l'API/interface web : `127.0.0.1` derrière un reverse proxy HTTPS |
| `rpc-whitelist` | Adresses autorisées à l'API |
| `rpc-host-whitelist` | Noms d'hôte acceptés (protection contre le *DNS rebinding*) |
| `peer-port` | Port entrant des pairs (à rediriger sur le routeur pour la connectivité) |
| `encryption` | 0 = préférer le clair, 1 = préférer le chiffré, 2 = exiger le chiffré |
| `ratio-limit` | Arrêt du partage après un ratio envoi/réception |

## Utilisation

```bash
transmission-remote 127.0.0.1:9091 -n 'admin-torrent:MotDePasseInterfaceTresLong' -a https://cdimage.debian.org/debian-cd/current/amd64/bt-dvd/debian-13.1.0-amd64-DVD-1.iso.torrent
transmission-remote 127.0.0.1:9091 -n 'admin-torrent:…' -l          # liste
transmission-remote 127.0.0.1:9091 -n 'admin-torrent:…' -t 1 -i     # détails
transmission-remote 127.0.0.1:9091 -n 'admin-torrent:…' -t 1 -r     # retirer (sans supprimer les données)
```

Interface web : `http://127.0.0.1:9091/transmission/web/`, ou interfaces alternatives (Flood, TrguiNG).

## Sécurité

- [ ] Interface et API **non exposées** sur Internet (liaison locale + reverse proxy HTTPS authentifié, ou VPN)
- [ ] Utilisateur système dédié, répertoire de téléchargement sans exécution, analyse antivirus des fichiers téléchargés ([[04-clamav/01-presentation-installation|ClamAV]])
- [ ] Vérification des empreintes publiées (SHA-256, signatures GPG des ISO)
- [ ] Limites de débit pour ne pas saturer le lien ; conformité à la politique d'usage du réseau

## Dépannage

| Symptôme | Cause | Solution |
| --- | --- | --- |
| `403: Forbidden` sur l'interface | Adresse ou nom d'hôte hors liste blanche | `rpc-whitelist`, `rpc-host-whitelist` |
| Réglages perdus | `settings.json` modifié service démarré | Arrêter le service, modifier, redémarrer (ou `kill -HUP`) |
| Port « fermé », peu de pairs | Port entrant non redirigé, CGNAT | Redirection de `peer-port`, VPN avec redirection de port |
| `Permission denied` à l'écriture | Droits du répertoire pour l'utilisateur du démon | Propriétaire/groupe, `umask` |
