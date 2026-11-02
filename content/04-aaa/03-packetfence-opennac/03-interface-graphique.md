---
title: Interface graphique
description: Interface d'administration de PacketFence (port 1443) — tableau de bord, Status, Nodes (terminaux, rôles, réévaluation), Users, Auditing (journal RADIUS), Configuration (sources d'authentification, rôles, équipements réseau, profils de connexion, portail captif, Fingerbank, sécurité), Reports ; portail captif côté utilisateur ; interface OpenNAC ; équivalents pfcmd.
tags: [packetfence, opennac, nac, interface graphique, portail captif]
icon: app-window
---

## PacketFence — administration

`https://pf.corp.exemple.fr:1443` (compte `admin` créé par l'assistant ou comptes AD autorisés).

| Menu | Contenu |
| --- | --- |
| **Status** | Tableau de bord (authentifications, terminaux), état des services, cluster |
| **Reports** | Rapports (terminaux par rôle, OS, connexions, alertes de sécurité) |
| **Auditing** | **Journal RADIUS** (demande, réponse, raison), journal d'administration, DHCP |
| **Nodes** | Terminaux : recherche par MAC/utilisateur/IP, rôle, enregistrement, **réévaluer l'accès** (CoA) |
| **Users** | Utilisateurs locaux, invités, droits d'administration |
| **Configuration** | Sources, rôles, **équipements réseau**, **profils de connexion**, portail, Fingerbank, sécurité (événements, isolation) |

<!-- CAPTURE: PacketFence — tableau de bord Status | _assets/packetfence-status.png -->
<!-- CAPTURE: PacketFence — Auditing, détail d'une authentification RADIUS | _assets/packetfence-audit-radius.png -->
<!-- CAPTURE: PacketFence — Nodes, fiche d'un terminal et changement de rôle | _assets/packetfence-node.png -->
<!-- CAPTURE: PacketFence — configuration d'un commutateur (rôles → VLAN) | _assets/packetfence-switch-roles.png -->

## Portail captif (utilisateur)

Le terminal non enregistré est placé dans le VLAN d'enregistrement : le navigateur s'ouvre sur le **portail** (connexion AD, parrainage d'invité, SMS/e-mail, acceptation de la charte), puis PacketFence change le rôle et le port bascule dans le VLAN de production.

<!-- CAPTURE: PacketFence — portail captif d'enregistrement | _assets/packetfence-portail-captif.png -->

## OpenNAC

Console web de l'ON Core : tableau de bord (terminaux, incidents), *Endpoints*, *Policies* (conditions et actions), *Network devices*, *Configuration* ; ON Analytics pour les tableaux de bord et la recherche dans les journaux.

<!-- CAPTURE: OpenNAC — console, liste des politiques | _assets/opennac-politiques.png -->

## Correspondance interface ↔ pfcmd

| Action | Interface | Commande |
| --- | --- | --- |
| Voir un terminal | Nodes → recherche | `/usr/local/pf/bin/pfcmd node view 00:11:22:33:44:55` |
| Redémarrer les services | Status → Services | `/usr/local/pf/bin/pfcmd service pf restart` |
| Vérifier la configuration | — | `/usr/local/pf/bin/pfcmd checkup` |
