---
title: pfSense — interface web, console et configuration
description: pfSense (CE et Plus, Netgate) — installation et menu console (affectation des interfaces, adresses, réinitialisation), interface web (assistant, interfaces et VLAN, alias, règles de pare-feu par interface, NAT sortant et redirections, DHCP/DNS Resolver), VPN (IPsec, OpenVPN, WireGuard), haute disponibilité CARP avec pfsync et XMLRPC, paquets (pfBlockerNG, Suricata, HAProxy), shell et outils en ligne de commande (pfctl, easyrule, pfSsh.php), sauvegarde du config.xml et dépannage.
tags: [pfsense, pare-feu, freebsd, carp, openvpn, wireguard, pfctl, console]
icon: shield
---

**pfSense** (Netgate) est un pare-feu/routeur libre basé sur **FreeBSD** et le filtre **pf**. Deux éditions : **pfSense CE** (communautaire) et **pfSense Plus** (appliances Netgate, ou licence sur matériel tiers/cloud). L'administration est principalement **graphique** ; la console et le shell servent à l'initialisation et au dépannage. Son fork [[02-opnsense|OPNsense]] suit la même logique.

## Installation et console

Installation depuis l'image USB (ZFS recommandé), puis **menu console** :

| Option | Usage |
| --- | --- |
| 1) Assign Interfaces | Affecter WAN/LAN/OPT aux cartes réseau, créer des VLAN |
| 2) Set interface(s) IP address | Adressage (et DHCP du LAN) |
| 3) Reset webConfigurator password | Réinitialiser le mot de passe `admin` |
| 4) Reset to factory defaults | Configuration usine |
| 5) Reboot / 6) Halt | |
| 8) Shell | Shell FreeBSD |
| 11) Restart webConfigurator | Si l'interface web ne répond plus |
| 13) Update from console | Mise à jour |
| 15) Restore recent configuration | Revenir à une configuration précédente |

Interface web : `https://192.168.1.1` (LAN), identifiants par défaut `admin` / `pfsense` → l'**assistant** impose de les changer.

## Interfaces et VLAN

*Interfaces → Assignments → VLANs* (VLAN sur une interface parente en trunk), puis affecter chaque VLAN comme interface (OPTx renommée), activer, adresser. *Interfaces → WAN* : DHCP, statique, PPPoE ; décocher *Block private networks* uniquement si le WAN est dans un réseau privé.

## Alias, règles et NAT

| Élément | Menu | Remarques |
| --- | --- | --- |
| **Alias** | *Firewall → Aliases* | Hôtes, réseaux, ports, URL (listes téléchargées) : règles lisibles |
| **Règles** | *Firewall → Rules → <interface>* | Les règles s'appliquent au trafic **entrant** sur l'interface ; première correspondance ; règle « anti-lockout » sur le LAN |
| Groupes d'interfaces | *Interfaces → Interface Groups* | Règles communes à plusieurs interfaces |
| **NAT sortant** | *Firewall → NAT → Outbound* | Automatique par défaut ; mode hybride/manuel pour les cas particuliers |
| Redirections | *Firewall → NAT → Port Forward* | Crée la règle de pare-feu associée |
| NAT 1:1 | *Firewall → NAT → 1:1* | Adresse publique dédiée |
| Planifications, limiteurs | *Firewall → Schedules / Traffic Shaper* | |

## Services

| Service | Usage |
| --- | --- |
| DHCP (Kea dans les versions récentes) | Par interface, réservations, options |
| **DNS Resolver** (Unbound) | Résolveur récursif local, surcharges d'hôtes et de domaines (voir [[02-unbound/01-presentation-installation\|Unbound]]) |
| NTP, SNMP, UPnP (à éviter) | |

## VPN

| Type | Remarques |
| --- | --- |
| **IPsec** | Site à site IKEv2 (mode tunnel ou VTI routé), accès distant IKEv2 (mobile clients) |
| **OpenVPN** | Accès distant avec assistant et paquet d'export des clients (`openvpn-client-export`), authentification locale, LDAP ou RADIUS |
| **WireGuard** | Paquet officiel, tunnels et pairs |

## Haute disponibilité (CARP)

Deux pfSense identiques : **CARP** (adresses IP virtuelles partagées), **pfsync** (synchronisation des états sur un lien dédié), **XMLRPC** (synchronisation de la configuration du principal vers le secondaire). *System → High Avail. Sync* et *Firewall → Virtual IPs*. Le NAT sortant doit utiliser l'adresse CARP du WAN.

## Paquets

*System → Package Manager* : **pfBlockerNG** (listes de blocage IP et DNS), **Suricata** (IDS/IPS, voir [[05-suricata/01-presentation-installation|Suricata]]), HAProxy, ACME (certificats Let's Encrypt), FRR (OSPF/BGP), Zabbix Agent, etc. Chaque paquet ajoute une surface d'attaque : installer le strict nécessaire.

## Shell et commandes utiles

```sh
pfctl -sr                       # règles chargées (syntaxe pf)
pfctl -ss | grep 10.0.20.15     # états (connexions)
pfctl -si                       # statistiques
pfctl -d / pfctl -e             # désactiver / réactiver le filtrage (dépannage, à éviter en production)
easyrule pass wan tcp 198.51.100.7 10.0.30.10 443    # ajouter rapidement une règle depuis la console
pfSsh.php playback svc restart unbound               # redémarrer un service
tcpdump -ni vmx0 host 10.0.20.15
clog -f /var/log/filter.log      # (anciennes versions) journal du filtrage ; versions récentes : tail -f /var/log/filter.log
```

Le dépannage graphique passe par *Diagnostics* : Ping, Traceroute, **Packet Capture**, **States**, *Test Port*, *pfTop*, *Routes*, *ARP Table*, *DNS Lookup*.

## Sauvegarde et mise à jour

Toute la configuration tient dans **`/cf/conf/config.xml`** : *Diagnostics → Backup & Restore* (export chiffré possible), historique automatique des configurations (*Configuration History*), **AutoConfigBackup** (Netgate, chiffré). Mise à jour : *System → Update* (lire les notes de version ; les paquets doivent être compatibles).

## Sécurité

- [ ] Interface web et SSH **uniquement** depuis le LAN/VLAN d'administration (règles + *System → Advanced → Admin Access*) ; jamais sur le WAN
- [ ] Mot de passe `admin` changé, comptes nominatifs, MFA (authentification RADIUS/LDAP avec MFA)
- [ ] Mises à jour régulières, paquets réduits au nécessaire
- [ ] Journaux envoyés à un syslog distant (*Status → System Logs → Settings*)

## Problèmes fréquents

| Symptôme | Cause | Solution |
| --- | --- | --- |
| Interface web inaccessible après un changement de règles | Règle anti-lockout désactivée, mauvaise interface | Console → 11 (redémarrer l'interface web) ou `pfctl -d` temporaire, corriger |
| Trafic d'un VLAN bloqué | Pas de règle sur l'interface du VLAN (refus par défaut) | Ajouter les règles sur l'interface concernée |
| Redirection de port sans effet depuis l'intérieur | Réflexion NAT désactivée | *NAT Reflection* ou DNS interne (split DNS) |
| Pertes de performances | Matériel, déchargements de la carte réseau, IPS | Désactiver certains *offloads*, dimensionner |
