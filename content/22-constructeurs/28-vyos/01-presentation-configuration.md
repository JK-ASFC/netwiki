---
title: Présentation, installation et configuration
description: VyOS — système d'exploitation de routeur et pare-feu open source (Debian, FRR), versions rolling et LTS (Sagitta, Circinus) et images d'abonnement, installation (ISO, VM, cloud), CLI en mode configuration (set, delete, commit, commit-confirm, compare, save, rollback), interfaces et VLAN, SSH, NAT source et destination, pare-feu (zones, groupes), DHCP et DNS, routage statique, OSPF et BGP, VPN WireGuard et IPsec, VRRP, API HTTP et automatisation (Ansible).
tags: [vyos, routeur logiciel, pare-feu, bgp, ospf, wireguard, ipsec, vrrp, cli]
icon: router
---

**VyOS** (GPL) est un **routeur logiciel** complet, héritier de Vyatta, avec une CLI unifiée proche de **Junos** ([[23-juniper/01-junos-cli-commutation|Juniper]]) : toute la configuration tient dans une arborescence modifiée par `set` puis appliquée par `commit`. Il tourne sur matériel x86, en VM (KVM, VMware, Hyper-V, Proxmox) et dans les clouds.

| Branche | Accès |
| --- | --- |
| **Rolling** (*current*) | Images quotidiennes gratuites (dernières fonctions, moins testées) |
| LTS 1.4 *Sagitta*, 1.5 *Circinus* | Images stables pour abonnés ; code source libre (reconstructible), images gratuites pour certains usages (non lucratif, éducation) |

## Installation

Démarrer l'ISO (compte `vyos` / `vyos`), puis `install image` (disque, mot de passe) et redémarrer.

## Principes de la CLI

```text
configure                      # mode configuration (invite #)
set interfaces ethernet eth0 address 203.0.113.2/29
set interfaces ethernet eth0 description WAN
set interfaces ethernet eth1 address 10.0.20.1/24
set interfaces ethernet eth1 vif 30 address 10.0.30.1/24        # sous-interface VLAN 30
set protocols static route 0.0.0.0/0 next-hop 203.0.113.1
set system host-name rtr-vyos-01
set system name-server 10.0.10.53
set service ssh port 22
set service ssh listen-address 10.0.20.1
compare                        # différences avant validation
commit-confirm 5               # appliquer ; retour arrière automatique dans 5 min sans « confirm »
confirm
save                           # écrire dans /config/config.boot
exit
show configuration commands | match ssh
```

## NAT et pare-feu

```text
set nat source rule 100 outbound-interface name eth0
set nat source rule 100 source address 10.0.0.0/8
set nat source rule 100 translation address masquerade
set nat destination rule 10 inbound-interface name eth0
set nat destination rule 10 destination port 443
set nat destination rule 10 protocol tcp
set nat destination rule 10 translation address 10.0.20.10

set firewall group network-group RESEAUX-INTERNES network 10.0.0.0/8
set firewall ipv4 input filter default-action drop
set firewall ipv4 input filter rule 10 action accept
set firewall ipv4 input filter rule 10 state established
set firewall ipv4 input filter rule 10 state related
set firewall ipv4 input filter rule 20 action accept
set firewall ipv4 input filter rule 20 source group network-group RESEAUX-INTERNES
set firewall ipv4 input filter rule 20 destination port 22
set firewall ipv4 input filter rule 20 protocol tcp
```

(Syntaxe du pare-feu de VyOS 1.4 et suivantes : chaînes `input`, `forward`, `output` ; les versions 1.3 utilisaient des jeux de règles nommés attachés aux interfaces.)

## Routage dynamique

```text
set protocols ospf area 0 network 10.0.20.0/24
set protocols ospf parameters router-id 10.0.255.1
set protocols bgp system-as 65001
set protocols bgp neighbor 203.0.113.1 remote-as 64500
set protocols bgp neighbor 203.0.113.1 address-family ipv4-unicast prefix-list export ANNONCES
set policy prefix-list ANNONCES rule 10 action permit
set policy prefix-list ANNONCES rule 10 prefix 198.51.100.0/24
```

## VPN et haute disponibilité

```text
generate pki wireguard key-pair install interface wg0
set interfaces wireguard wg0 address 10.255.0.1/24
set interfaces wireguard wg0 port 51820
set interfaces wireguard wg0 peer site-lyon public-key <clé-publique-du-pair>
set interfaces wireguard wg0 peer site-lyon allowed-ips 10.1.0.0/16
set interfaces wireguard wg0 peer site-lyon address 198.51.100.20
set interfaces wireguard wg0 peer site-lyon port 51820
set high-availability vrrp group LAN vrid 10
set high-availability vrrp group LAN interface eth1
set high-availability vrrp group LAN address 10.0.20.254/24
set high-availability vrrp group LAN priority 200
```

IPsec site à site : `set vpn ipsec …` (profils IKE/ESP, pairs, tunnels) — mêmes notions que [[04-strongswan/03-site-a-site|strongSwan]], dont VyOS utilise le moteur.

## Automatisation

API HTTP (`set service https api keys id auto key '<clé>'`), collection Ansible `vyos.vyos`, configuration complète exportable en commandes `set` (`show configuration commands`).

Commandes : [[90-aide-memoire|aide-mémoire]].
