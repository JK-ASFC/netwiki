---
title: IPFire
description: IPFire 2.x — distribution pare-feu Linux à interface web : zones de couleur (GREEN, RED, BLUE, ORANGE), installation et assistant setup, interface web sur le port 444, règles de pare-feu et groupes, redirections, proxy web et filtre d'URL, IPS Suricata, blocage par géolocalisation et listes d'IP, VPN IPsec et OpenVPN (WireGuard dans les versions récentes), DHCP, DNS (Unbound, DNSSEC), QoS, extensions Pakfire, mises à jour et sauvegarde.
tags: [ipfire, pare-feu, utm, suricata, ips, vpn, proxy, pakfire]
icon: info
---

**IPFire** (GPL) est une distribution **pare-feu** durcie, installée sur une machine physique ou une VM et administrée par une interface web. Elle convient aux PME, écoles et réseaux domestiques avancés qui veulent un pare-feu libre complet, avec un modèle de zones simple.

| Zone | Rôle |
| --- | --- |
| **RED** | Internet (WAN) : statique, DHCP, PPPoE |
| **GREEN** | Réseau interne de confiance |
| **BLUE** | Wi-Fi (clients autorisés par adresse MAC/IP ou via VPN) |
| **ORANGE** | DMZ : serveurs publiés, sans accès direct au GREEN |

Par défaut, GREEN peut sortir vers RED ; les flux entrants et inter-zones (ORANGE → GREEN, BLUE → GREEN) sont bloqués.

## Installation

ISO depuis `ipfire.org` (x86_64, aarch64) → installation guidée (disque, système de fichiers) → au redémarrage, assistant texte `setup` : clavier, fuseau, nom d'hôte, domaine, mots de passe **root** (SSH/console) et **admin** (web), type de réseau (`GREEN + RED`, `GREEN + RED + ORANGE`…), affectation des cartes, adresses, DHCP.

Interface web : `https://10.0.10.1:444` (compte `admin`).

```bash
setup                      # relancer l'assistant (réseau, mots de passe) en console
ssh -p 222 root@10.0.10.1  # SSH à activer dans System → SSH Access (port 222)
```

## Fonctions principales

| Menu | Fonction |
| --- | --- |
| **Firewall → Firewall Rules** | Règles source → destination (zones, groupes, géolocalisation), NAT/redirection de ports, journalisation |
| Firewall → Firewall Groups | Groupes d'hôtes, de réseaux, de services |
| **Firewall → Intrusion Prevention** | **Suricata** avec jeux de règles (Emerging Threats, Abuse.ch…), mode IPS |
| Firewall → Location Block / IP Blocklists | Blocage par pays, listes de réputation |
| **Network → Web Proxy / URL Filter** | Proxy [[02-squid/01-presentation\|Squid]] transparent ou explicite, filtrage par catégories, mise à jour planifiée |
| Network → DHCP Server, Domain Name System | DHCP par zone, DNS [[02-unbound/01-presentation-installation\|Unbound]] avec DNSSEC et DNS sur TLS |
| **Services → IPsec / OpenVPN / WireGuard** | Site à site et accès distant (WireGuard intégré dans les *Core Updates* récentes) |
| Services → Quality of Service | Priorisation par classes |
| **IPFire → Pakfire** | Extensions : Tor, Samba, clamav, nut, WIO, monitoring, etc. |

## Mises à jour et sauvegarde

- **Core Updates** via *IPFire → Pakfire* (ou `pakfire upgrade` en console) ; lire les notes de chaque version.
- *System → Backup* : export chiffré de la configuration (avec ou sans journaux) à conserver hors de la machine.

```bash
pakfire update && pakfire upgrade -y
pakfire list --no-colors | head
pakfire install -y guardian
```

Interface : [[03-interface-graphique|interfaces graphiques]] · comparatif : [[02-endian|Endian]] · commandes : [[90-aide-memoire|aide-mémoire]].
