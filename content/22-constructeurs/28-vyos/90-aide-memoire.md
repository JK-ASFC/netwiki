---
title: VyOS — aide-mémoire des commandes
description: Commandes VyOS avec exemples — mode opérationnel (show interfaces, ip route, bgp summary, ospf neighbor, nat translations, firewall, vrrp, log, version, system image), mode configuration (configure, set, delete, compare, commit, commit-confirm, save, load, rollback, discard), images (add, delete, set default), diagnostic (ping, traceroute, monitor traffic), API.
tags: [aide-mémoire, vyos, routeur, cli]
icon: terminal
---

Référence rapide ; explications dans [[01-presentation-configuration|VyOS]].

## Mode opérationnel

```text
show version
show interfaces
show interfaces ethernet eth0 brief
show ip route
show ip bgp summary
show ip ospf neighbor
show nat source translations
show firewall
show vrrp
show log tail 50
show system image
show configuration commands
ping 10.0.10.53 count 4
traceroute 9.9.9.9
monitor traffic interface eth0 filter "port 53"
reset ip bgp 203.0.113.1
add system image https://…/vyos-rolling-latest.iso
set system image default-boot <version>
delete system image <ancienne-version>
```

## Mode configuration

```text
configure
set interfaces ethernet eth2 address dhcp
delete interfaces ethernet eth2 address dhcp
edit protocols bgp                 # se placer dans une branche ; « top » pour revenir
compare
commit
commit-confirm 5 ; confirm
discard                            # annuler les modifications non validées
rollback 1                         # revenir à la révision précédente (redémarrage)
save ; save /config/sauvegarde-2026-11-02.boot
load /config/sauvegarde-2026-11-02.boot
run show interfaces                # commande opérationnelle depuis le mode configuration
exit discard
```
