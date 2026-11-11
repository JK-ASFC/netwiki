---
title: Panneaux d'hébergement — aide-mémoire
description: Installation et ports des panneaux HestiaCP, CyberPanel, ISPConfig et Virtualmin GPL, et commandes CLI utiles (HestiaCP v-*, Virtualmin).
tags: [aide-mémoire, hestiacp, cyberpanel, ispconfig, virtualmin, hébergement]
icon: terminal
---

Explications : [[01-hestiacp-cyberpanel-ispconfig-virtualmin|HestiaCP, CyberPanel, ISPConfig et Virtualmin GPL]].

| Panneau | Port interface | Serveur web |
| --- | --- | --- |
| HestiaCP | 8083 | Nginx + Apache/PHP-FPM |
| CyberPanel | 8090 | OpenLiteSpeed |
| ISPConfig | 8080 | Apache ou Nginx |
| Virtualmin | 10000 (Webmin) | Apache ou Nginx |

```bash
# HestiaCP
sudo bash hst-install.sh --email admin@exemple.fr --hostname srv.exemple.fr
sudo v-list-users ; sudo v-add-domain utilisateur domaine.fr ; sudo v-add-letsencrypt-domain utilisateur domaine.fr

# CyberPanel
sh <(curl -sS https://cyberpanel.net/install.sh)

# ISPConfig
wget -O - https://get.ispconfig.org | sh

# Virtualmin GPL
sudo sh virtualmin-install.sh --bundle LAMP
virtualmin list-domains ; virtualmin create-domain --domain exemple.fr --dir --web --mail
```

> Installer sur un **serveur neuf dédié** ; changer les comptes par défaut ; HTTPS et accès restreint à l'interface.
