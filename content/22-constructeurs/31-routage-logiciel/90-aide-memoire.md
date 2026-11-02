---
title: FRR, BIRD et OpenBGPD — aide-mémoire des commandes
description: Commandes de routage logiciel avec exemples — FRR (vtysh, show ip bgp summary, neighbors advertised-routes, ip ospf neighbor, ip route, bfd peers, clear bgp, write memory, frr-reload), BIRD (birdc show protocols, show route, configure check, configure, enable/disable) et OpenBGPD (bgpd -n, bgpctl show summary, rib, reload, neighbor clear), avec tableau d'équivalences.
tags: [aide-mémoire, frr, bird, openbgpd, bgp, ospf]
icon: terminal
---

Explications : [[01-frrouting|FRR]] · [[02-bird|BIRD]] · [[03-openbgpd|OpenBGPD]].

| Besoin | FRR (`vtysh -c`) | BIRD (`birdc`) | OpenBGPD (`bgpctl`) |
| --- | --- | --- | --- |
| État des sessions | `show ip bgp summary` | `show protocols` | `show summary` |
| Détail d'un voisin | `show ip bgp neighbors 203.0.113.1` | `show protocols all transit_operateur` | `show neighbor 203.0.113.1` |
| Route vers une adresse | `show ip route 9.9.9.9` | `show route for 9.9.9.9 all` | `show rib 9.9.9.9` |
| Routes annoncées | `show ip bgp neighbors 203.0.113.1 advertised-routes` | `show route export transit_operateur` | `show rib out` |
| Recharger la configuration | `frr-reload.py --reload /etc/frr/frr.conf` | `configure` | `reload` |
| Vérifier la syntaxe | `frr-reload.py --test /etc/frr/frr.conf` | `configure check` | `bgpd -n` |
| Réinitialiser une session | `clear ip bgp 203.0.113.1 soft` | `restart transit_operateur` | `neighbor 203.0.113.1 clear` |

## FRR

```bash
sudo vtysh -c 'show ip bgp summary'
sudo vtysh -c 'show ip ospf neighbor'
sudo vtysh -c 'show bfd peers'
sudo vtysh -c 'show ip route bgp'
sudo vtysh -c 'write memory'
sudo /usr/lib/frr/frr-reload.py --reload /etc/frr/frr.conf
sudo systemctl status frr ; journalctl -u frr -f
```

## BIRD

```bash
sudo birdc show status ; sudo birdc show protocols
sudo birdc show route count ; sudo birdc show route protocol transit_operateur
sudo birdc configure check && sudo birdc configure
sudo birdc show ospf neighbors
```

## OpenBGPD

```bash
bgpd -n && bgpctl reload
bgpctl show summary ; bgpctl show rib 9.9.9.9
bgpctl show rib neighbor 203.0.113.1 in
bgpctl neighbor 203.0.113.1 down ; bgpctl neighbor 203.0.113.1 up
```
