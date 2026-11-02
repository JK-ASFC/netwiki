---
title: OpenWISP
description: OpenWISP — plateforme libre de gestion centralisée d'un parc OpenWrt (et d'autres équipements) : contrôleur Django, agent openwisp-config, modèles de configuration et variables, VPN de gestion (OpenVPN, WireGuard, ZeroTier), supervision (openwisp-monitoring, ping, métriques, alertes), topologie, RADIUS et portail captif (openwisp-radius), IPAM, mises à jour de micrologiciel, installation Docker (docker-openwisp) ou Ansible (ansible-openwisp2), API REST.
tags: [openwisp, openwrt, gestion centralisée, wi-fi, supervision, radius, contrôleur]
icon: server
---

**OpenWISP** (BSD/GPL) est un **contrôleur** libre pour gérer des dizaines à des milliers d'équipements [[01-openwrt|OpenWrt]] : on décrit la configuration une fois (**modèles**), chaque appareil la récupère via un agent, et la plateforme supervise l'ensemble. Usage typique : Wi-Fi d'un réseau de sites, de collectivités, d'un campus ou d'un opérateur.

| Module | Rôle |
| --- | --- |
| **Controller** | Inventaire, modèles de configuration, variables, VPN de gestion, enregistrement automatique |
| **Monitoring** | Vérifications (ping, configuration appliquée), métriques (trafic, clients Wi-Fi, CPU, RAM), alertes |
| **Network Topology** | Carte de topologie (OLSR, BATMAN, OpenVPN, WireGuard) |
| **RADIUS** | Utilisateurs, inscription, portail captif, comptabilisation ([[01-freeradius/01-presentation\|FreeRADIUS]]) |
| **Firmware Upgrader** | Mises à jour de micrologiciel en masse |
| IPAM, Notifications | Plans d'adressage, notifications web et e-mail |

## Installation (Docker)

```bash
git clone https://github.com/openwisp/docker-openwisp.git && cd docker-openwisp
cp .env.example .env 2>/dev/null; sudoedit .env    # DASHBOARD_DOMAIN, API_DOMAIN, EMAIL_DJANGO_DEFAULT, DJANGO_SECRET_KEY, mots de passe
docker compose up -d
```

Interface sur `https://<DASHBOARD_DOMAIN>` (compte `admin` à changer immédiatement). Production plus classique : rôle **Ansible** `openwisp.openwisp2` sur Debian/Ubuntu (PostgreSQL, Redis, Nginx, Celery).

## Raccorder un équipement OpenWrt

```bash
# sur l'équipement OpenWrt
opkg update && opkg install openwisp-config openwisp-monitoring   # ou apk add …
uci set openwisp.http.url='https://openwisp.corp.exemple.fr'
uci set openwisp.http.shared_secret='<secret-d-organisation>'      # Organisations → Shared secret
uci set openwisp.http.verify_ssl='1'
uci commit openwisp && service openwisp-config restart
```

L'appareil s'enregistre automatiquement dans l'organisation et récupère les **modèles** par défaut.

## Modèles et variables

- **Modèle** (JSON NetJSON ou formulaire) : SSID, chiffrement, VLAN, NTP, serveurs syslog, règles de pare-feu.
- **Variables** : `{{ ssid_invites }}`, `{{ vlan_site }}` définies par organisation, groupe ou appareil.
- **VPN de gestion** : modèle de type VPN (OpenVPN, WireGuard, VXLAN sur WireGuard, ZeroTier) attribuant à chaque appareil une adresse de gestion joignable par le contrôleur.
- Groupes d'appareils pour cibler un site ou un modèle matériel.

## API

```bash
curl -s -H "Authorization: Bearer $JETON" https://api.openwisp.corp.exemple.fr/api/v1/controller/device/ | jq '.results[] | {name, mac_address, config: .config.status}'
```

Interface : [[03-interface-graphique|interfaces graphiques]] · commandes : [[90-aide-memoire|aide-mémoire]].
