---
title: Interface graphique (NetBird)
description: Tableau de bord NetBird (Peers, Setup Keys, Access Control, Networks/Network Routes, DNS, Team, Activity, Settings) et application de bureau (icône de la barre des tâches) ; Nebula n'a pas d'interface hors Mobile Nebula et Defined Networking. Emplacements de captures d'écran.
tags: [netbird, nebula, interface graphique, captures]
icon: monitor
---

## Tableau de bord NetBird

| Menu | Contenu |
| --- | --- |
| **Peers** | Pairs (nom, adresse NetBird, groupes, OS, version, dernière connexion), expiration de session, suppression |
| Setup Keys | Clés d'installation (usage unique ou réutilisable, groupes attribués, expiration) |
| **Access Control** | Politiques source → destination, protocoles et ports, *posture checks* |
| **Networks / Network Routes** | Réseaux exposés via des pairs routeurs, sorties Internet |
| DNS | Serveurs de noms par domaine, paramètres |
| Team | Utilisateurs, rôles, comptes de service |
| Activity | Journal d'audit |
| Settings | Authentification des pairs, groupes depuis l'IdP, intégrations |

L'application de bureau (Windows, macOS, Linux) affiche l'état de connexion et permet *Connect / Disconnect*, le choix du serveur de gestion et des réseaux.

<!-- CAPTURE: NetBird — liste des pairs | _assets/netbird-pairs.png -->
<!-- CAPTURE: NetBird — création d'une politique d'accès | _assets/netbird-politique.png -->
<!-- CAPTURE: NetBird — réseau routé via un pair routeur | _assets/netbird-reseau.png -->
<!-- CAPTURE: NetBird — application de bureau dans la barre des tâches | _assets/netbird-client.png -->

## Nebula

Pas d'interface d'administration dans la version libre : tout se fait par fichiers et `nebula-cert`. **Mobile Nebula** (Android, iOS) importe certificat et configuration ; Defined Networking fournit une console gérée.

<!-- CAPTURE: Mobile Nebula — configuration d'un site | _assets/mobile-nebula.png -->
