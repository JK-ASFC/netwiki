---
title: NetBird et Nebula — aide-mémoire des commandes
description: Commandes NetBird (netbird up, down, status, routes, service install, debug bundle, ssh) et Nebula (nebula-cert ca, sign, print, verify ; nebula -test ; systemctl ; diagnostic) avec exemples.
tags: [aide-mémoire, netbird, nebula, vpn, mesh]
icon: terminal
---

Explications : [[01-netbird|NetBird]] · [[02-nebula|Nebula]].

## NetBird

```bash
netbird up --management-url https://netbird.corp.exemple.fr
netbird up --setup-key 1A2B3C4D-…
netbird down
netbird status ; netbird status -d          # pairs, connexions directes ou relayées
netbird networks ls                         # réseaux routés disponibles (« routes list » sur les anciennes versions)
netbird service install ; netbird service start
netbird debug bundle --anonymize            # archive de diagnostic pour le support
netbird version
sudo wg show                                # interface wt0 (mode noyau)
```

## Nebula

```bash
nebula-cert ca -name "Corp Nebula CA" -duration 17520h
nebula-cert sign -name "srv-db-01" -ip "10.42.1.20/16" -groups "serveurs,db"
nebula-cert print -path /etc/nebula/srv-db-01.crt
nebula-cert verify -ca /etc/nebula/ca.crt -crt /etc/nebula/srv-db-01.crt
sudo nebula -config /etc/nebula/config.yml -test
sudo systemctl restart nebula ; journalctl -u nebula -f
ip addr show nebula1
```
