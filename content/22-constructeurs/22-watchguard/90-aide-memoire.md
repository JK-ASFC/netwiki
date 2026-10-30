---
title: WatchGuard Firebox — aide-mémoire des commandes
description: Commandes WatchGuard Fireware avec exemples — CLI (état du système, interfaces, routes, ARP, ping, traceroute, mode configuration, redémarrage) et correspondance des tâches courantes dans Fireware Web UI, WatchGuard System Manager et WatchGuard Cloud.
tags: [aide-mémoire, watchguard, firebox, fireware, cli]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-firebox-fireware|Firebox et Fireware]].

## CLI (SSH sur le port 4118)

```watchguard
WG#show sysinfo
WG#show interface
WG#show route
WG#show arp
WG#ping 10.0.20.15
WG#traceroute 8.8.8.8
WG#configure
WG(config)#show running-config
WG(config)#exit
WG#reboot
```

```bash
ssh -p 4118 admin@10.0.1.1
```

## Tâches courantes (Fireware Web UI, `https://10.0.1.1:8080`)

| Tâche | Emplacement |
| --- | --- |
| Journal en direct | *System Status → Traffic Monitor* |
| Diagnostic (ping, traceroute, capture TCP dump) | *System Status → Diagnostics* |
| Sauvegarde de la configuration | *System → Backup Image* (ou *Configuration File* dans WSM) |
| Mise à jour de Fireware | *System → Upgrade OS* |
| Tunnels VPN | *System Status → VPN Statistics* |
| Utilisateurs authentifiés | *System Status → Authentication List* |
