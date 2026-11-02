---
title: Interfaces graphiques
description: Interfaces de SoftEther (VPN Server Manager, assistant de configuration, Virtual Hub, utilisateurs, L2TP/IPsec, OpenVPN/SSTP), de Pritunl (tableau de bord, Users, Servers, profils clients, Pritunl Client) et de l'application Mullvad VPN (connexion, choix du serveur, paramètres VPN, DNS, split tunneling), avec emplacements de captures d'écran.
tags: [softether, pritunl, mullvad, interface graphique, captures]
icon: monitor
---

## SoftEther VPN Server Manager (Windows, administre aussi un serveur Linux)

Fenêtre principale : liste des **Virtual Hubs** (état, sessions, utilisateurs), boutons *Manage Virtual Hub*, *Local Bridge Setting*, *IPsec / L2TP Setting*, *OpenVPN / MS-SSTP Setting*, *Encryption and Network*, *Layer 3 Switch*. L'assistant *Easy Setup* propose : accès distant, site à site, VPN de pont.

<!-- CAPTURE: SoftEther VPN Server Manager — fenêtre principale | _assets/softether-manager.png -->
<!-- CAPTURE: SoftEther — paramètres IPsec / L2TP | _assets/softether-l2tp.png -->

## Pritunl

| Onglet | Contenu |
| --- | --- |
| **Dashboard** | Utilisateurs connectés, serveurs, journaux |
| **Users** | Organisations, utilisateurs, liens de téléchargement des profils, PIN, MFA |
| **Servers** | Serveurs VPN, organisations rattachées, routes, démarrage/arrêt |
| Hosts, Links | Hôtes du cluster, liens site à site (éditions payantes) |
| Settings | Certificat, SSO, paramètres d'administration |

<!-- CAPTURE: Pritunl — onglet Servers avec routes et organisation rattachée | _assets/pritunl-serveurs.png -->
<!-- CAPTURE: Pritunl Client — profil importé et connexion | _assets/pritunl-client.png -->

## Application Mullvad VPN

Écran principal : état (connecté/non sécurisé), carte, bouton **Connect**, choix du **lieu**. *Settings* → **VPN settings** (protocole, lockdown, obfuscation, multihop, DAITA), **DNS content blockers**, **Split tunneling**, *Local network sharing*.

<!-- CAPTURE: Mullvad VPN — écran principal connecté | _assets/mullvad-principal.png -->
<!-- CAPTURE: Mullvad VPN — paramètres VPN (lockdown, DNS) | _assets/mullvad-parametres.png -->
