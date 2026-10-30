---
title: Correspondance des commandes — routage, pare-feu et diagnostic
description: Tables d'équivalence des commandes de routage, de sécurité et de dépannage entre constructeurs — Cisco IOS/ASA, Fortinet FortiOS, Palo Alto PAN-OS, Juniper Junos (SRX), Stormshield SNS, Check Point Gaia, pfSense/OPNsense, MikroTik RouterOS et Huawei VRP — application de la configuration, tables de routage, routes statiques, OSPF et BGP, ARP, sessions, simulation de règles, captures de paquets, VPN IKE/IPsec, haute disponibilité, ressources, sauvegarde ; logique de NAT comparée et méthode de dépannage commune.
tags: [correspondance, fortigate, palo alto, asa, junos, check point, stormshield, diagnostic, routage]
icon: copy
---

Complément de [[01-administration-commutation|la correspondance administration/commutation]], cette page compare les commandes utilisées au quotidien sur les **routeurs et pare-feu**.

## Principes de configuration

| Constructeur | Application des changements | Retour arrière |
| --- | --- | --- |
| Cisco IOS / ASA | Immédiate ; `write memory` pour la conserver | `configure replace` (IOS), archive |
| Fortinet FortiOS | À la sortie du bloc (`next`, `end`) | Révisions de configuration, sauvegardes |
| Palo Alto PAN-OS | **`commit`** (configuration candidate) | `revert`, configurations enregistrées |
| Juniper Junos | **`commit`** (`commit confirmed` recommandé) | `rollback n` |
| Stormshield SNS | Commande `… ACTIVATE` de chaque section (CLI), bouton *Appliquer* (web) | Sauvegardes, partition de secours |
| Check Point | *Publish* puis *Install Policy* (SmartConsole) ; `save config` pour Gaia | Révisions de session |
| pfSense / OPNsense | *Save* puis *Apply Changes* | Historique de `config.xml` |
| MikroTik RouterOS | Immédiate (mode sûr `Ctrl+X` pour protéger) | Sauvegarde, export |
| Huawei VRP | Immédiate (VRP5) ou **`commit`** (VRP8) ; `save` | `rollback configuration` (VRP8) |

## Routage et état — Cisco, Fortinet, Palo Alto, Juniper

| Tâche | Cisco IOS / ASA | FortiOS | PAN-OS | Junos (SRX) |
| --- | --- | --- | --- | --- |
| Version et état | `show version` | `get system status` | `show system info` | `show version` |
| Configuration | `show running-config` | `show full-configuration` | `show config running` | `show configuration` |
| Table de routage | `show ip route` (IOS) ; `show route` (ASA) | `get router info routing-table all` | `show routing route` | `show route` |
| Route par défaut | `ip route 0.0.0.0 0.0.0.0 203.0.113.1` ; ASA : `route outside 0 0 203.0.113.1` | `config router static` ; `edit 0` ; `set gateway 203.0.113.1` ; `set device wan1` | `set network virtual-router default routing-table ip static-route DEFAUT destination 0.0.0.0/0 nexthop ip-address 203.0.113.1` | `set routing-options static route 0.0.0.0/0 next-hop 203.0.113.1` |
| Voisins OSPF | `show ip ospf neighbor` | `get router info ospf neighbor` | `show routing protocol ospf neighbor` | `show ospf neighbor` |
| Sessions BGP | `show ip bgp summary` | `get router info bgp summary` | `show routing protocol bgp summary` | `show bgp summary` |
| Table ARP | `show ip arp` ; `show arp` (ASA) | `get system arp` | `show arp all` | `show arp` |
| Ping avec source | `ping 8.8.8.8 source 10.0.20.254` | `execute ping-options source 10.0.20.254` ; `execute ping 8.8.8.8` | `ping source 10.0.20.254 host 8.8.8.8` | `ping 8.8.8.8 source 10.0.20.254` |
| Ressources | `show processes cpu` | `get system performance status` | `show system resources` | `show chassis routing-engine` |

## Sécurité et diagnostic — Cisco, Fortinet, Palo Alto, Juniper

| Tâche | Cisco ASA | FortiOS | PAN-OS | Junos (SRX) |
| --- | --- | --- | --- | --- |
| Sessions d'un hôte | `show conn address 10.0.20.15` | `diagnose sys session filter src 10.0.20.15` ; `diagnose sys session list` | `show session all filter source 10.0.20.15` | `show security flow session source-prefix 10.0.20.15` |
| Quelle règle s'applique ? | `packet-tracer input inside tcp 10.0.20.15 50000 8.8.8.8 443` | `diagnose debug flow filter addr 10.0.20.15` ; `diagnose debug flow trace start 10` ; `diagnose debug enable` | `test security-policy-match from TRUST to UNTRUST source 10.0.20.15 destination 8.8.8.8 protocol 6 destination-port 443` | `show security match-policies from-zone trust to-zone untrust source-ip 10.0.20.15 destination-ip 8.8.8.8 source-port 50000 destination-port 443 protocol tcp` |
| Capture de paquets | `capture CAP interface inside match ip host 10.0.20.15 any` | `diagnose sniffer packet any "host 10.0.20.15" 4` | `debug dataplane packet-diag set filter match source 10.0.20.15` (puis `set capture on`) | `monitor traffic interface ge-0/0/1 matching "host 10.0.20.15"` |
| Rejets | `show asp drop` | `diagnose debug flow` (messages *Denied by*) | `show counter global filter delta yes severity drop` | `security flow traceoptions` |
| Phase IKE | `show crypto ikev2 sa` | `diagnose vpn ike gateway list` | `show vpn ike-sa` | `show security ike security-associations` |
| Phase IPsec | `show crypto ipsec sa` | `diagnose vpn tunnel list` ; `get vpn ipsec tunnel summary` | `show vpn ipsec-sa` | `show security ipsec security-associations` |
| Haute disponibilité | `show failover` | `get system ha status` | `show high-availability state` | `show chassis cluster status` |
| Sauvegarde | `copy running-config tftp:` | `execute backup config tftp sauvegarde.conf 10.0.98.30` | `scp export configuration from running-config.xml to …` | `save /var/tmp/sauvegarde.conf` (mode configuration) |

