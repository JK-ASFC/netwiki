---
title: Interfaces graphiques (LuCI et OpenWISP)
description: Interfaces web d'OpenWrt et OpenWISP — LuCI (Status Overview, Network → Interfaces/Wireless/Firewall/DHCP and DNS, System → Software/Backup/Flash firmware, HTTPS, thèmes) et tableau de bord OpenWISP (carte, appareils, état de configuration, modèles, supervision, topologie, RADIUS), avec emplacements de captures d'écran.
tags: [luci, openwisp, interface graphique, openwrt, captures]
icon: monitor
---

## LuCI (OpenWrt)

Accès : `http(s)://192.168.1.1` (installer `luci-ssl` pour HTTPS si l'image n'inclut pas LuCI ou le TLS), compte `root`.

| Menu | Contenu |
| --- | --- |
| **Status → Overview** | Système, mémoire, interfaces, clients DHCP, clients Wi-Fi associés |
| Status → Realtime Graphs | Charge, trafic, connexions |
| **Network → Interfaces** | Interfaces logiques, onglet *Devices* (ponts, VLAN DSA), protocoles (statique, DHCP, PPPoE, WireGuard) |
| **Network → Wireless** | Radios, pays, canaux, SSID, chiffrement, 802.11r, analyse des réseaux voisins |
| **Network → Firewall** | Zones, redirections de ports, règles de trafic, NAT |
| Network → DHCP and DNS | Baux statiques, domaines locaux, serveurs DNS |
| **System → Software** | Mise à jour des listes, installation de paquets (`luci-app-*`) |
| System → Backup / Flash Firmware | Sauvegarde, restauration, sysupgrade |
| System → Administration | Mot de passe, clés SSH, accès HTTPS |

Avant de valider un changement réseau, LuCI propose **Save & Apply** avec retour arrière automatique si l'accès est perdu (*Apply unchecked* le désactive).

<!-- CAPTURE: LuCI — Status Overview | _assets/luci-overview.png -->
<!-- CAPTURE: LuCI — Network → Interfaces, onglet Devices avec les VLAN du pont br-lan | _assets/luci-vlan-dsa.png -->
<!-- CAPTURE: LuCI — Network → Wireless, configuration d'un SSID WPA3 | _assets/luci-wifi.png -->
<!-- CAPTURE: LuCI — Network → Firewall, zones | _assets/luci-pare-feu.png -->

## OpenWISP

| Menu | Contenu |
| --- | --- |
| **Tableau de bord** | Carte géographique, état des appareils (en ligne, problème, critique), graphiques de clients et de trafic |
| **Network → Devices** | Liste, état de la configuration (*applied*, *modified*, *error*), onglets Configuration, Map, Charts, Credentials |
| Network → Templates / VPN Servers | Modèles et serveurs VPN de gestion |
| **Monitoring** | Vérifications, métriques, alertes, seuils |
| Topology | Graphe de topologie |
| RADIUS | Utilisateurs, groupes, sessions, inscriptions |
| Firmware | Images et campagnes de mise à jour |

<!-- CAPTURE: OpenWISP — tableau de bord avec carte des appareils | _assets/openwisp-tableau-de-bord.png -->
<!-- CAPTURE: OpenWISP — fiche d'un appareil, onglet Configuration et modèles | _assets/openwisp-appareil.png -->
<!-- CAPTURE: OpenWISP — graphiques de supervision d'un point d'accès | _assets/openwisp-supervision.png -->
