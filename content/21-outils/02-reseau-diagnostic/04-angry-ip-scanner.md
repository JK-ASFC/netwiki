---
title: Angry IP Scanner
description: Angry IP Scanner, scanner IP rapide et multiplateforme — usages (inventaire rapide d'un sous-réseau, recherche d'une adresse libre, repérage d'un équipement), installation (Java), plages et listes de cibles, méthodes de ping, récupérateurs (nom, MAC, constructeur, ports, NetBIOS, HTTP), export CSV/XML, ligne de commande, limites et précautions.
tags: [angry ip scanner, scan ip, inventaire, découverte, mac, export]
icon: scan-search
---

**Angry IP Scanner** (GPL, Java) balaie très rapidement une plage d'adresses et affiche, pour chaque hôte vivant, son nom, son adresse MAC, son constructeur et les ports ouverts choisis. C'est l'outil du technicien pour un **inventaire rapide** : trouver une imprimante qui a changé d'adresse, vérifier qu'une adresse est libre avant de l'attribuer, repérer les équipements d'un VLAN. Pour des analyses détaillées, voir [[03-nmap|Nmap]].

Mêmes règles que pour tout scanner : uniquement sur des réseaux administrés et avec autorisation.

## Installation

| Système | Méthode |
| --- | --- |
| Windows | Installateur ou version portable (`winget install angryziber.AngryIPScanner`) |
| Linux | Paquet `.deb` / `.rpm` du site officiel |
| macOS | Archive `.zip` (application) |

Une version de **Java** récente est requise (incluse dans certains paquets).

## Utilisation

1. Choisir la cible : **plage d'IP** (`10.0.20.1` → `10.0.20.254`), sous-réseau avec masque, **nom d'hôte**, liste depuis un fichier, ou génération aléatoire.
2. *Outils → Récupérateurs* (*Fetchers*) : colonnes à collecter.
3. *Outils → Préférences* : méthode de ping, délai, nombre de threads, ports à tester.
4. Lancer, filtrer l'affichage (*Hôtes vivants uniquement*, *Ports ouverts uniquement*).

| Récupérateur | Information |
| --- | --- |
| Ping | Temps de réponse |
| Nom d'hôte | Résolution inverse (DNS, NetBIOS) |
| **Adresse MAC** et **constructeur** | Sur le même segment uniquement (ARP) |
| Ports | Ports TCP ouverts (liste configurable : 22, 80, 443, 445, 3389, 9100…) |
| Informations NetBIOS | Nom, groupe de travail, utilisateur connecté (Windows) |
| Détection web | Titre / serveur HTTP |

| Méthode de ping | Quand |
| --- | --- |
| ICMP | Cas général (si autorisé) |
| Sonde TCP / UDP | Hôtes qui filtrent l'ICMP (pare-feu Windows) |
| ARP | Segment local : détecte même les hôtes qui ne répondent à rien |
| Combinée | Plus fiable, plus lent |

## Export et ligne de commande

*Analyse → Exporter* : CSV, TXT, XML, liste d'adresses IP:port. En ligne de commande :

```text
ipscan -f:range 10.0.20.1 10.0.20.254 -o C:\Temp\vlan20.csv -q -s
```

## Limites

- L'adresse MAC n'est visible que sur le **segment local** (au-delà d'un routeur, c'est celle du routeur qui compte dans la table ARP).
- Un hôte qui filtre tout apparaît « mort » : un résultat vide ne prouve pas qu'une adresse est libre — vérifiez aussi la table ARP du routeur, les baux DHCP et l'IPAM ([[06-ipam/01-presentation-deploiement|IPAM]]).
- Balayer de grandes plages peut déclencher les alertes de l'IDS ([[05-suricata/01-presentation-installation|Suricata]]) : prévenez l'équipe sécurité.
