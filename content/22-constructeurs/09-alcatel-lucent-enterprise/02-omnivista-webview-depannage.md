---
title: WebView, OmniVista et dépannage
description: Gestion graphique des OmniSwitch — WebView (interface web intégrée), OmniVista 2500 NMS (sur site : découverte, topologie, configuration, sauvegardes, mises à jour, UPAM pour 802.1X), OmniVista Cirrus (cloud), Access Guardian et UNP pour l'accès réseau (profils, 802.1X, MAB), intégration téléphonie ALE (OmniPCX), commandes de diagnostic AOS et problèmes fréquents.
tags: [alcatel-lucent, omniswitch, omnivista, webview, unp, access guardian, dépannage]
icon: monitor
---

## WebView

Interface web intégrée (`https://<ip>` après `ip service https admin-state enable`) : tableau de bord, configuration des VLAN et ports, agrégats, routage, sécurité, journaux, gestion des fichiers et de la configuration (enregistrement, certification). Adaptée à des interventions ponctuelles.

## OmniVista 2500 NMS

**OmniVista 2500** (logiciel sur site, VM) est la plateforme de gestion d'ALE :

| Fonction | Description |
| --- | --- |
| Découverte et **topologie** | Carte du réseau OmniSwitch et Wi-Fi Stellar |
| Configuration | Assistants (VLAN, profils), envoi de scripts CLI à plusieurs équipements |
| **Sauvegardes** et comparaison | Planification des sauvegardes de configuration |
| Mises à jour | Déploiement des versions d'AOS |
| **UPAM** | Serveur d'authentification intégré (802.1X, MAB, portail captif, invités, BYOD) |
| Supervision, analyse | Alarmes, statistiques, analyse des applications (selon modules) |

**OmniVista Cirrus** : équivalent **cloud** (abonnement) pour les commutateurs et points d'accès Stellar.

## Accès réseau : Access Guardian et UNP

ALE structure l'accès en **profils UNP** (*Universal Network Profile*) : un profil définit le VLAN, la QoS et les ACL appliqués à un utilisateur ou un équipement, attribué par **802.1X**, **MAB** ou des règles de classification (MAC, adresse IP, LLDP).

```aos
-> unp profile "Employes"
-> unp profile-map vlan profile-name "Employes" vlan 20
-> unp port-template "Acces" direction both 802.1x-authentication enable mac-authentication enable
-> unp port 1/1/1-44 port-template "Acces"
-> aaa radius-server "NPS" host 10.0.10.81 key CleRadiusTresLongue
-> aaa device-authentication 802.1x "NPS"
-> aaa device-authentication mac "NPS"
-> show unp user
```

Le serveur RADIUS renvoie le nom du profil (attribut `Filter-Id` / VSA ALE) : voir [[01-freeradius/08-8021x-vlan-dynamique-mab|802.1X et VLAN dynamique]].

## Téléphonie ALE

Les OmniSwitch s'intègrent naturellement avec les autocommutateurs **ALE OmniPCX Enterprise / Office** et les téléphones ALE : VLAN voix par LLDP-MED, QoS, PoE. Le même principe vaut pour d'autres systèmes de téléphonie (voir [[27-mitel/01-reseau-telephonie-ip|prérequis réseau de la téléphonie IP]]).

## Dépannage

| Besoin | Commande |
| --- | --- |
| Synthèse | `show system`, `show chassis`, `show microcode` (version) |
| Ports | `show interfaces status`, `show interfaces 1/1/10`, `show interfaces counters errors` |
| VLAN | `show vlan members port 1/1/10` |
| MAC | `show mac-learning port 1/1/10`, `show mac-learning mac-address 00:50:56:aa:bb:01` |
| Voisins | `show lldp remote-system` |
| Journaux | `show log swlog` |
| Configuration | `show configuration snapshot`, `show running-directory` |
| Support | `show tech-support eng complete` |
| Accès | `show unp user`, `show aaa-device all-users` |

| Symptôme | Cause | Solution |
| --- | --- | --- |
| Modifications perdues au redémarrage | Démarrage sur *certified*, `write memory` oublié | `show running-directory`, enregistrer puis certifier |
| « Certify needed » | *working* et *certified* différents | `copy running certified` (après validation) |
| Port dans le mauvais VLAN | Profil UNP appliqué par l'authentification | `show unp user`, réponse RADIUS |
| Virtual Chassis incohérent | Versions ou paramètres différents entre membres | `show virtual-chassis consistency` |
| Agrégat non formé avec un autre constructeur | Clés LACP, mode statique | `linkagg lacp`, mêmes paramètres des deux côtés |

Comparaison avec les autres CLI : [[01-correspondance-commandes/01-administration-commutation|correspondance des commandes]].
