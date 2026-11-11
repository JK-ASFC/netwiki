---
title: aria2
description: aria2, téléchargeur multiprotocole en ligne de commande (GPL) — HTTP(S), FTP, SFTP, BitTorrent, Metalink ; connexions multiples par fichier, reprise, listes de téléchargement, limites de débit, authentification et en-têtes, vérification de somme de contrôle, BitTorrent et magnets, mode démon avec interface RPC (JSON-RPC, jeton secret), interfaces web AriaNg, service systemd.
tags: [aria2, aria2c, téléchargement, http, ftp, bittorrent, metalink, rpc, ariang]
icon: download
---

**aria2** (`aria2c`) accélère les gros téléchargements en ouvrant **plusieurs connexions** par fichier, reprend les transferts interrompus, gère **BitTorrent** et **Metalink**, et peut tourner en **démon** piloté par une interface web. Utile pour récupérer des images ISO, des sauvegardes ou des jeux de données sur un serveur.

```bash
sudo apt install aria2 ; sudo dnf install aria2 ; brew install aria2 ; winget install aria2.aria2
```

## Téléchargements

```bash
aria2c https://exemple.fr/debian.iso                           # simple, avec reprise automatique
aria2c -x 8 -s 8 https://exemple.fr/gros-fichier.iso            # 8 connexions vers le serveur
aria2c -c https://exemple.fr/gros-fichier.iso                   # reprendre un téléchargement partiel
aria2c -d /srv/iso -o debian-13.iso https://exemple.fr/debian.iso
aria2c https://miroir1/fichier.iso https://miroir2/fichier.iso  # même fichier depuis deux miroirs
aria2c -i liste.txt -j 3                                        # liste d'URL, 3 fichiers en parallèle
aria2c --max-overall-download-limit=20M -i liste.txt            # limiter le débit total
aria2c --checksum=sha-256=<empreinte> https://exemple.fr/debian.iso   # vérifier l'intégrité
```

| Option | Rôle |
| --- | --- |
| `-x N` | Connexions maximales par serveur (16 au plus) |
| `-s N` | Découper le fichier en N morceaux |
| `-j N` | Téléchargements simultanés |
| `-c` | Reprendre (continue) |
| `-d` / `-o` | Dossier / nom de fichier |
| `--header="Authorization: Bearer …"` | En-tête HTTP |
| `--http-user`, `--http-passwd`, `--ftp-user`, `--ftp-passwd` | Authentification |
| `--max-download-limit`, `--max-overall-download-limit` | Débit par fichier / total |

> [!NOTE]
> Beaucoup de connexions vers un même serveur peuvent être mal vues (ou bloquées) par certains hébergeurs : restez raisonnable (`-x 4` à `-x 8`).

## BitTorrent et Metalink

```bash
aria2c fichier.torrent
aria2c "magnet:?xt=urn:btih:…"
aria2c --seed-time=0 fichier.torrent             # ne pas partager après le téléchargement
aria2c --seed-ratio=1.0 fichier.torrent          # partager jusqu'au ratio 1
aria2c --show-files fichier.torrent ; aria2c --select-file=2,5 fichier.torrent
aria2c https://exemple.fr/fichier.metalink       # Metalink : miroirs et sommes de contrôle
```

## Démon et RPC

```ini ~/.config/aria2/aria2.conf
dir=/srv/telechargements
continue=true
max-concurrent-downloads=3
max-connection-per-server=8
split=8
enable-rpc=true
rpc-listen-all=false
rpc-listen-port=6800
rpc-secret=Jeton-Long-Et-Aleatoire
input-file=/home/alice/.config/aria2/session
save-session=/home/alice/.config/aria2/session
save-session-interval=60
```

```bash
touch ~/.config/aria2/session
aria2c --conf-path=$HOME/.config/aria2/aria2.conf -D           # en arrière-plan
# Ajouter un téléchargement par JSON-RPC
curl -s http://127.0.0.1:6800/jsonrpc -d '{"jsonrpc":"2.0","id":"1","method":"aria2.addUri","params":["token:Jeton-Long-Et-Aleatoire",["https://exemple.fr/fichier.iso"]]}'
curl -s http://127.0.0.1:6800/jsonrpc -d '{"jsonrpc":"2.0","id":"2","method":"aria2.tellActive","params":["token:Jeton-Long-Et-Aleatoire"]}'
```

**AriaNg** (interface web statique) se connecte à l'adresse RPC avec le jeton. Ne publiez pas le port 6800 sans jeton ni TLS : il permet d'écrire des fichiers sur le serveur.

Service systemd utilisateur :

```ini ~/.config/systemd/user/aria2.service
[Unit]
Description=aria2 (démon RPC)

[Service]
ExecStart=/usr/bin/aria2c --conf-path=%h/.config/aria2/aria2.conf
Restart=on-failure

[Install]
WantedBy=default.target
```

```bash
systemctl --user enable --now aria2
```

Voir aussi : [[02-yt-dlp|yt-dlp]] (qui peut utiliser aria2 comme téléchargeur) et les pages BitTorrent du wiki. Commandes : [[90-aide-memoire|aide-mémoire]].
