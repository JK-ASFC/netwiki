---
title: Glances et Cockpit — aide-mémoire des commandes
description: Commandes Glances (glances, -w, -s, -c, --export, --stdout, --disable-plugin, -1, --percpu, API REST) et Cockpit (systemctl cockpit.socket, ports, certificats, configuration cockpit.conf, disallowed-users, modules, journaux) avec exemples.
tags: [aide-mémoire, glances, cockpit]
icon: terminal
---

Explications : [[01-glances|Glances]] · [[02-cockpit|Cockpit]].

```bash
glances ; glances -1 ; glances --disable-plugin sensors,raid ; glances -w --bind 127.0.0.1 ; glances -s ; glances -c srv-web-01
glances --export influxdb2 ; glances --stdout-csv now,cpu.user,mem.percent > charge.csv ; curl -s localhost:61208/api/4/pluginslist
sudo systemctl status cockpit.socket ; sudo systemctl restart cockpit ; sudo journalctl -u cockpit -f
sudo ls /etc/cockpit/ws-certs.d/ ; sudo remotectl certificate                # certificat utilisé
printf '[WebService]\nOrigins = https://cockpit.corp.exemple.fr\nLoginTitle = srv-web-01\n' | sudo tee /etc/cockpit/cockpit.conf
dnf list 'cockpit-*' ; apt search '^cockpit-'
```
