---
title: EdgeRouter (EdgeOS) et UISP
description: Routeurs Ubiquiti EdgeRouter sous EdgeOS (dérivé de Vyatta) — interface web et assistants, CLI en mode configuration (configure, set, delete, commit, save, compare), interfaces et VLAN, DHCP, NAT et règles de pare-feu, routage statique, OSPF et BGP, VPN IPsec et WireGuard, sauvegarde, mise à jour et sécurisation ; plateforme UISP pour les opérateurs et réseaux sans fil (gamme UISP/airMAX), dépannage.
tags: [ubiquiti, edgerouter, edgeos, vyatta, uisp, cli, commit]
icon: router
---

Les **EdgeRouter** (ER-X, ER-4, ER-12…) sont des routeurs Ubiquiti sous **EdgeOS**, système dérivé de **Vyatta** (comme VyOS) : interface web et **CLI à validation** (`commit`), appréciée pour son rapport fonctions/prix. La gamme n'évolue plus beaucoup ; Ubiquiti oriente les nouveaux projets vers les passerelles UniFi ([[01-unifi|UniFi]]) ou la gamme **UISP** (opérateurs).

## Interface web

`https://192.168.1.1` (identifiants par défaut `ubnt`/`ubnt` sur les anciennes versions, à changer) : tableau de bord, **assistants** (*Basic Setup* : WAN + LAN, *Load-Balancing*), *Firewall/NAT*, *Services* (DHCP, DNS, PPPoE), *Routing*, *VPN*, et un onglet **Config Tree** qui reflète exactement l'arborescence de la CLI.

## CLI : mode configuration

```edgeos
configure                                          # entrer en mode configuration
set system host-name ER-AGENCE-01
set system time-zone Europe/Paris
set system ntp server 10.0.10.123
set service ssh port 22
set service ssh listen-address 10.0.99.1
set service gui listen-address 10.0.99.1
set system login user admin authentication plaintext-password MotDePasseAdminTresLong
compare                                            # différences avec la configuration active
commit                                             # appliquer
save                                               # enregistrer pour le redémarrage
exit
```

| Commande | Effet |
| --- | --- |
| `show configuration` | Configuration (en mode opérationnel) |
| `set` / `delete` | Ajouter / supprimer un élément |
| `commit` / `commit-confirm 5` | Appliquer / appliquer avec retour arrière automatique dans 5 minutes sans confirmation |
| `save` | Enregistrer (`/config/config.boot`) |
| `discard` | Abandonner les changements non validés |
| `rollback 1` | Revenir à une révision précédente (avec redémarrage) |
| `run <commande>` | Commande opérationnelle depuis le mode configuration |

## Interfaces, VLAN, DHCP

```edgeos
set interfaces ethernet eth0 description WAN
set interfaces ethernet eth0 address dhcp
set interfaces ethernet eth1 description LAN
set interfaces ethernet eth1 address 10.10.1.1/24
set interfaces ethernet eth1 vif 20 description UTILISATEURS
set interfaces ethernet eth1 vif 20 address 10.10.20.1/24
set service dhcp-server shared-network-name LAN20 subnet 10.10.20.0/24 default-router 10.10.20.1
set service dhcp-server shared-network-name LAN20 subnet 10.10.20.0/24 dns-server 10.0.10.53
set service dhcp-server shared-network-name LAN20 subnet 10.10.20.0/24 start 10.10.20.100 stop 10.10.20.200
```

## NAT et pare-feu

```edgeos
set service nat rule 5010 description "PAT sortant"
set service nat rule 5010 outbound-interface eth0
set service nat rule 5010 type masquerade

set firewall name WAN_IN default-action drop
set firewall name WAN_IN rule 10 action accept
set firewall name WAN_IN rule 10 state established enable
set firewall name WAN_IN rule 10 state related enable
set firewall name WAN_IN rule 20 action drop
set firewall name WAN_IN rule 20 state invalid enable
set firewall name WAN_LOCAL default-action drop
set firewall name WAN_LOCAL rule 10 action accept
set firewall name WAN_LOCAL rule 10 state established enable
set firewall name WAN_LOCAL rule 10 state related enable
set interfaces ethernet eth0 firewall in name WAN_IN
set interfaces ethernet eth0 firewall local name WAN_LOCAL
commit ; save
```

`WAN_IN` filtre le trafic **traversant** le routeur depuis Internet, `WAN_LOCAL` le trafic **destiné au routeur** (administration).

## Routage et VPN

```edgeos
set protocols static route 0.0.0.0/0 next-hop 203.0.113.1
set protocols ospf area 0 network 10.10.0.0/16
set protocols ospf parameters router-id 10.255.0.21

# IPsec site à site (vers un siège)
set vpn ipsec ike-group IKE-SIEGE key-exchange ikev2
set vpn ipsec ike-group IKE-SIEGE proposal 1 encryption aes256
set vpn ipsec ike-group IKE-SIEGE proposal 1 hash sha256
set vpn ipsec ike-group IKE-SIEGE proposal 1 dh-group 19
set vpn ipsec esp-group ESP-SIEGE proposal 1 encryption aes256
set vpn ipsec esp-group ESP-SIEGE proposal 1 hash sha256
set vpn ipsec site-to-site peer 198.51.100.10 authentication mode pre-shared-secret
set vpn ipsec site-to-site peer 198.51.100.10 authentication pre-shared-secret CleTresLongueEtAleatoire
set vpn ipsec site-to-site peer 198.51.100.10 ike-group IKE-SIEGE
set vpn ipsec site-to-site peer 198.51.100.10 local-address 203.0.113.2
set vpn ipsec site-to-site peer 198.51.100.10 tunnel 1 esp-group ESP-SIEGE
set vpn ipsec site-to-site peer 198.51.100.10 tunnel 1 local prefix 10.10.0.0/16
set vpn ipsec site-to-site peer 198.51.100.10 tunnel 1 remote prefix 10.0.0.0/16
```

WireGuard est disponible par paquet tiers selon la version d'EdgeOS.

## Commandes opérationnelles

```edgeos
show interfaces
show ip route
show nat translations
show firewall name WAN_IN statistics
show vpn ipsec sa
show dhcp leases
show log tail
```

## UISP

**UISP** (ex-UNMS) gère les équipements **opérateurs** et sans fil de Ubiquiti (airMAX, airFiber, routeurs UISP, EdgeRouter, ONU fibre) : carte du réseau, supervision, sauvegardes, mises à jour, facturation (UISP CRM) pour les fournisseurs d'accès sans fil. Installation auto-hébergée (Docker) ou cloud.

## Sécurité et dépannage

- [ ] Compte par défaut remplacé, interface web et SSH écoutant seulement sur le LAN ou le VLAN d'administration
- [ ] Pare-feu `WAN_LOCAL` restrictif, micrologiciel à jour (gamme ancienne : vérifier le support)

| Symptôme | Cause | Solution |
| --- | --- | --- |
| Changements perdus au redémarrage | `save` oublié | `commit` puis `save` |
| Perte d'accès après un `commit` | Règle de pare-feu bloquant l'administration | `commit-confirm` lors des changements risqués |
| Débit faible | Délestage matériel (*offload*) désactivé | `set system offload hwnat enable` (ER-X) / `ipv4 forwarding enable` selon le modèle |
