---
title: Présentation, accès, ASDM et interfaces
description: Pare-feu Cisco ASA (5500-X, Firepower en mode ASA, ASAv) et place de Firepower Threat Defense (FTD) avec FMC/FDM — accès console, SSH et ASDM (interface graphique Java), configuration initiale, interfaces nommées, niveaux de sécurité et sous-interfaces, routage, différences de syntaxe avec IOS, sauvegarde et mise à jour de l'image et d'ASDM.
tags: [cisco, asa, asdm, ftd, firepower, pare-feu, interfaces, niveaux de sécurité]
icon: shield
---

L'**ASA** (*Adaptive Security Appliance*) est le pare-feu historique de Cisco : très répandu, CLI proche d'IOS, administration graphique par **ASDM**. Sur le matériel **Firepower** (1000, 2100, 3100, 4200), Cisco propose aussi **FTD** (*Firepower Threat Defense* : pare-feu nouvelle génération avec IPS Snort, filtrage applicatif), géré par **FMC** (*Firewall Management Center*) ou **FDM** (gestionnaire local), voire le service cloud **CDO / Security Cloud Control**. Le même boîtier fonctionne **soit** en ASA, **soit** en FTD (choix de l'image).

| | ASA | FTD |
| --- | --- | --- |
| Gestion | CLI, **ASDM**, CSM (historique) | **FMC**, FDM, Security Cloud Control (CLI très limitée) |
| Fonctions | Pare-feu à états, NAT, VPN (AnyConnect/Secure Client, site à site) | + IPS, filtrage d'URL, applications, analyse de fichiers |
| Usage actuel | Parc existant, VPN d'accès distant | Nouveaux projets de pare-feu Cisco |

## Accès et configuration initiale

Console : câble console Cisco, **9600 8N1**.

```asa
ciscoasa> enable
ciscoasa# configure terminal
ciscoasa(config)# hostname FW-PARIS
domain-name corp.exemple.fr
enable password MotDePasseEnableTresLong
username admin password MotDePasseAdminTresLong privilege 15
aaa authentication ssh console LOCAL
aaa authentication http console LOCAL
aaa authorization exec LOCAL auto-enable
!
crypto key generate rsa modulus 3072
! SSH autorisé depuis le réseau d'administration, sur l'interface inside
ssh 10.0.99.0 255.255.255.0 inside
ssh version 2
ssh timeout 10
ssh key-exchange group dh-group14-sha256
!
! ASDM / HTTPS
http server enable
http 10.0.99.0 255.255.255.0 inside
!
ntp server 10.0.10.123 source inside
logging enable
logging timestamp
logging trap informational
logging host inside 10.0.98.20
write memory
```

## ASDM (interface graphique)

**ASDM** (*Adaptive Security Device Manager*) est une application Java (lanceur Windows/macOS téléchargé depuis `https://<ip-asa>`) : assistant de démarrage, interfaces, règles d'accès, NAT, VPN (assistants), surveillance en temps réel, **Packet Tracer** graphique, journaux.

```asa
show asdm image
! image ASDM compatible avec la version d'ASA
asdm image disk0:/asdm-7221.bin
```

L'image ASDM doit être compatible avec la version d'ASA (matrice de compatibilité). ASDM n'existe pas pour FTD.

## Interfaces et niveaux de sécurité

Chaque interface a un **nom** (`nameif`) et un **niveau de sécurité** (0 à 100). Sans ACL, le trafic est autorisé d'un niveau **élevé vers un niveau plus faible** (et les retours), interdit dans l'autre sens.

```asa
interface GigabitEthernet0/0
 description Internet
 nameif outside
 security-level 0
 ip address 203.0.113.2 255.255.255.248
!
interface GigabitEthernet0/1
 no nameif
 no ip address
interface GigabitEthernet0/1.10
 vlan 10
 nameif inside
 security-level 100
 ip address 10.0.10.254 255.255.255.0
interface GigabitEthernet0/1.30
 vlan 30
 nameif dmz
 security-level 50
 ip address 10.0.30.254 255.255.255.0
!
! autoriser le trafic entre interfaces de même niveau
same-security-traffic permit inter-interface
!
route outside 0.0.0.0 0.0.0.0 203.0.113.1 1
route inside 10.0.0.0 255.0.0.0 10.0.10.1 1
!
show interface ip brief
show nameif
show route
```

Différences de syntaxe avec IOS : **masques réseau** classiques (et non génériques) dans les ACL, `show running-config` filtrable mais pas de `do` en mode configuration sur les anciennes versions, `write memory` identique, `copy` vers `disk0:`.

## Sauvegarde et mise à jour

```asa
copy running-config scp://sauvegarde@10.0.98.30/configs/FW-PARIS.cfg
! affiche aussi les clés pré-partagées en clair (à protéger)
more system:running-config
!
copy scp://depot@10.0.98.30/images/asa9-20-3-smp-k8.bin disk0:
boot system disk0:/asa9-20-3-smp-k8.bin
write memory
reload
show version
```

Choisir une version maintenue (« suggested release ») ; en **failover**, mettre à jour le secondaire, basculer, puis le primaire (mise à jour sans coupure). Sur Firepower en mode ASA, l'image se met à jour via FXOS (selon le modèle).

Suite : [[02-objets-nat-acl|objets, NAT et règles d'accès]].