## Autres pare-feu et routeurs

| Tâche | Stormshield SNS | Check Point (mode expert) | pfSense / OPNsense (shell) | MikroTik RouterOS | Huawei VRP |
| --- | --- | --- | --- | --- | --- |
| Table de routage | `netstat -rn` | `netstat -rn` ; `show route` (clish) | `netstat -rn` | `/ip route print` | `display ip routing-table` |
| Sessions | `sfctl -s conn` | `fw tab -t connections -s` | `pfctl -ss` | `/ip firewall connection print` | `display firewall session table` (USG) |
| Règles actives | `sfctl -s filter` | `fw stat` | `pfctl -sr` | `/ip firewall filter print stats` | `display security-policy rule all` (USG) |
| Rejets | *Monitoring → Journaux* | `fw ctl zdebug + drop` | `tail -f /var/log/filter.log` | Règle `log=yes` | Journaux (*Monitor → Log*) |
| Capture | `tcpdump -ni ethernet1 host 10.0.20.15` | `fw monitor -F "10.0.20.15,0,0,0,0"` ; `tcpdump` | `tcpdump -ni em0 host 10.0.20.15` | `/tool sniffer quick ip-address=10.0.20.15` | `capture-packet` (selon modèle) |
| VPN IPsec | `ipsecinfo` | `vpn tu` | `swanctl --list-sas` | `/ip ipsec active-peers print` | `display ike sa` ; `display ipsec sa` |
| Haute disponibilité | *Monitoring → Haute disponibilité* | `cphaprob state` | *Status → CARP* | `/interface vrrp print` | `display vrrp brief` ; `display hrp state` (USG) |
| Sauvegarde | `CONFIG BACKUP list=all` | `migrate_server export` (management) ; `save config` (Gaia) | `config.xml` (*Backup & Restore*) | `/system backup save` ; `/export` | `save` ; `display saved-configuration` |

## Logique de NAT comparée

La source d'erreurs la plus fréquente entre constructeurs est **l'adresse à utiliser dans la règle de filtrage** pour un service publié (NAT de destination) :

| Constructeur | La règle de sécurité référence… |
| --- | --- |
| Cisco ASA (8.3 et suivants) | L'adresse **réelle** (privée) du serveur |
| FortiGate | L'objet **VIP** (publication) placé en destination de la politique |
| Palo Alto | L'adresse **publique** (pré-NAT) avec la zone de destination **post-NAT** |
| Juniper SRX | L'adresse **privée** (la NAT de destination précède la politique) |
| Stormshield | L'adresse **publique** (avant traduction : le filtrage est évalué avant la NAT) |
| Check Point | NAT automatique défini dans l'objet ; la règle d'accès référence l'objet du serveur |
| pfSense / OPNsense | Règle associée créée automatiquement avec l'adresse **privée** |
| MikroTik | Chaîne `forward` avec `connection-nat-state=dstnat` ou l'adresse privée |

## Méthode de dépannage commune

1. **Le trafic arrive-t-il ?** Capture sur l'interface d'entrée (filtre sur l'hôte).
2. **Quelle route ?** Table de routage, route de retour (routage asymétrique : rejet par les pare-feu à états).
3. **Quelle règle ?** Outil de simulation (packet-tracer, debug flow, test security-policy-match, match-policies) et journaux de la règle.
4. **Quelle traduction ?** Table de NAT et sessions.
5. **Le trafic ressort-il ?** Capture sur l'interface de sortie ; puis vérifier le retour.

Pages détaillées : [[05-cisco-asa/03-vpn-failover-depannage|Cisco ASA]], [[15-fortigate/03-ha-diagnostic-depannage|FortiGate]], [[18-palo-alto/03-panorama-ha-depannage|Palo Alto]], [[23-juniper/02-srx-securite-depannage|Juniper SRX]], [[17-stormshield/03-vpn-ha-supervision|Stormshield]], [[21-check-point/01-gaia-smartconsole|Check Point]], [[19-pfsense-opnsense/01-pfsense|pfSense]], [[24-mikrotik/02-parefeu-vpn-routage|MikroTik]], [[08-huawei/02-routage-securite-outils|Huawei]].
