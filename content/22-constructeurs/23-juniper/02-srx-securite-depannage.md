---
title: Pare-feu SRX — zones, politiques, NAT, VPN et cluster
description: Configurer un pare-feu Juniper SRX sous Junos — zones de sécurité et host-inbound-traffic, carnets d'adresses, politiques de sécurité (from-zone/to-zone, global), applications et AppSecure, NAT source (interface, pool), destination et statique, VPN IPsec routé (st0, IKEv2), accès distant (Juniper Secure Connect), chassis cluster (haute disponibilité), journaux de sécurité, et dépannage (flow traceoptions, show security flow session, match-policies).
tags: [juniper, srx, junos, zones, politiques, nat, ipsec, chassis cluster]
icon: shield
---

Les **SRX** (SRX300 à SRX5000, vSRX, cSRX) appliquent les principes de Junos ([[01-junos-cli-commutation|CLI, commit, rollback]]) à la sécurité : par défaut, en mode *flow*, **tout trafic entre zones est refusé** tant qu'une politique ne l'autorise pas.

## Zones de sécurité

```junos
set security zones security-zone trust interfaces ge-0/0/1.0
set security zones security-zone untrust interfaces ge-0/0/0.0 host-inbound-traffic system-services ike
set security zones security-zone trust host-inbound-traffic system-services ping
set security zones security-zone trust host-inbound-traffic system-services ssh
set security zones security-zone dmz interfaces ge-0/0/2.0
set interfaces ge-0/0/0 unit 0 family inet address 203.0.113.2/29
set interfaces ge-0/0/1 unit 0 family inet address 10.0.20.254/24
set routing-options static route 0.0.0.0/0 next-hop 203.0.113.1
```

**`host-inbound-traffic`** définit ce qui peut atteindre le SRX lui-même dans chaque zone (SSH, ping, IKE, DHCP, protocoles de routage) : ne rien ouvrir côté `untrust` hormis IKE si nécessaire.

## Politiques de sécurité

```junos
set security address-book global address NET-LAN 10.0.20.0/24
set security address-book global address SRV-WEB 10.0.30.10/32
set security policies from-zone trust to-zone untrust policy LAN-INTERNET match source-address NET-LAN destination-address any application [ junos-http junos-https junos-dns-udp ]
set security policies from-zone trust to-zone untrust policy LAN-INTERNET then permit
set security policies from-zone trust to-zone untrust policy LAN-INTERNET then log session-close
set security policies from-zone untrust to-zone dmz policy PUBLICATION-WEB match source-address any destination-address SRV-WEB application junos-https
set security policies from-zone untrust to-zone dmz policy PUBLICATION-WEB then permit
insert security policies from-zone trust to-zone untrust policy LAN-INTERNET before policy AUTRE-REGLE
commit
```

| Notion | Explication |
| --- | --- |
| Contexte `from-zone`/`to-zone` | Les politiques sont évaluées par paire de zones, première correspondance |
| Politiques `global` | S'appliquent à toutes les zones, après les politiques de contexte |
| Applications | Prédéfinies `junos-*` ou personnalisées ; **AppSecure** (AppID) pour l'identification applicative, `dynamic-application` |
| Services avancés | IPS, Content Security (ex-UTM : antivirus, filtrage web), **ATP Cloud** (bac à sable), SecIntel |

## NAT

```junos
# NAT source sur l'adresse de l'interface
set security nat source rule-set SORTIE from zone trust
set security nat source rule-set SORTIE to zone untrust
set security nat source rule-set SORTIE rule TOUT match source-address 10.0.0.0/8
set security nat source rule-set SORTIE rule TOUT then source-nat interface
# NAT destination (publication)
set security nat destination pool WEB address 10.0.30.10/32 port 443
set security nat destination rule-set ENTREE from zone untrust
set security nat destination rule-set ENTREE rule HTTPS match destination-address 203.0.113.5/32 destination-port 443
set security nat destination rule-set ENTREE rule HTTPS then destination-nat pool WEB
set security nat proxy-arp interface ge-0/0/0.0 address 203.0.113.5/32
commit
```

La NAT de destination est appliquée **avant** la recherche de politique : la politique de sécurité utilise donc l'adresse **privée** (`SRV-WEB`). Le **proxy-ARP** est nécessaire quand l'adresse publique n'est pas celle de l'interface.

## VPN IPsec routé

```junos
set interfaces st0 unit 0 family inet
set security zones security-zone vpn interfaces st0.0
set security ike proposal IKE-P authentication-method pre-shared-keys dh-group group20 authentication-algorithm sha-384 encryption-algorithm aes-256-cbc
set security ike policy IKE-POL proposals IKE-P pre-shared-key ascii-text "CleLongueEtAleatoire2026"
set security ike gateway GW-LYON ike-policy IKE-POL address 198.51.100.20 external-interface ge-0/0/0.0 version v2-only
set security ipsec proposal IPSEC-P protocol esp encryption-algorithm aes-256-gcm
set security ipsec policy IPSEC-POL proposals IPSEC-P perfect-forward-secrecy keys group20
set security ipsec vpn VPN-LYON bind-interface st0.0 ike gateway GW-LYON ipsec-policy IPSEC-POL establish-tunnels immediately
set routing-options static route 10.60.0.0/16 next-hop st0.0
commit
```

Ajouter les politiques `trust` ↔ `vpn`. L'accès distant se fait avec **Juniper Secure Connect** (client IPsec/TLS).

## Chassis cluster

Deux SRX identiques forment un **chassis cluster** (actif/passif ou actif/actif) : liens de contrôle et de *fabric* dédiés, *redundancy groups* (RG0 pour le plan de contrôle, RG1+ pour les interfaces `reth`).

```junos
# en mode opérationnel, sur chaque nœud (node 0 puis node 1 sur le second)
set chassis cluster cluster-id 1 node 0 reboot
show chassis cluster status
show chassis cluster interfaces
request chassis cluster failover redundancy-group 1 node 1
```

## Dépannage

```junos
show security flow session source-prefix 10.0.20.15
show security policies hit-count
show security match-policies from-zone trust to-zone untrust source-ip 10.0.20.15 destination-ip 8.8.8.8 source-port 50000 destination-port 443 protocol tcp
show security nat source rule all
show security nat destination summary
show security ike security-associations
show security ipsec security-associations
show security ipsec statistics
show log messages | match RT_FLOW
```

Pour un suivi détaillé du traitement des paquets (à limiter dans le temps) :

```junos
set security flow traceoptions file flow-debug size 10m files 2
set security flow traceoptions flag basic-datapath
set security flow traceoptions packet-filter PF1 source-prefix 10.0.20.15/32
commit
run show log flow-debug | match "drop|policy"
delete security flow traceoptions
commit
```

| Symptôme | Cause | Solution |
| --- | --- | --- |
| Ping vers l'interface du SRX refusé | `host-inbound-traffic` absent | Ajouter le service dans la zone |
| Publication sans effet | Politique écrite avec l'adresse publique, proxy-ARP manquant | Adresse privée dans la politique, `proxy-arp` |
| Tunnel établi, pas de trafic | Route vers `st0.0` ou politique `vpn` manquante | `show route`, `match-policies` |
| Sessions asymétriques rejetées | Routage asymétrique (retour par un autre chemin) | Corriger le routage, cluster actif/passif |
