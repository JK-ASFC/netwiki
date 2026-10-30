---
title: Routeurs Cisco — aide-mémoire des commandes
description: Commandes des routeurs Cisco ISR/ASR avec exemples — interfaces et sous-interfaces, routage statique, OSPF, EIGRP, BGP (vérifications), NAT/PAT, DHCP, ACL, VPN IPsec (IKEv2), HSRP, QoS, SLA IP et suivi, vérifications et débogages.
tags: [aide-mémoire, cisco, routeur, ospf, bgp, nat, ipsec, hsrp]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-interfaces-routage|interfaces et routage]], [[02-nat-dhcp-acl-vpn|NAT, DHCP, ACL et VPN]] et [[03-qos-haute-dispo-depannage|QoS, haute disponibilité et dépannage]].

## Routage

```cisco
show ip route
show ip route 10.60.0.0 255.255.0.0 longer-prefixes
show ip route summary
show ip cef 10.60.1.10
show ip protocols
show ip ospf neighbor
show ip ospf interface brief
show ip ospf database
show ip eigrp neighbors
show ip bgp summary
show ip bgp neighbors 203.0.113.1 advertised-routes
show ip bgp 198.51.100.0/24
clear ip bgp 203.0.113.1 soft
```

## NAT, DHCP, ACL

```cisco
show ip nat translations
show ip nat statistics
clear ip nat translation *
show ip dhcp binding
show ip dhcp pool
show ip dhcp conflict
show access-lists
show ip access-lists ENTRANT
show ip interface GigabitEthernet0/0/1 | include access list
```

## VPN, haute disponibilité, SLA

```cisco
show crypto ikev2 sa
show crypto ipsec sa peer 198.51.100.20
show crypto session detail
clear crypto session remote 198.51.100.20
show standby brief
show vrrp brief
show ip sla statistics
show track
```

## QoS et interfaces

```cisco
show policy-map interface GigabitEthernet0/0/0
show interfaces GigabitEthernet0/0/0 | include rate|errors|drops
show controllers GigabitEthernet0/0/0
show interfaces counters errors
```

## Tests et débogages

```cisco
ping 10.60.1.10 source Loopback0 repeat 100 size 1400 df-bit
traceroute 10.60.1.10 source Loopback0
debug ip ospf adj
debug crypto ikev2
debug ip nat detailed
terminal monitor
undebug all
```
