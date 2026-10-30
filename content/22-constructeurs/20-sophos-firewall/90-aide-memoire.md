---
title: Sophos Firewall — aide-mémoire des commandes
description: Commandes Sophos Firewall (SFOS) avec exemples — menu de la console, Device Console (diagnostics système, ping, traceroute, haute disponibilité, tcpdump, drop-packet-capture), shell avancé (connexions, services), sauvegardes et firmware.
tags: [aide-mémoire, sophos, sfos, drop-packet-capture, console]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-sophos-firewall|Sophos Firewall]].

## Device Console (option 4 du menu)

```sophos
system diagnostics show cpu
system diagnostics show memory
system diagnostics utilities ping 8.8.8.8
system diagnostics utilities traceroute 8.8.8.8
system ha show details
show advanced-firewall
tcpdump 'host 10.0.20.15 and port 443'
drop-packet-capture 'host 10.0.20.15'
```

## Shell avancé (option 5 → Advanced Shell)

```bash
conntrack -L | grep 10.0.20.15 | head
service -S | head
tail -f /log/networkd.log
```

## Sauvegarde et firmware

| Tâche | Interface web |
| --- | --- |
| Sauvegarde planifiée chiffrée | *Backup & firmware → Backup & restore* |
| Firmware (deux emplacements, retour possible) | *Backup & firmware → Firmware* |
| Correctifs à chaud | *Backup & firmware → Firmware → Hotfix* (laisser automatique) |
| Journal en direct | *Diagnostics → Log viewer* |
| Capture | *Diagnostics → Packet capture* |
