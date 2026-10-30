---
title: Alcatel-Lucent OmniPCX Enterprise (OXE)
description: L'IPBX d'entreprise d'Alcatel-Lucent Enterprise (ALE) — architecture (Call Server principal et de secours, Media Gateways, IP Touch et postes 8000/80x8, DECT), outils d'administration (OmniVista 8770, mgr, Web-based Tool), commandes du système (netadmin, swinst, config, tuner, infocs, mgr, listerm, trkstat, compvisu), réseau d'accueil (VLAN voix, DHCP, QoS), téléphonie SIP et intégration Rainbow, sauvegardes et dépannage.
tags: [alcatel, ale, omnipcx, oxe, omnivista 8770, mgr, toip, sip]
icon: building-2
---

L'**OmniPCX Enterprise** (OXE) d'**Alcatel-Lucent Enterprise** équipe de nombreux grands comptes et administrations en France. C'est un système robuste, multi-sites (réseau ABC), qui gère postes numériques, IP (protocole NOE propriétaire ou SIP), DECT, trunks RNIS/SIP et applications (centre de contacts, messagerie OmniVista). Les PME utilisent plutôt [[02-oxo-connect-rainbow|OXO Connect]].

## Architecture

| Élément | Rôle |
| --- | --- |
| **Call Server** (CS) | Serveur d'appels Linux (appliance ou machine virtuelle), en duplex principal/secours (*spatial redundancy*) |
| **Media Gateway** (MG) | Cartes d'interface : postes analogiques et numériques, accès opérateur, ressources (conférence, compression) |
| Postes | **ALE-xx / 80x8 / 8018 / 8028s / 8058s / 8068s / 8078s** (NOE ou SIP), postes numériques, DECT 8232/8262 via bornes IP-DECT |
| Passerelles SIP | Trunks SIP opérateurs, SBC externes |
| **OmniVista 8770** | Suite de gestion Windows : configuration, annuaire, alarmes, taxation, performances |
| Rainbow | Communications unifiées dans le cloud ALE, interconnectées à l'OXE (Rainbow Hub/Edge) |

## Outils d'administration

| Outil | Usage |
| --- | --- |
| **OmniVista 8770** (client lourd Windows) | Administration graphique quotidienne : utilisateurs, postes, groupements, annuaire, alarmes, rapports de taxation et de trafic |
| **mgr** (console du Call Server) | Outil textuel à menus pour toute la configuration (objets : *Users*, *Phone Facilities categories*, *Trunk groups*, *Translator*…) |
| Web-based Tool / OXE Web Admin | Administration web simplifiée (selon version) |
| Console système (SSH) | Commandes de supervision et de maintenance (compte `mtcl`) |

Les opérations courantes (créer un utilisateur, changer un poste, modifier un renvoi) se font dans OmniVista 8770 ; `mgr` sert aux réglages système et quand l'interface graphique ne propose pas l'objet.

## Commandes du Call Server

Après connexion SSH (compte de maintenance `mtcl`, élévation `su` pour les tâches système) :

| Commande | Usage |
| --- | --- |
| `mgr` | Outil de gestion (menus : *Create*, *Review/Modify*, *Delete*, *Consult*) |
| `netadmin -m` | Configuration réseau du Call Server (adresses, rôles, redondance) |
| `swinst` | Installation et gestion des versions logicielles, sauvegardes/restaurations, démarrage automatique |
| `config` | Configuration matérielle (coupleurs, cartes des Media Gateways) |
| `infocs` | Informations sur le Call Server (version, rôle principal/secours) |
| `role` | Rôle du Call Server dans le duplex |
| `listerm <numéro>` | État d'un poste (type, enregistrement, adresse IP) |
| `tuner` | Visualiser/modifier les paramètres de licences et de capacités |
| `trkstat <faisceau>` | État d'un faisceau de lignes (trunks) |
| `compvisu` | Ressources de compression et transcodage |
| `incvisu` | Incidents en cours (journal des incidents du système) |

> [!NOTE]
> Les noms et options exacts dépendent de la version de l'OXE : utilisez l'aide en ligne et la documentation technique ALE (« Technical Communications »), réservée aux partenaires certifiés pour certaines procédures.

## Réseau d'accueil

| Sujet | Recommandation |
| --- | --- |
| VLAN voix | VLAN dédié, annoncé par **LLDP-MED** ou par DHCP (les postes ALE comprennent les options fournisseur pour VLAN et serveur) |
| DHCP | Serveur DHCP de l'OXE ou serveur d'entreprise avec les options ALE (adresse du Call Server, VLAN voix, serveur de mise à jour) |
| QoS | DSCP EF (46) pour la voix, marquage de la signalisation NOE/SIP, files prioritaires (voir [[01-fondamentaux/02-qualite-securite-dimensionnement\|QoS]]) |
| Commutateurs | OmniSwitch ALE ou autres (voir [[09-alcatel-lucent-enterprise/01-omniswitch-cli\|OmniSwitch]]), PoE |
| Sécurité | Chiffrement NOE (*IP Touch Security*), SIP TLS/SRTP, SBC pour les trunks SIP et télétravailleurs |

## Trunks SIP

La connexion d'un opérateur SIP s'effectue par une **passerelle SIP** de l'OXE (faisceau SIP, *SIP External Gateway*, proxy) ou via un **SBC** certifié (AudioCodes, Ribbon, Oracle). ALE et les opérateurs publient des guides d'interopérabilité à suivre précisément (paramètres d'authentification, format des numéros, codecs).

## Sauvegardes

- Sauvegardes automatiques de la base du Call Server (`swinst`, planification) vers un serveur distant ; OmniVista 8770 sauvegarde aussi sa propre base et peut planifier celle des OXE.
- Conservez les licences (fichier de licence lié au Call Server) et les versions logicielles installées.

## Dépannage

| Symptôme | Piste |
| --- | --- |
| Poste IP « en recherche » | VLAN voix, DHCP (options ALE), adresse du Call Server, `listerm` |
| Bascule principal/secours inattendue | Liaison entre CS, `role`, journaux d'incidents (`incvisu`) |
| Trunk SIP hors service | `trkstat`, trace SIP sur la passerelle ou le SBC |
| Audio absent entre sites | Ressources de compression (`compvisu`), QoS, codecs entre domaines IP |
| Fonction indisponible | Licence (`tuner`), catégorie de facilités du poste |

Pour l'écosystème réseau ALE (commutateurs, OmniVista 2500), voir [[09-alcatel-lucent-enterprise/02-omnivista-webview-depannage|OmniVista et dépannage]].
