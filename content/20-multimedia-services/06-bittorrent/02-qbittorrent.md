---
title: qBittorrent (qbittorrent-nox)
description: qBittorrent en mode serveur — qbittorrent-nox sans interface graphique, installation (Debian, RHEL, Docker, Windows, macOS), premier accès et mot de passe temporaire, interface web (authentification, contournement local, HTTPS, liste d'IP, protection contre le clickjacking et CSRF), catégories et dossiers, liaison à l'interface VPN, flux RSS, API Web, sécurité et dépannage.
tags: [qbittorrent, bittorrent, qbittorrent-nox, interface web, vpn, rss]
icon: download
---

**qBittorrent** (GPL, basé sur libtorrent) est un client BitTorrent complet ; la version **qbittorrent-nox** fonctionne sans interface graphique, pilotée par son **interface web** et son **API**. Il est très utilisé sur les serveurs domestiques et NAS. Mêmes précautions d'usage légal et de politique réseau que pour [[01-transmission|Transmission]].

## Installation

```bash
sudo apt install qbittorrent-nox
sudo useradd -r -m -d /var/lib/qbittorrent -s /usr/sbin/nologin qbittorrent
sudo systemctl enable --now qbittorrent-nox@qbittorrent       # unité modèle fournie par le paquet
sudo journalctl -u qbittorrent-nox@qbittorrent | grep -i "password"   # mot de passe temporaire (versions récentes)
```

```yaml compose.yaml (Docker)
services:
  qbittorrent:
    image: lscr.io/linuxserver/qbittorrent:latest
    environment:
      PUID: "1000"
      PGID: "1000"
      TZ: Europe/Paris
      WEBUI_PORT: "8080"
    volumes:
      - ./config:/config
      - /srv/torrents:/downloads
    ports:
      - "127.0.0.1:8080:8080"
      - "6881:6881"
      - "6881:6881/udp"
    restart: unless-stopped
```

Windows et macOS : application graphique (avec interface web activable dans *Préférences → Interface web*).

Depuis la version 4.6.1, il n'y a plus de mot de passe par défaut (`adminadmin`) : un **mot de passe temporaire** est affiché dans les journaux au premier démarrage, à remplacer immédiatement.

## Interface web

*Outils → Options → Interface web* :

| Réglage | Recommandation |
| --- | --- |
| Adresse IP / port | `127.0.0.1` derrière un reverse proxy, ou adresse du réseau d'administration |
| Authentification | Nom d'utilisateur et mot de passe forts ; **ne pas** cocher « Contourner l'authentification pour les clients sur localhost » derrière un proxy (tout passerait pour local) |
| Liste blanche de sous-réseaux | Uniquement si l'accès est déjà contrôlé |
| HTTPS | Certificat, ou TLS terminé par le proxy |
| Sécurité | Protection contre le *clickjacking*, CSRF, validation de l'en-tête Host activées ; *proxies inverses de confiance* renseignés |
| Bannissement | Nombre d'échecs avant bannissement de l'IP |

## Organisation

- **Catégories** avec dossier de destination propre (`iso`, `jeux-de-donnees`) et gestion automatique des torrents (*Automatic Torrent Management*).
- Dossier « incomplets » séparé, exécution d'un programme à la fin (script de déplacement, vérification d'empreinte, analyse antivirus).
- **RSS** : téléchargement automatique depuis des flux (ex. nouvelles versions publiées sous forme de torrents) avec règles de filtrage.

## Réseau

- Port d'écoute entrant (redirection sur le routeur), UPnP/NAT-PMP désactivés en entreprise.
- *Avancé → Interface réseau* : **lier qBittorrent à l'interface VPN** (ex. `wg0`) si une politique l'impose : en cas de coupure du VPN, aucun trafic ne sort par l'interface normale.
- Limites de débit globales et planifiées (*planificateur de limites alternatives*), nombre de connexions.

## API

```bash
# Authentification puis liste des torrents (API Web v2)
curl -s -c cookie.txt --data "username=admin-torrent&password=MotDePasse" http://127.0.0.1:8080/api/v2/auth/login
curl -s -b cookie.txt "http://127.0.0.1:8080/api/v2/torrents/info?filter=downloading" | jq '.[].name'
curl -s -b cookie.txt -F "urls=https://releases.ubuntu.com/24.04/ubuntu-24.04.3-live-server-amd64.iso.torrent" -F "category=iso" http://127.0.0.1:8080/api/v2/torrents/add
```

## Dépannage

| Symptôme | Cause | Solution |
| --- | --- | --- |
| `Unauthorized` derrière le proxy | Validation de l'en-tête Host, CSRF | Désactiver la validation de l'en-tête Host ou renseigner les noms, proxy de confiance, `Referer` transmis |
| IP bannie après erreurs | Échecs d'authentification | Attendre ou redémarrer, corriger le mot de passe du client |
| Aucun trafic | Interface liée (VPN) arrêtée | Rétablir le VPN, vérifier l'interface choisie |
| Mot de passe inconnu au premier démarrage | Mot de passe temporaire dans les journaux | `journalctl`, journaux du conteneur |
