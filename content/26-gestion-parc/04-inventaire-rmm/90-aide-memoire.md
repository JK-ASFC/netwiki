---
title: Inventaire et RMM — aide-mémoire
description: Repères Open-AudIT (URL, identifiants de découverte, scripts d'audit), Tactical RMM (script d'installation, sous-domaines), OpenRPort (rportd, rport, fichiers de configuration) et Remotely (Docker Compose).
tags: [aide-mémoire, open-audit, tactical rmm, rport, remotely]
icon: terminal
---

Explications : [[01-open-audit-tactical-rport-remotely|Open-AudIT, Tactical RMM, RPort et Remotely]].

```bash
# Open-AudIT : http://audit.corp.exemple.fr/open-audit ; identifiants SNMP / SSH / WMI puis Découverte d'un sous-réseau
wget https://raw.githubusercontent.com/amidaware/tacticalrmm/master/install.sh && chmod +x install.sh && ./install.sh
sudo systemctl status rportd ; sudo nano /etc/rport/rportd.conf ; sudo systemctl restart rportd
sudo systemctl status rport ; sudo nano /etc/rport/rport.conf
wget -q https://raw.githubusercontent.com/immense/Remotely/master/docker-compose/docker-compose.yml && docker compose up -d
```
