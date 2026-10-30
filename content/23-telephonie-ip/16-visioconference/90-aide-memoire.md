---
title: Jitsi Meet et BigBlueButton — aide-mémoire des commandes
description: Commandes Jitsi Meet (services Prosody, Jicofo, JVB, comptes organisateurs prosodyctl, journaux, ports, Docker) et BigBlueButton (bbb-conf : vérification, état, redémarrage, secret, nettoyage ; Greenlight ; enregistrements) avec exemples.
tags: [aide-mémoire, jitsi, bigbluebutton, prosody, jvb, bbb-conf]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-jitsi-bigbluebutton|Jitsi Meet et BigBlueButton]].

## Jitsi Meet

```bash
sudo systemctl status prosody jicofo jitsi-videobridge2 nginx
sudo systemctl restart prosody jicofo jitsi-videobridge2
sudo prosodyctl register organisateur visio.exemple.fr 'MotDePasseLong2026'
sudo prosodyctl deluser organisateur@visio.exemple.fr
sudo prosodyctl passwd organisateur@visio.exemple.fr
sudo prosodyctl check
sudo tail -f /var/log/jitsi/jvb.log /var/log/jitsi/jicofo.log /var/log/prosody/prosody.log
sudo ss -lnup | grep 10000                       # média JVB
curl -s http://127.0.0.1:8080/colibri/stats | jq '{conferences, participants, largest_conference}'
# Docker
cd docker-jitsi-meet && docker compose ps && docker compose logs -f jvb
```

## BigBlueButton

```bash
sudo bbb-conf --check
sudo bbb-conf --status
sudo bbb-conf --restart
sudo bbb-conf --secret
sudo bbb-conf --clean
sudo bbb-record --list
sudo bbb-record --rebuild <id-enregistrement>
docker exec -it greenlight-v3 bundle exec rake 'admin:create[Administrateur,admin@exemple.fr,MotDePasseLong2026]'
sudo tail -f /var/log/bigbluebutton/bbb-web.log
```
