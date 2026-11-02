---
title: Interfaces graphiques (IPFire et Endian)
description: Interfaces web d'IPFire (port 444 : System, Status, Network, Services, Firewall, IPFire/Pakfire, Logs) et d'Endian Firewall Community (port 10443 : tableau de bord, Firewall, Proxy, VPN), avec emplacements de captures d'écran.
tags: [ipfire, endian, interface graphique, pare-feu, captures]
icon: monitor
---

## IPFire (`https://<GREEN>:444`)

| Menu | Écrans utiles |
| --- | --- |
| **System** | Accueil (état des zones RED/GREEN, connexions, mises à jour disponibles), SSH, sauvegarde, interface graphique, arrêt |
| **Status** | Système, mémoire, réseau, connexions, graphiques de trafic, état des VPN |
| Network | Zones, DHCP, DNS, proxy web et filtre d'URL, Wake-on-LAN |
| Services | IPsec, OpenVPN, WireGuard, QoS, serveur de temps |
| **Firewall** | Règles, groupes, IPS, blocage géographique, listes de blocage, options |
| IPFire | **Pakfire** (extensions et mises à jour) |
| **Logs** | Journaux du pare-feu (graphiques par pays/port), IPS, proxy, système |

<!-- CAPTURE: IPFire — page d'accueil avec état des zones | _assets/ipfire-accueil.png -->
<!-- CAPTURE: IPFire — Firewall Rules, création d'une redirection de port vers la DMZ | _assets/ipfire-regles.png -->
<!-- CAPTURE: IPFire — Intrusion Prevention System, choix des jeux de règles | _assets/ipfire-ips.png -->
<!-- CAPTURE: IPFire — Pakfire | _assets/ipfire-pakfire.png -->

## Endian Firewall Community (`https://<GREEN>:10443`)

Barre de menus : **System** (tableau de bord, état des services, utilisateurs, sauvegarde), **Status** (trafic, connexions, journaux), **Network**, **Services**, **Firewall**, **Proxy**, **VPN**, **Logs**.

<!-- CAPTURE: Endian — tableau de bord | _assets/endian-tableau-de-bord.png -->
<!-- CAPTURE: Endian — Firewall, règles inter-zones | _assets/endian-pare-feu.png -->
<!-- CAPTURE: Endian — VPN, serveur OpenVPN | _assets/endian-openvpn.png -->
