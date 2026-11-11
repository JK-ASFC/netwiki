---
title: Domotique — aide-mémoire
description: Ports, volumes et commandes de Home Assistant (Docker, hass --script check_config, sauvegardes), openHAB (Docker, openhab-cli) et Domoticz (Docker), et points de sécurité.
tags: [aide-mémoire, home assistant, openhab, domoticz, domotique]
icon: terminal
---

Explications : [[01-home-assistant-openhab-domoticz|Home Assistant, openHAB et Domoticz]].

| Plate-forme | Port | Configuration |
| --- | --- | --- |
| Home Assistant | 8123 | `/config` |
| openHAB | 8080 (8443 HTTPS), 8101 console | `/openhab/conf`, `userdata` |
| Domoticz | 8080 (6144 interne) | `/config` |

```bash
# Home Assistant
docker run -d --name homeassistant --restart unless-stopped -e TZ=Europe/Paris \
  -v /srv/homeassistant:/config --network host ghcr.io/home-assistant/home-assistant:stable
docker exec homeassistant python -m homeassistant --script check_config -c /config
# OS/Supervised : ha backups new ; ha backups list

# openHAB
docker run -d --name openhab -v /srv/openhab/conf:/openhab/conf -v /srv/openhab/userdata:/openhab/userdata \
  -v /srv/openhab/addons:/openhab/addons --network host openhab/openhab:latest
docker exec -it openhab /openhab/runtime/bin/client     # console Karaf

# Domoticz
docker run -d -p 8080:8080 -v /srv/domoticz:/config domoticz/domoticz:stable

# Sauvegarde (mode conteneur) : archiver le volume de config à froid
tar czf /sauvegardes/ha-$(date +%F).tgz -C /srv/homeassistant .
```
