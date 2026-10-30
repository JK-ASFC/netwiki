---
title: AOS-CX — CLI
description: Commutateurs Aruba CX (6100, 6200, 6300, 6400, 8100, 8360, 10000) sous AOS-CX — système moderne à base de données et API REST, CLI proche de Cisco, VRF de gestion, comptes et RBAC, VLAN et interfaces, LAG et LACP, VSF (empilement 6200/6300), VSX (paire de cœur avec multi-châssis LAG), routage, 802.1X avec rôles, checkpoints et retour arrière, mise à jour, diagnostics (Network Analytics Engine).
tags: [aruba, aos-cx, cx, vsx, vsf, lag, vlan, checkpoint]
icon: terminal
---

**AOS-CX** est le système d'exploitation récent des commutateurs Aruba CX : architecture à base de données d'état, **API REST** complète, **checkpoints** de configuration, analyse embarquée (NAE). Sa CLI est **proche de Cisco IOS** (interfaces configurées en contexte interface, `vlan access`, `vlan trunk allowed`), ce qui facilite la transition — à la différence d'[[01-aos-switch-cli|ArubaOS-Switch]].

## Bases

```aoscx
switch# configure terminal
switch(config)# hostname SW-COEUR-01
switch(config)# user admin group administrators password plaintext MotDePasseAdminTresLong
switch(config)# ssh server vrf mgmt
switch(config)# https-server vrf mgmt
switch(config)# ntp server 10.0.10.123 iburst
switch(config)# ntp enable
switch(config)# logging 10.0.98.20 vrf mgmt
switch(config)# write memory
```

| Commande | Effet |
| --- | --- |
| `show running-config` / `show startup-config` | Configurations |
| `write memory` (ou `copy running-config startup-config`) | Enregistrer |
| `show interface brief` | État des ports |
| `show vlan` | VLAN et ports |
| `show lldp neighbor-info` | Voisins |
| `show system` / `show version` | Informations système |

Le port de gestion hors bande (`mgmt`) est dans la **VRF `mgmt`** ; les services d'administration (SSH, HTTPS, SNMP, syslog) doivent y être activés explicitement.

## VLAN et interfaces

```aoscx
vlan 10,20,30,99
vlan 20
    name UTILISATEURS
!
interface 1/1/10
    description Poste B2-10
    no shutdown
    vlan access 20
    spanning-tree port-type admin-edge
    spanning-tree bpdu-guard
!
interface 1/1/49
    description Uplink vers SW-COEUR
    no shutdown
    vlan trunk native 998
    vlan trunk allowed 10,20,30,99
!
interface vlan 20
    ip address 10.0.20.1/24
    ip helper-address 10.0.10.67
```

## LAG

```aoscx
interface lag 1
    no shutdown
    vlan trunk native 998
    vlan trunk allowed 10,20,30,99
    lacp mode active
interface 1/1/49-1/1/50
    no shutdown
    lag 1
show lacp interfaces
show lag
```

## VSF et VSX

| Technologie | Usage | Principe |
| --- | --- | --- |
| **VSF** | Accès (6200, 6300) | Empilement : un plan de contrôle unique pour jusqu'à 10 membres |
| **VSX** | Cœur / agrégation (6400, 8xxx, 10000) | Deux commutateurs **indépendants** (deux plans de contrôle) synchronisés, avec **LAG multi-châssis** vers l'accès et passerelle active des deux côtés ; mises à jour sans coupure |

```aoscx VSX (extrait, commutateur primaire)
interface lag 256
    no shutdown
    description ISL VSX
    vlan trunk native 1
    vlan trunk allowed all
    lacp mode active
interface 1/1/53-1/1/54
    lag 256
vsx
    system-mac 02:00:00:00:01:00
    inter-switch-link lag 256
    role primary
    keepalive peer 192.168.255.2 source 192.168.255.1 vrf KEEPALIVE
    vsx-sync vsx-global
interface lag 10 multi-chassis
    no shutdown
    vlan trunk allowed 10,20,30,99
    lacp mode active
interface vlan 20
    active-gateway ip mac 12:00:00:00:01:00
    active-gateway ip 10.0.20.1
show vsx status
show vsx config-consistency
```

## 802.1X et rôles

AOS-CX applique des **rôles** (VLAN, ACL, QoS) renvoyés par le serveur RADIUS ou définis localement ; avec **ClearPass** ou Central NAC, les politiques sont centralisées.

```aoscx
radius-server host 10.0.10.81 key plaintext CleRadiusTresLongue vrf default
aaa group server radius NAC
    server 10.0.10.81
aaa authentication port-access dot1x authenticator
    radius server-group NAC
    enable
aaa authentication port-access mac-auth
    radius server-group NAC
    enable
interface 1/1/10
    aaa authentication port-access dot1x authenticator
        enable
    aaa authentication port-access mac-auth
        enable
show port-access clients
```

## Checkpoints et retour arrière

```aoscx
! appliquer les changements et revenir automatiquement en arrière dans 10 minutes sans confirmation
checkpoint auto 10
checkpoint auto confirm
copy running-config checkpoint AVANT-VLAN40
show checkpoint
checkpoint diff AVANT-VLAN40 running-config
checkpoint rollback AVANT-VLAN40
```

## Mise à jour

```aoscx
copy sftp://depot@10.0.98.30/images/ArubaOS-CX_6300-6200_10_13_1010.swi primary vrf mgmt
boot system primary
show images
```

Deux images (*primary*/*secondary*) ; en VSX, `vsx update-software` met à jour la paire sans coupure.

## API REST

```bash
curl -sk -c cookie -X POST "https://10.0.99.21/rest/v10.13/login?username=admin&password=MotDePasse"
curl -sk -b cookie "https://10.0.99.21/rest/v10.13/system/interfaces?depth=1" | jq 'keys'
curl -sk -b cookie -X POST "https://10.0.99.21/rest/v10.13/logout"
```

Collection Ansible `arubanetworks.aoscx`, fournisseurs Terraform ; voir [[01-ansible/03-automatisation-reseau|automatisation réseau]].

Suite : [[03-interfaces-graphiques-central|interfaces graphiques, NetEdit et Central]].
