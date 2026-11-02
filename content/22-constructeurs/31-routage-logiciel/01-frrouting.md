---
title: FRRouting (FRR)
description: FRRouting — suite de routage libre (fork de Quagga, Linux Foundation) : démons bgpd, ospfd, ospf6d, isisd, bfdd, pimd, vrrpd, ldpd, staticd, zebra, installation Debian/Ubuntu (dépôt deb.frrouting.org), RHEL (rpm.frrouting.org), Alpine, FreeBSD, Docker, fichier daemons, vtysh et frr.conf, configuration BGP (voisins, préfixes annoncés, route-maps, prefix-lists, communautés), OSPF, BFD, VRF, EVPN/VXLAN, intégration avec Linux (noyau, ECMP), supervision et dépannage.
tags: [frr, frrouting, bgp, ospf, is-is, bfd, evpn, vtysh, routage, linux]
icon: info
---

**FRRouting** (FRR, GPL) apporte les protocoles de routage dynamique à **Linux** (et BSD) avec une CLI **vtysh** proche de Cisco IOS. On le retrouve dans [[28-vyos/01-presentation-configuration|VyOS]], SONiC, Cumulus, les clusters Kubernetes (MetalLB, Calico), les serveurs d'*anycast* DNS et les routeurs virtuels de datacenter.

| Démon | Protocole |
| --- | --- |
| `zebra` | Interface avec le noyau (routes, interfaces) — toujours actif |
| `staticd` | Routes statiques |
| **`bgpd`** | BGP-4, MP-BGP (IPv6, VPNv4, EVPN), RPKI |
| **`ospfd` / `ospf6d`** | OSPFv2 / OSPFv3 |
| `isisd` | IS-IS |
| `bfdd` | Détection rapide de panne |
| `pimd`, `vrrpd`, `ldpd`, `ripd`, `babeld`, `pathd` | Multicast, VRRP, MPLS LDP, RIP, Babel, segment routing |

## Installation

```bash
# Debian/Ubuntu — dépôt officiel (version stable la plus récente)
curl -s https://deb.frrouting.org/frr/keys.gpg | sudo tee /usr/share/keyrings/frrouting.gpg >/dev/null
echo "deb [signed-by=/usr/share/keyrings/frrouting.gpg] https://deb.frrouting.org/frr $(lsb_release -sc) frr-stable" | sudo tee /etc/apt/sources.list.d/frr.list
sudo apt update && sudo apt install frr frr-pythontools
# Paquet de la distribution (plus ancien) : sudo apt install frr
```

```bash
sudo dnf install frr                       # RHEL/Rocky/Alma (AppStream) ; dépôt rpm.frrouting.org pour les versions récentes
sudo apk add frr && sudo rc-update add frr # Alpine
sudo pkg install frr10                     # FreeBSD (nom du port selon la version)
docker run -d --name frr --net=host --privileged -v ./frr:/etc/frr quay.io/frrouting/frr:10.2.1
```

Activer les démons voulus dans `/etc/frr/daemons`, puis :

```bash
sudo sed -i 's/^bgpd=no/bgpd=yes/; s/^ospfd=no/ospfd=yes/; s/^bfdd=no/bfdd=yes/' /etc/frr/daemons
sudo systemctl restart frr
echo 'net.ipv4.ip_forward=1' | sudo tee /etc/sysctl.d/90-routage.conf && sudo sysctl --system
```

## vtysh et configuration

La configuration intégrée est `/etc/frr/frr.conf`, éditée à la main ou via `vtysh` (`write memory` l'enregistre).

```text
sudo vtysh
configure terminal
 router bgp 65001
  bgp router-id 10.0.255.1
  no bgp ebgp-requires-policy
  neighbor 203.0.113.1 remote-as 64500
  neighbor 203.0.113.1 description Transit-Operateur
  neighbor 203.0.113.1 bfd
  neighbor 10.0.255.2 remote-as 65001
  neighbor 10.0.255.2 update-source lo
  address-family ipv4 unicast
   network 198.51.100.0/24
   neighbor 203.0.113.1 route-map SORTIE-TRANSIT out
   neighbor 203.0.113.1 prefix-list ENTREE-TRANSIT in
   neighbor 10.0.255.2 next-hop-self
  exit-address-family
 !
 ip prefix-list ANNONCES seq 10 permit 198.51.100.0/24
 ip prefix-list ENTREE-TRANSIT seq 10 permit 0.0.0.0/0
 route-map SORTIE-TRANSIT permit 10
  match ip address prefix-list ANNONCES
 !
 router ospf
  ospf router-id 10.0.255.1
  network 10.0.20.0/24 area 0
  passive-interface default
  no passive-interface eth1
 !
end
write memory
```

> [!TIP]
> Depuis FRR 8, les sessions eBGP n'échangent **aucune** route sans politique d'entrée et de sortie (`bgp ebgp-requires-policy`, RFC 8212). Écrivez des route-maps plutôt que de désactiver ce garde-fou en production.

Annoncer `198.51.100.0/24` impose que la route existe dans la table (statique vers `blackhole` ou interface). Exemple : `ip route 198.51.100.0/24 blackhole`.

## EVPN/VXLAN et VRF

FRR pilote les VXLAN du noyau Linux pour construire une fabrique **EVPN** (`address-family l2vpn evpn`, `advertise-all-vni`), et gère les VRF Linux (`vrf CLIENTS` + `router bgp 65001 vrf CLIENTS`).

## Dépannage

```text
show ip bgp summary
show bgp ipv4 unicast neighbors 203.0.113.1 advertised-routes
show ip ospf neighbor
show ip route
show bfd peers
show running-config
debug bgp updates ; no debug bgp updates
```

Journaux : `journalctl -u frr`, ou `log syslog informational` dans `frr.conf`. Comparaison : [[02-bird|BIRD]] · [[03-openbgpd|OpenBGPD]] · [[90-aide-memoire|aide-mémoire]].
