---
title: Glances
description: Glances (LGPL, Python) — supervision système multiplate-forme en un coup d'œil : CPU, mémoire, charge, processus, réseau, disques, capteurs, conteneurs Docker et Podman, alertes ; installation (pipx, paquets Debian/Ubuntu/RHEL, Windows, macOS, Docker), modes terminal, serveur client, web (glances -w) et API REST, exports vers InfluxDB, Prometheus, Elasticsearch, configuration glances.conf (seuils), et usage pour le dépannage.
tags: [glances, supervision, système, terminal, api, docker]
icon: info
---

**Glances** affiche dans un seul écran tout l'état d'une machine (CPU, mémoire, processus, réseau, disques, conteneurs, températures) avec des couleurs d'alerte : l'équivalent enrichi de `top`/`htop`, utile en dépannage ou sur un petit serveur.

## Installation

| Système | Commande |
| --- | --- |
| Toutes (recommandé) | `pipx install 'glances[all]'` |
| Debian/Ubuntu | `sudo apt install glances` |
| RHEL/Fedora | `sudo dnf install glances` (EPEL) |
| macOS | `brew install glances` |
| Windows | `pip install glances` (affichage terminal via Windows Terminal) |
| Docker | `docker run --rm -it --pid host --network host -v /var/run/docker.sock:/var/run/docker.sock:ro nicolargo/glances` |

## Utilisation

```bash
glances                         # terminal ; touches : 1 (CPU par cœur), m (tri mémoire), d (disques), n (réseau), h (aide), q
glances -w --bind 127.0.0.1     # interface web http://localhost:61208 + API REST /api/4/
glances -s                      # mode serveur ; client : glances -c srv-web-01
glances --export prometheus     # expose /metrics (port 9091 par défaut, glances.conf)
glances --stdout cpu.user,mem.percent,load.min1 -t 5
curl -s http://localhost:61208/api/4/cpu | jq .
```

Seuils et exports : `~/.config/glances/glances.conf` (sections `[cpu]`, `[mem]`, `[fs]`, `[influxdb2]`, `[prometheus]`).

> [!WARNING]
> Le mode web et l'API n'ont pas d'authentification par défaut : écouter sur `127.0.0.1` ou utiliser `--password`, et passer par un tunnel SSH ou un reverse proxy authentifié.

<!-- CAPTURE: Glances — interface web | _assets/glances-web.png -->

Suite : [[02-cockpit|Cockpit]] · [[90-aide-memoire|aide-mémoire]].
