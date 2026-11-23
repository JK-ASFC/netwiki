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

## Modules collectés

Glances active automatiquement les greffons (*plugins*) correspondant à la machine :

| Domaine | Greffons |
| --- | --- |
| Processeur / charge | `cpu`, `percpu`, `load`, `core`, `quicklook` (jauges CPU/MEM/LOAD) |
| Mémoire | `mem`, `memswap` |
| Disques | `fs` (systèmes de fichiers), `diskio`, `irq`, `folders` (taille de répertoires surveillés) |
| Réseau | `network`, `connections` (états TCP), `ports` (ping/TCP/web sur une liste d'hôtes), `wifi` |
| Matériel | `sensors` (températures, ventilateurs, batterie), `gpu` (NVIDIA), `smart` (S.M.A.R.T., option) |
| Processus | `processlist`, `processcount`, `amps` (*Application Monitoring Processes* : surveiller un démon précis et lancer une action) |
| Conteneurs | `containers` (Docker **et** Podman : CPU/MEM/IO par conteneur) |
| Système | `system`, `uptime`, `now`, `alert` (journal des alertes récentes) |

## Utilisation

```bash
glances                         # terminal ; mise à jour toutes les secondes
glances -t 5                    # intervalle de rafraîchissement (5 s)
glances --disable-plugin sensors,gpu     # désactiver des modules
glances --enable-process-extended        # détails du processus sélectionné (E/S, threads, affinité)
```

### Touches interactives (mode terminal)

| Touche | Action | Touche | Action |
| --- | --- | --- | --- |
| `1` | CPU global ↔ par cœur | `c` / `m` / `p` / `i` / `t` | trier par CPU / MEM / nom / E/S / temps |
| `d` | masquer/afficher les E/S disque | `n` | réseau | 
| `s` | capteurs | `k` | connexions réseau |
| `f` | systèmes de fichiers | `D` | conteneurs Docker/Podman |
| `b` | octets ↔ bits (réseau) | `F` | espace libre ↔ utilisé |
| `h` | aide | `q` / `Échap` | quitter |
| `/` | nom de processus court ↔ complet | `a` | tri automatique |

### Modes de fonctionnement

```bash
glances -w --bind 127.0.0.1               # interface web http://localhost:61208 + API REST /api/4/
glances -s                                # mode serveur (XML-RPC, port 61209)
glances -c srv-web-01                      # client d'un serveur Glances distant
glances --browser                          # parcourir tous les serveurs Glances du réseau (autodécouverte Zeroconf)
glances --export prometheus                # expose /metrics (port 9091 par défaut, glances.conf)
glances --export influxdb2 --quiet         # export sans interface
glances --stdout cpu.user,mem.percent,load.min1 -t 5
glances --issue                            # diagnostic (pour un rapport de bogue)
curl -s http://localhost:61208/api/4/cpu | jq .
curl -s http://localhost:61208/api/4/all | jq 'keys'        # tous les greffons d'un coup
```

En mode *browser*, un poste centralise l'état de plusieurs serveurs Glances (vue de parc léger, sans base de données).

## Configuration

Seuils, exports et modules dans `~/.config/glances/glances.conf` (ou `/etc/glances/glances.conf`) :

```ini ~/.config/glances/glances.conf
[cpu]
careful=50
warning=70
critical=90

[fs]
careful=50
warning=70
critical=90

[ports]
# Surveillance active d'hôtes (ping / TCP / web)
port_1_host=10.0.0.1
port_1_description=Passerelle
port_2_host=intranet.exemple.fr
port_2_port=443
web_1_url=https://intranet.exemple.fr/health
web_1_rtt_warning=2

[folders]
folder_1_path=/var/log
folder_1_warning=2000000000

[influxdb2]
host=influx.exemple.fr
port=8086
protocol=https
org=exemple
bucket=supervision
token=${INFLUX_TOKEN}

[prometheus]
host=0.0.0.0
port=9091
```

Une **action** peut être déclenchée au franchissement d'un seuil (`[cpu]` → `critical_action=...`), par exemple l'envoi d'un courriel ou un script.

> [!WARNING]
> Le mode web et l'API n'ont pas d'authentification par défaut : écouter sur `127.0.0.1` ou utiliser `--password`, et passer par un tunnel SSH ou un reverse proxy authentifié.

<!-- CAPTURE: Glances — interface web | _assets/glances-web.png -->

Suite : [[02-cockpit|Cockpit]] · [[90-aide-memoire|aide-mémoire]].
