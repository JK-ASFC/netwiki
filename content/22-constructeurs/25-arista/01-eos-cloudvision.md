---
title: Arista EOS — CLI, sessions de configuration, MLAG, eAPI et CloudVision
description: Commutateurs Arista (centre de données et campus) sous EOS — CLI proche de Cisco IOS, accès au shell Linux, sessions de configuration (diff, commit, commit timer, abort), points de reprise et remplacement de configuration, configuration initiale (VRF de gestion, utilisateurs, AAA), VLAN et agrégats, MLAG, routage BGP et EVPN-VXLAN (aperçu), ZTP, eAPI (JSON-RPC), CloudVision (CVP, CVaaS, CV-CUE), Arista Validated Designs, commandes de vérification et dépannage.
tags: [arista, eos, mlag, evpn, vxlan, eapi, cloudvision, ztp]
icon: terminal
---

**Arista Networks** s'est imposé dans les **centres de données** (commutateurs 7000, fabrics leaf-spine) puis le campus (séries 720, 750, Wi-Fi). Le système **EOS** offre une CLI très proche de [[02-cisco-ios-bases/01-cli-fondamentaux|Cisco IOS]], un noyau Linux accessible, une base d'états (SysDB) et des API programmables ; **CloudVision** en est la plateforme de gestion.

## CLI et shell

```eos
switch> enable
switch# configure terminal
switch(config)# hostname LEAF-01
switch(config)# end
switch# show running-config diffs
switch# write memory
switch# bash
[admin@LEAF-01 ~]$ ip -br addr
[admin@LEAF-01 ~]$ exit
```

Les commandes `show` acceptent `| json` pour une sortie structurée, et la plupart des filtres IOS (`| include`, `| section`, `| begin`).

## Sessions de configuration

Les **sessions** préparent un ensemble de changements, appliqués d'un bloc :

```eos
configure session AJOUT-VLAN30
vlan 30
   name SERVEURS
interface Ethernet12
   switchport access vlan 30
show session-config diffs
commit timer 00:05:00
```

Après `commit timer`, la configuration est appliquée mais **annulée automatiquement** au bout de 5 minutes sans confirmation (`configure session AJOUT-VLAN30 commit`). `abort` abandonne la session. Les **points de reprise** offrent un retour arrière complet :

```eos
configure checkpoint save AVANT-MAINTENANCE
configure replace checkpoint:AVANT-MAINTENANCE
```

## Configuration initiale

```eos
vrf instance MGMT
interface Management1
   vrf MGMT
   ip address 10.0.99.30/24
ip route vrf MGMT 0.0.0.0/0 10.0.99.1
username jdupont privilege 15 role network-admin secret MotDePasseLongEtUnique
no aaa root
ip name-server vrf MGMT 10.0.10.53
ntp server vrf MGMT 10.0.10.123
clock timezone Europe/Paris
logging vrf MGMT host 10.0.98.20
management ssh
   vrf MGMT
      no shutdown
management api http-commands
   protocol https
   no shutdown
   vrf MGMT
      no shutdown
```

L'interface `Management1` dans une **VRF de gestion** isole l'administration du trafic de production. TACACS+/RADIUS et les rôles (`network-admin`, `network-operator` ou personnalisés) gèrent les droits.

## VLAN, agrégats, MLAG

**MLAG** associe deux commutateurs pour former des agrégats répartis sur les deux (équivalent du vPC Cisco) :

```eos
vlan 4094
   trunk group MLAGPEER
no spanning-tree vlan-id 4094
interface Port-Channel10
   description Lien de pairs MLAG
   switchport mode trunk
   switchport trunk group MLAGPEER
interface Ethernet49-50
   channel-group 10 mode active
interface Vlan4094
   ip address 10.255.255.1/30
mlag configuration
   domain-id MLAG-A
   local-interface Vlan4094
   peer-address 10.255.255.2
   peer-link Port-Channel10
interface Port-Channel20
   description Serveur ESX-01
   switchport mode trunk
   switchport trunk allowed vlan 20,30
   mlag 20
interface Ethernet1
   channel-group 20 mode active
```

Configuration miroir sur le second commutateur (adresses inversées). Vérification : `show mlag`, `show mlag config-sanity`, `show mlag interfaces`.

## Routage et EVPN-VXLAN

Dans un fabric leaf-spine, chaque leaf établit des sessions **BGP** avec les spines (underlay) et des sessions **EVPN** (overlay) ; les VLAN sont transportés dans des **VXLAN** (interface `Vxlan1`, VNI). La conception et la génération de ces configurations se font de préférence avec **Arista Validated Designs** (AVD, collection Ansible) ou **CloudVision Studios** plutôt qu'à la main.

## Outils graphiques et automatisation

| Outil | Usage |
| --- | --- |
| **CloudVision** (CVP sur site, **CVaaS** dans le cloud) | Inventaire, configurations (configlets, **Studios**), *change control* avec validation et retour arrière, conformité, télémétrie en continu (agent TerminAttr), mises à jour d'EOS |
| CV-CUE | Gestion du Wi-Fi Arista |
| **ZTP** | Démarrage sans configuration : récupération d'un script ou d'une configuration via DHCP (`zerotouch cancel` pour l'interrompre) |
| **eAPI** | API JSON-RPC sur HTTPS : envoie des commandes CLI et reçoit des réponses JSON |
| AVD, Ansible `arista.eos`, Terraform | Infrastructure as Code |

```bash
curl -s -k -u automatisation https://10.0.99.30/command-api -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","method":"runCmds","params":{"version":1,"cmds":["show version"],"format":"json"},"id":"1"}' | jq '.result[0].version'
```

## Vérification et dépannage

```eos
show version
show interfaces status
show interfaces counters errors
show lldp neighbors
show port-channel summary
show spanning-tree
show ip route
show ip bgp summary
show bgp evpn summary
show vxlan vtep
show logging last 30 minutes
show tech-support | gzip > flash:tech.gz
```

| Symptôme | Cause | Solution |
| --- | --- | --- |
| MLAG `inactive` ou `config-sanity` en erreur | Configurations différentes entre pairs, lien de pairs | `show mlag config-sanity`, aligner VLAN et paramètres |
| Port-channel MLAG non agrégé | Numéro `mlag` différent sur les deux pairs | Même identifiant `mlag` des deux côtés |
| Modifications perdues | `write memory` oublié (ou session non validée) | Sauvegarder, utiliser les sessions |
| Équipement neuf en boucle ZTP | Pas de serveur ZTP | `zerotouch cancel` (redémarrage) |
