---
title: Radicale — aide-mémoire des commandes
description: Commandes Radicale avec exemples — lancement et options (python -m radicale, --config, --debug), service systemd, utilisateurs (htpasswd bcrypt), droits (fichier rights), stockage et sauvegarde, vérification du stockage (--verify-storage), tests CalDAV/CardDAV avec curl, clients (Thunderbird, DAVx5, macOS/iOS), proxy inverse.
tags: [aide-mémoire, radicale, caldav, carddav, calendrier, contacts]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-installation-configuration|Radicale]].

## Lancement

```bash
python3 -m pip install --upgrade radicale
python3 -m radicale --config /etc/radicale/config
python3 -m radicale --debug --config /etc/radicale/config
python3 -m radicale --verify-storage --config /etc/radicale/config
sudo systemctl status radicale
```

## Configuration type

```ini
# /etc/radicale/config
[server]
hosts = 127.0.0.1:5232
[auth]
type = htpasswd
htpasswd_filename = /etc/radicale/users
htpasswd_encryption = bcrypt
[rights]
type = owner_only
[storage]
filesystem_folder = /var/lib/radicale/collections
```

```bash
sudo htpasswd -B -c /etc/radicale/users amartin
sudo htpasswd -B /etc/radicale/users bpetit
```

## Tests

```bash
curl -u amartin -X PROPFIND -H "Depth: 1" http://127.0.0.1:5232/amartin/ | xmllint --format - | grep -E "displayname|href"
curl -u amartin -X MKCALENDAR http://127.0.0.1:5232/amartin/travail/
curl -u amartin -T rendez-vous.ics http://127.0.0.1:5232/amartin/travail/rdv-1.ics
```

## Sauvegarde

```bash
sudo tar czf /srv/sauvegardes/radicale-$(date +%F).tar.gz /var/lib/radicale/collections /etc/radicale
```

## Clients

| Client | URL à saisir |
| --- | --- |
| Thunderbird (Windows, Linux, macOS) | `https://dav.exemple.fr/amartin/` (découverte des agendas et carnets) |
| Android | DAVx5 |
| iOS / macOS | Comptes CalDAV/CardDAV avec serveur `dav.exemple.fr` |
