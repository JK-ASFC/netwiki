---
title: RouterOS — CLI, WinBox et WebFig
description: Équipements MikroTik (routeurs RouterBOARD et CCR, commutateurs CRS, points d'accès, Cloud Hosted Router) sous RouterOS v7 — accès (configuration par défaut 192.168.88.1, mot de passe de l'étiquette, MAC-WinBox), outils graphiques (WinBox 4, WebFig, Quick Set, The Dude, application mobile), CLI hiérarchique (chemins, print, export, where, mode sûr), durcissement initial (utilisateurs, services, serveur MAC, découverte de voisins), ponts et filtrage VLAN, sauvegarde, mise à jour de RouterOS et du firmware, Netinstall.
tags: [mikrotik, routeros, winbox, webfig, cli, vlan, bridge, durcissement]
icon: terminal
---

**MikroTik** (Lettonie) équipe routeurs, commutateurs et points d'accès d'un même système, **RouterOS**, très complet (routage, pare-feu, VPN, Wi-Fi, MPLS, conteneurs) pour un coût modeste. Il s'administre au choix par **WinBox**, **WebFig** (web), la **CLI** (SSH, console, terminal intégré à WinBox) ou l'**API REST**. Les commutateurs CRS3xx peuvent aussi démarrer sur **SwOS**, un système de commutation simplifié.

## Accès

| Accès | Détails |
| --- | --- |
| Configuration par défaut (modèles SOHO) | `192.168.88.1` sur les ports LAN, NAT et pare-feu de base, `ether1` en WAN (client DHCP) |
| Identifiants | `admin` avec le **mot de passe imprimé sur l'étiquette** (modèles récents) ; anciens modèles : sans mot de passe → à définir immédiatement |
| **MAC-WinBox / MAC-Telnet** | Connexion au niveau 2 par l'adresse MAC, même sans adresse IP (récupération) |
| Console série | 115200 bauds sur la plupart des modèles |
| Réinstallation | **Netinstall** (démarrage réseau) quand l'équipement est inaccessible ou le mot de passe perdu |

## Outils graphiques

| Outil | Usage |
| --- | --- |
| **WinBox** (WinBox 4 : Windows, macOS, Linux) | Outil d'administration complet, découverte des équipements par voisinage, terminal intégré, bouton **Safe Mode** |
| **WebFig** | Interface web équivalente (`https://<adresse>`) |
| Quick Set | Assistant de configuration simplifiée (routeur domestique, point d'accès, CPE) |
| **The Dude** | Cartographie et supervision du réseau (serveur sur RouterOS, client Windows) |
| Application MikroTik (mobile) | Configuration de base, Quick Set |
| CAPsMAN / WiFi | Gestion centralisée des points d'accès (paquet `wifi` en v7) |

## CLI

La CLI suit la hiérarchie des menus WinBox :

```routeros
/system identity set name=RTR-PARIS
/ip address print
/ip address add address=10.0.20.254/24 interface=bridge1 comment="LAN utilisateurs"
/ip route print where active
/interface print stats
/ip firewall filter print
/export compact
/export file=sauvegarde-texte
```

| Élément | Explication |
| --- | --- |
| Chemins | `/ip address`, `/interface bridge port`… ; `..` remonte, `/` revient à la racine |
| `print`, `add`, `set`, `remove`, `enable`, `disable` | Actions communes ; les entrées se désignent par numéro (`set 2 …`) ou par condition (`[find where …]`) |
| `where` | Filtrage : `print where interface=ether1` |
| `export` | Configuration en script (`hide-sensitive` par défaut en v7, `show-sensitive` pour inclure les secrets) |
| **Mode sûr** (*Safe Mode*, `Ctrl+X`) | Si la session est coupée, toutes les modifications faites depuis l'activation sont annulées |
| Tabulation, `?` | Complétion et aide contextuelle |

> [!TIP]
> Activez toujours le **mode sûr** avant de modifier à distance le pare-feu, les adresses ou les ponts : une erreur qui coupe l'accès est automatiquement annulée.

## Durcissement initial

```routeros
/user add name=jdupont group=full password="MotDePasseLongEtUnique"
/user disable admin
/ip service disable telnet,ftp,www,api,api-ssl
/ip service set ssh address=10.0.99.0/24
/ip service set winbox address=10.0.99.0/24
/tool mac-server set allowed-interface-list=none
/tool mac-server mac-winbox set allowed-interface-list=LAN
/ip neighbor discovery-settings set discover-interface-list=LAN
/tool bandwidth-server set enabled=no
/ip dns set allow-remote-requests=no servers=10.0.10.53
/system ntp client set enabled=yes
/system ntp client servers add address=10.0.10.123
/system clock set time-zone-name=Europe/Paris
/system logging action add name=distant target=remote remote=10.0.98.20
/system logging add topics=info action=distant
```

La liste d'interfaces `LAN` (et `WAN`) est créée par la configuration par défaut ; sinon : `/interface list add name=LAN` puis `/interface list member add list=LAN interface=bridge1`. Ne laissez jamais WinBox, SSH ou le résolveur DNS accessibles depuis Internet (nombreux routeurs MikroTik compromis et intégrés à des botnets, comme Mēris).

## Pont et filtrage VLAN

Sur RouterOS, la commutation passe par un **pont** (`bridge`) avec **filtrage VLAN**, accéléré par la puce de commutation sur les CRS (*hardware offload*) :

```routeros
/interface bridge add name=bridge1 vlan-filtering=no
/interface bridge port add bridge=bridge1 interface=ether2 pvid=20
/interface bridge port add bridge=bridge1 interface=ether3 pvid=20
/interface bridge port add bridge=bridge1 interface=sfp-sfpplus1
/interface bridge vlan add bridge=bridge1 vlan-ids=20 tagged=bridge1,sfp-sfpplus1 untagged=ether2,ether3
/interface bridge vlan add bridge=bridge1 vlan-ids=99 tagged=bridge1,sfp-sfpplus1
/interface vlan add interface=bridge1 name=vlan99-admin vlan-id=99
/ip address add address=10.0.99.2/24 interface=vlan99-admin
/interface bridge set bridge1 vlan-filtering=yes
```

Activez `vlan-filtering` **en dernier** (et en mode sûr) : le pont lui-même (`bridge1`) doit être membre *tagged* des VLAN dont il porte une interface (ici l'administration). Vérification : `/interface bridge vlan print`, `/interface bridge host print`.

## Sauvegarde et mises à jour

```routeros
/system backup save name=RTR-PARIS-2026-10-29 password="PhraseDeChiffrement"
/export file=RTR-PARIS-2026-10-29
/system package update set channel=stable
/system package update check-for-updates
/system package update install
/system routerboard upgrade
/system reboot
```

| Fichier | Usage |
| --- | --- |
| `.backup` (binaire, chiffré) | Restauration sur le **même** équipement |
| `.rsc` (export texte) | Lecture, versionnage, réutilisation sur un autre équipement |

Après la mise à jour de RouterOS, mettez aussi à jour le **firmware RouterBOOT** (`/system routerboard upgrade` puis redémarrage). Les sauvegardes peuvent être planifiées par `/system scheduler` et un script, ou collectées par Oxidized/[[01-ansible/03-automatisation-reseau|Ansible]].

Suite : [[02-parefeu-vpn-routage|pare-feu, NAT, VPN, routage et dépannage]].
