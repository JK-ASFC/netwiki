---
title: FortiGate (FortiOS) — aide-mémoire des commandes
description: Commandes FortiGate avec exemples — état système et ressources, interfaces et routes, sessions, debug flow (quelle politique et quel NAT), capture sniffer, VPN IPsec et SSL, haute disponibilité, journaux, sauvegarde et mise à jour, réinitialisation de sessions et redémarrage.
tags: [aide-mémoire, fortigate, fortios, debug flow, sniffer, ha]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-acces-cli-gui|accès et CLI]], [[02-politiques-nat-vpn|politiques, NAT et VPN]] et [[03-ha-diagnostic-depannage|HA et diagnostic]].

```fortios
# État
get system status
get system performance status
diagnose sys top 5 20
get system interface physical
get router info routing-table all
get router info routing-table details 8.8.8.8
get system arp
# Sessions
diagnose sys session filter clear
diagnose sys session filter src 10.0.20.15
diagnose sys session list
diagnose sys session clear
# Quelle politique s'applique ? (debug flow)
diagnose debug reset
diagnose debug flow filter addr 10.0.20.15
diagnose debug flow show function-name enable
diagnose debug console timestamp enable
diagnose debug flow trace start 20
diagnose debug enable
diagnose debug disable
# Capture
diagnose sniffer packet any "host 10.0.20.15 and port 443" 4 50 l
# VPN
get vpn ipsec tunnel summary
diagnose vpn ike gateway list
diagnose vpn tunnel list
diagnose vpn tunnel up TUN-LYON
get vpn ssl monitor
# Haute disponibilité
get system ha status
diagnose sys ha checksum cluster
execute ha manage 1 admin
# Journaux, sauvegarde, mise à jour
execute log filter category 0
execute log display
execute backup config tftp fgt-paris.conf 10.0.99.30
execute restore image tftp FGT_100F-v7.4.5.out 10.0.99.30
execute reboot
```
