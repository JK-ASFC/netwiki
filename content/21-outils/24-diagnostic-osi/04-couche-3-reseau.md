---
title: Couche 3 — Réseau
description: Diagnostic de la couche réseau OSI — adressage IPv4/IPv6 et plages privées RFC 1918, ICMP (ping, tracert), passerelle par défaut et routage statique, protocoles de routage dynamique (OSPF, EIGRP, BGP, RIP), redondance de passerelle (VRRP, HSRP, CARP), NAT/PAT, VPN de niveau IP ; symptômes (pas d'Internet alors que le local fonctionne, VPN monté mais ressources inaccessibles, lenteurs vers un site distant) et commandes.
tags: [osi, couche réseau, ip, routage, ospf, bgp, vrrp, nat, vpn, icmp, diagnostic]
icon: layers
---

**Rôle** : acheminer les **paquets** d'un réseau à un autre grâce à l'**adressage IP logique** et au **routage**. Côté infrastructure : plan d'adressage et sous-réseautage, passerelles redondantes (VRRP/HSRP), routage statique et dynamique (OSPF/BGP), tunnels VPN site-à-site, plages RFC 1918.

## Technologies et protocoles

| Techno | Points clés |
| --- | --- |
| **IPv4 / IPv6** | IPv4 32 bits (`192.168.10.20/24`), privées RFC 1918 : `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`. IPv6 128 bits (`2001:db8::1/64`), pas de NAT. APIPA = `169.254.0.0/16` |
| **ICMP** | Socle de `ping` (Echo Request/Reply) et `tracert` (TTL dépassé → Time Exceeded) ; signale aussi les erreurs IP |
| **Passerelle & route statique** | Sortie vers les autres réseaux ; sans elle, communication limitée au sous-réseau. Distance administrative : directe = 0, statique = 1, OSPF = 110, RIP = 120 |
| **Routage dynamique** | **OSPF** (Link State, le plus courant), **EIGRP** (Cisco), **BGP** (Internet, inter-AS), **RIP** (ancien, ≤ 15 sauts, à éviter) |
| **Redondance de passerelle** | **HSRP** (Cisco), **VRRP** (standard RFC 5798), **CARP** (BSD/pfSense) : IP virtuelle partagée actif/standby, bascule transparente |
| **NAT / PAT** | SNAT (sortie), DNAT (redirection de ports), PAT (plusieurs machines sur une IP publique), CGN chez les FAI |
| **VPN (niveau IP)** | IPsec, IKEv2, WireGuard injectent des routes ; conflit fréquent : chevauchement de plans d'adressage entre deux sites |

## Symptômes → action

| Symptôme | Cause | Action |
| --- | --- | --- |
| **Collègues OK mais pas Internet ni serveurs** | Passerelle manquante ou route cassée | Vérifier IP + passerelle, pinguer passerelle puis extérieur |
| **VPN monté mais ressources inaccessibles** | Conflit de sous-réseau ou *split-tunnel* mal configuré | Comparer les plages des deux côtés |
| **Lenteurs / pertes vers un site distant** | Un saut intermédiaire perd des paquets | Localiser le saut fautif |

```bash
ipconfig /all          # IP + passerelle présentes ? (Windows)
ping <passerelle>      # local OK ?
ping 8.8.8.8           # au-delà OK ?
tracert <hôte>         # où ça bloque (Windows) ; traceroute sous Linux
route print            # table de routage (Windows) ; ip route sous Linux
pathping <hôte>        # localise le saut fautif avec statistiques de perte
```

> [!NOTE]
> Passerelle qui répond mais pas l'extérieur → problème de **routage amont**, à remonter à l'équipe réseau.

> [!WARNING]
> Piège fréquent : `192.168.1.0/24` des **deux** côtés d'un tunnel VPN = chevauchement classique → ambiguïté de routage. À résoudre par re-adressage d'un site ou NAT sur le tunnel. Voir [[08-acces-distant-vpn/04-strongswan/03-site-a-site|VPN site-à-site]].

Suite : [[05-couche-4-transport|Couche 4 — Transport]]. Commandes : [[90-aide-memoire|aide-mémoire]].
