---
title: Deluge (deluged et interface web)
description: Client BitTorrent Deluge en architecture client-serveur — démon deluged, interfaces web (deluge-web), GTK et console, installation (Debian, RHEL, Docker, Windows, macOS), fichier auth et connexion distante, configuration par deluge-console, greffons (Label, Execute, AutoAdd, Scheduler), sécurité de l'interface web et dépannage.
tags: [deluge, bittorrent, deluged, deluge-web, greffons, client serveur]
icon: download
---

**Deluge** (GPL, Python, basé sur libtorrent) sépare le **démon** (`deluged`, qui télécharge) des **interfaces** : web (`deluge-web`), graphique GTK et console. Un poste de travail peut ainsi piloter le démon d'un serveur avec l'interface graphique en **mode client léger**. Mêmes règles d'usage que les autres clients ([[01-transmission|Transmission]], [[02-qbittorrent|qBittorrent]]).

## Installation

```bash
sudo apt install deluged deluge-web deluge-console
sudo adduser --system --group --home /var/lib/deluged deluge
# Unités systemd (le paquet Debian fournit /etc/default/deluged ; sinon créer les unités)
sudo systemctl enable --now deluged deluge-web
```

```yaml compose.yaml (Docker)
services:
  deluge:
    image: lscr.io/linuxserver/deluge:latest
    environment: { PUID: "1000", PGID: "1000", TZ: Europe/Paris }
    volumes:
      - ./config:/config
      - /srv/torrents:/downloads
    ports:
      - "127.0.0.1:8112:8112"     # interface web
      - "127.0.0.1:58846:58846"   # démon (clients légers)
      - "6881:6881"
      - "6881:6881/udp"
    restart: unless-stopped
```

Windows et macOS : installateurs officiels (interface graphique, avec option client léger).

| Port | Usage |
| --- | --- |
| 58846/TCP | Démon (connexion des interfaces) |
| **8112/TCP** | Interface web |
| 6881 (TCP/UDP) | Pairs (configurable) |

## Authentification

```text /var/lib/deluged/config/auth  (format utilisateur:mot de passe:niveau — 10 = administrateur)
localclient:jetonGenereAutomatiquement:10
admin-torrent:MotDePasseDemonTresLong:10
```

- Le démon n'accepte les connexions distantes que si `allow_remote` est activé (`deluge-console "config -s allow_remote true"`) ; préférez un **tunnel SSH** vers 58846 plutôt que l'exposition du port.
- L'interface web a son **propre mot de passe** (défaut historique `deluge` : à changer au premier accès), puis se connecte au démon via le *gestionnaire de connexions*.

## Configuration en console

```bash
deluge-console "config"                                          # tous les paramètres
deluge-console "config -s download_location '/srv/torrents/en-cours'"
deluge-console "config -s move_completed true"
deluge-console "config -s move_completed_path '/srv/torrents/termines'"
deluge-console "config -s max_upload_speed 2000.0"
deluge-console "add https://exemple.org/image.iso.torrent"
deluge-console "info"
```

## Greffons

| Greffon | Usage |
| --- | --- |
| **Label** | Étiquettes avec destination et limites propres |
| **Execute** | Commande à la fin d'un téléchargement (vérification, déplacement, analyse antivirus) |
| **AutoAdd** | Surveille un dossier et ajoute les `.torrent` déposés |
| **Scheduler** | Limites de débit selon les heures |
| Blocklist, Notifications, Stats | Listes de blocage, courriels, statistiques |

## Sécurité et dépannage

- [ ] Interface web derrière un reverse proxy HTTPS authentifié ou accessible par VPN ; mot de passe changé
- [ ] Port du démon non exposé (tunnel SSH pour le client léger)
- [ ] Utilisateur système dédié, répertoires sans exécution

| Symptôme | Cause | Solution |
| --- | --- | --- |
| Interface web « Connection failed » vers le démon | Démon arrêté, identifiants du fichier `auth` | `systemctl status deluged`, utilisateur du fichier auth |
| Client léger refusé | `allow_remote` désactivé, pare-feu | Tunnel SSH (`ssh -L 58846:127.0.0.1:58846`) |
| Greffons absents de l'interface web | Greffon activé seulement côté client GTK | Activer dans les préférences de l'interface web (côté démon) |
| Mot de passe web oublié | Hachage dans `web.conf` | Arrêter `deluge-web`, réinitialiser `pwd_salt`/`pwd_sha1` selon la documentation |
