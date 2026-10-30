---
title: Junos — CLI, commit et commutation EX/QFX
description: Équipements Juniper Networks sous Junos OS (commutateurs EX et QFX, routeurs MX et ACX, pare-feu SRX) — modes opérationnel et configuration, hiérarchie et commandes set/delete/show, candidate et commit (commit check, commit confirmed, rollback, show compare), configuration initiale (root, utilisateurs, SSH, NTP, syslog), interfaces et unités logiques, VLAN et ports access/trunk (style ELS), agrégats LACP (ae), RSTP, Virtual Chassis, routage statique et OSPF, outils graphiques (J-Web, Juniper Mist, Junos Space, Apstra) et dépannage.
tags: [juniper, junos, ex, qfx, commit, rollback, vlan, mist, j-web]
icon: terminal
---

**Juniper Networks** utilise un système unique, **Junos OS** (et Junos OS Evolved), sur toute sa gamme : commutateurs **EX** (accès, campus) et **QFX** (centre de données), routeurs **MX**/**ACX**/**PTX**, pare-feu **SRX** (voir [[02-srx-securite-depannage|SRX]]). Sa CLI hiérarchique avec **configuration candidate**, **commit** et **rollback** a inspiré de nombreux autres constructeurs.

## Modes et principes

```junos
root@:RE:0% cli                          # depuis le shell (connexion root)
root> show version                       # mode opérationnel (>)
root> configure                          # mode configuration (#)
[edit]
root# set system host-name EX-PARIS-01
root# show | compare                     # différences avec la configuration active
root# commit check                       # vérifier sans appliquer
root# commit confirmed 5                 # appliquer, retour arrière automatique dans 5 min sans confirmation
root# commit                             # confirmer
root# rollback 1                         # recharger la configuration précédente (dans la candidate)
root# exit
```

| Commande | Effet |
| --- | --- |
| `set` / `delete` / `deactivate` | Ajouter / supprimer / désactiver sans supprimer |
| `edit <hiérarchie>` / `up` / `top` | Se déplacer dans la hiérarchie |
| `show` (configuration) | Candidate au format accolades ; `show \| display set` au format commandes |
| `run <commande>` | Commande opérationnelle depuis la configuration |
| `commit comment "…"` | Commentaire visible dans `show system commit` |
| `rollback <n>` | 50 configurations précédentes conservées (`rollback ?`) |
| `load merge terminal` / `load override` | Coller ou remplacer une configuration |
| `request system configuration rescue save` | Configuration de secours |
| `\| match`, `\| except`, `\| count`, `\| no-more` | Filtres de sortie |

> [!TIP]
> `commit confirmed` est le réflexe à adopter pour toute modification à distance qui pourrait couper l'accès : sans `commit` de confirmation, Junos revient automatiquement à la configuration précédente.

## Configuration initiale

```junos
set system root-authentication plain-text-password
set system login user jdupont class super-user authentication plain-text-password
set system services ssh root-login deny
set system services ssh protocol-version v2
delete system services telnet
set system ntp server 10.0.10.123
set system time-zone Europe/Paris
set system name-server 10.0.10.53
set system syslog host 10.0.98.20 any notice
set snmp v3 usm local-engine user supervision authentication-sha256 authentication-password "MotDePasseAuth2026"
set interfaces irb unit 99 family inet address 10.0.99.21/24
set vlans ADMIN vlan-id 99 l3-interface irb.99
set routing-options static route 0.0.0.0/0 next-hop 10.0.99.1
commit
```

Le `root-authentication` est obligatoire avant le premier commit. Les classes de connexion (`super-user`, `operator`, `read-only` ou personnalisées) et l'authentification RADIUS/TACACS+ gèrent les droits.

## Interfaces, VLAN, trunk (EX/QFX, style ELS)

```junos
set vlans UTILISATEURS vlan-id 20
set vlans VOIX vlan-id 40
set interfaces ge-0/0/5 description "Poste bureau 12"
set interfaces ge-0/0/5 unit 0 family ethernet-switching interface-mode access vlan members UTILISATEURS
set switch-options voip interface ge-0/0/5.0 vlan VOIX
set interfaces xe-0/1/0 description "Uplink coeur"
set interfaces xe-0/1/0 unit 0 family ethernet-switching interface-mode trunk vlan members [ UTILISATEURS VOIX ADMIN ]
commit
```

Les interfaces se nomment `type-fpc/pic/port` (`ge-0/0/5`, `xe-0/1/0`, `et-0/0/48`) et portent des **unités logiques** (`unit 0`) où l'on déclare les familles (`inet`, `inet6`, `ethernet-switching`). L'interface routée d'un VLAN est une **`irb.<n>`**.

## Agrégats, spanning tree, Virtual Chassis

```junos
set chassis aggregated-devices ethernet device-count 4
set interfaces xe-0/1/0 ether-options 802.3ad ae0
set interfaces xe-1/1/0 ether-options 802.3ad ae0
set interfaces ae0 aggregated-ether-options lacp active
set interfaces ae0 unit 0 family ethernet-switching interface-mode trunk vlan members all
set protocols rstp bridge-priority 4k
set protocols rstp interface ge-0/0/5 edge
set protocols rstp bpdu-block-on-edge
commit
```

**Virtual Chassis** regroupe jusqu'à 10 commutateurs EX en un équipement logique (un maître, un secours, des membres en *line card*) :

```junos
show virtual-chassis
show virtual-chassis vc-port
request virtual-chassis renumber member-id 3 new-member-id 2
```

## Routage

```junos
set routing-options router-id 10.255.0.1
set protocols ospf area 0.0.0.0 interface irb.20 passive
set protocols ospf area 0.0.0.0 interface xe-0/1/2.0 interface-type p2p
commit
run show ospf neighbor
run show route 10.60.0.0/16
```

## Outils graphiques

| Outil | Usage |
| --- | --- |
| **J-Web** | Interface web embarquée (assistant, tableau de bord, configuration de base, CLI intégrée) — à limiter au réseau d'administration |
| **Juniper Mist** (Wired/WAN Assurance) | Cloud : adoption « zero-touch » (le commutateur EX/SRX se connecte à Mist), modèles, supervision, assistant IA **Marvis** |
| Junos Space Network Director / Security Director | Gestion sur site (historique) ; Security Director Cloud pour les SRX |
| **Apstra** | Automatisation des fabrics de centre de données (EVPN-VXLAN) multi-constructeurs |

## Dépannage

```junos
show interfaces terse
show interfaces ge-0/0/5 extensive | match "error|drops"
show ethernet-switching table vlan-name UTILISATEURS
show ethernet-switching interface ge-0/0/5
show lldp neighbors
show spanning-tree bridge
show lacp interfaces
show log messages | last 50
show system alarms
show chassis alarms
show system commit
monitor traffic interface ge-0/0/5 no-resolve
request support information | save /var/tmp/rsi.txt
```

| Symptôme | Cause | Solution |
| --- | --- | --- |
| `commit` refusé | Erreur de syntaxe ou de cohérence (VLAN inexistant, root sans mot de passe) | Lire le message, `commit check` |
| Accès perdu après modification | Modification non confirmée correctement | `commit confirmed` (retour automatique) ; sinon console et `rollback 1` |
| Port en `ethernet-switching` sans trafic | Mauvais VLAN, `interface-mode` absent | `show ethernet-switching interface` |
| Port bloqué par BPDU | `bpdu-block-on-edge` | `clear error bpdu interface ge-0/0/5` |
