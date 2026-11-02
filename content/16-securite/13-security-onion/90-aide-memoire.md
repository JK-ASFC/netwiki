---
title: Security Onion — aide-mémoire des commandes
description: Commandes Security Onion avec exemples — so-status, so-allow, soup (mise à jour), so-setup, so-elasticsearch-query, so-suricata-restart, so-zeek-restart, salt-call state.highstate, journaux.
tags: [aide-mémoire, security onion]
icon: terminal
---

Explications : [[01-presentation-installation|Security Onion]].

```bash
sudo so-status ; sudo so-allow ; sudo soup
# Utilisateurs : console SOC → Administration → Users
sudo so-suricata-restart ; sudo so-zeek-restart ; sudo so-elasticsearch-query _cat/indices?v | head
sudo salt-call state.highstate             # réappliquer la configuration
sudo tail -f /opt/so/log/sensoroni/sensoroni.log
```
