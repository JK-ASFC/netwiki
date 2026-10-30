---
title: Zyxel (pare-feu et commutateurs) — aide-mémoire des commandes
description: Commandes Zyxel avec exemples — pare-feu USG FLEX / ATP sous ZLD (état, interfaces, routes, sessions, politiques, VPN, journaux, sauvegarde de configuration) et commutateurs (VLAN, ports, sauvegarde), Nebula (cloud), précautions de sécurité.
tags: [aide-mémoire, zyxel, usg flex, zld, nebula]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-parefeux-commutateurs-nebula|Zyxel]]. La CLI varie selon le système (ZLD, uOS) : utilisez `?` pour confirmer la syntaxe.

## Pare-feu (ZLD)

```zyxel
show version
show interface all
show ip route
show conn status
show conn ip 10.0.20.15
show secure-policy
show sslvpn status
show isakmp sa
show ipsec sa
show logging entries
show cpu status
show mem status
write
copy running-config startup-config
```

## Commutateurs gérés

```zyxel
show system-information
show running-config
show vlan
show interfaces 12
show mac address-table port 12
write memory
```

## Sécurité

- Interface d'administration jamais exposée sur Internet ; micrologiciel à jour (vulnérabilités critiques exploitées sur les pare-feu Zyxel en 2023–2024).
- Nebula : console cloud pour la gestion centralisée, l'inventaire et les mises à jour planifiées.
