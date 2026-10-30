---
title: OmniSwitch — CLI AOS
description: Commutateurs Alcatel-Lucent Enterprise OmniSwitch (OS2260, OS2360, OS6360, OS6560, OS6860, OS6900) sous AOS 6 et AOS 8 — répertoires working et certified, enregistrement et certification de la configuration, accès et sécurisation, VLAN (untagged/tagged), agrégats et LACP, Spanning Tree, Virtual Chassis, routage IP, sauvegarde et mise à jour.
tags: [alcatel-lucent, ale, omniswitch, aos, vlan, virtual chassis, linkagg, commutateur]
icon: terminal
---

Les **OmniSwitch** d'**Alcatel-Lucent Enterprise** (ALE) sont très présents dans les collectivités, l'enseignement, la santé et l'industrie en France. Leur système **AOS** (6 ou 8 selon la génération) a une logique propre, notamment la gestion de la configuration en deux répertoires.

## Configuration : working et certified

| Répertoire | Rôle |
| --- | --- |
| `/flash/working` | Configuration et images en cours de validation |
| `/flash/certified` | Copie **validée** (référence de secours) |
| Fichier | `vcboot.cfg` (AOS 8) / `boot.cfg` (AOS 6) |

```aos
-> write memory                                   ! enregistre la configuration courante dans working
-> copy running-config working                    ! (AOS 6) équivalent
-> copy running certified                         ! (AOS 8) certifie : copie working vers certified
-> copy working certified                         ! (AOS 6)
-> show running-directory                         ! répertoire de démarrage, état de synchronisation
-> reload from working no rollback-timeout        ! redémarrer sur working
```

> [!IMPORTANT]
> Si le commutateur démarre depuis **certified** (après un problème), les modifications enregistrées dans *working* ne sont pas actives. Vérifiez `show running-directory` avant d'intervenir, et **certifiez** seulement une configuration éprouvée.

## Accès et sécurisation

```aos
-> system name SW-ACCES-B2
-> system timezone CET
-> ntp server 10.0.10.123
-> ntp client admin-state enable
-> user admin password MotDePasseAdminTresLong
-> aaa authentication ssh local
-> aaa authentication console local
-> aaa authentication http local
-> ip service telnet admin-state disable
-> ip service ssh admin-state enable
-> ip service http admin-state disable
-> ip service https admin-state enable
-> swlog output socket 10.0.98.20
-> snmp security privacy all
```

Le compte d'administration par défaut (`admin` / `switch` sur les anciennes versions) doit être modifié immédiatement. RADIUS/TACACS+ : `aaa radius-server`, puis `aaa authentication ssh RADIUS-NPS local`.

## VLAN

```aos
-> vlan 20 admin-state enable name "UTILISATEURS"
-> vlan 30 admin-state enable name "TELEPHONIE"
-> vlan 20 members port 1/1/1-44 untagged          ! AOS 8 (AOS 6 : vlan 20 port default 1/1-44)
-> vlan 30 members port 1/1/1-44 tagged
-> vlan 20 members linkagg 1 tagged
-> show vlan
-> show vlan members
```

## Agrégats (linkagg)

```aos
-> linkagg lacp agg 1 size 2 admin-state enable
-> linkagg lacp agg 1 actor admin-key 1
-> linkagg lacp port 1/1/49-50 actor admin-key 1
-> show linkagg
-> show linkagg port
```

## Spanning Tree

```aos
-> spantree mode flat                               ! flat (MSTP/RSTP sur une instance) ou per-vlan (1x1)
-> spantree protocol mstp
-> spantree msti 1 vlan 20 30
-> spantree cist priority 4096
-> spantree port 1/1/1-44 admin-edge enable
-> show spantree
```

## Virtual Chassis

Les OmniSwitch 6860, 6900, 6560 (AOS 8) forment un **Virtual Chassis** (jusqu'à 8 membres selon le modèle) par des liens VFL (*Virtual Fabric Link*) :

```aos
-> virtual-chassis configured-chassis-id 1
-> virtual-chassis vf-link 0 create
-> virtual-chassis vf-link 0 member-port 1/1/A
-> virtual-chassis configured-chassis-priority 200
-> show virtual-chassis topology
-> show virtual-chassis consistency
```

## Routage

```aos
-> ip interface "VLAN20" address 10.0.20.1 mask 255.255.255.0 vlan 20
-> ip static-route 0.0.0.0/0 gateway 10.0.0.1
-> ip load ospf
-> ip ospf area 0.0.0.0
-> ip ospf interface "VLAN20"
-> ip ospf interface "VLAN20" area 0.0.0.0
-> ip ospf interface "VLAN20" admin-state enable
-> ip ospf admin-state enable
-> ip helper address 10.0.10.67
-> show ip routes
```

## Sauvegarde et mise à jour

- Sauvegarder `/flash/working` et `/flash/certified` (SFTP/SCP) — les fichiers de configuration sont du texte lisible.
- Mise à jour : copier les images (`.img`) dans `/flash/working`, `reload from working rollback-timeout 15`, vérifier, puis `copy running certified`. Le *rollback-timeout* fait redémarrer sur *certified* si l'opération n'est pas confirmée.

Suite : [[02-omnivista-webview-depannage|WebView, OmniVista et dépannage]].
