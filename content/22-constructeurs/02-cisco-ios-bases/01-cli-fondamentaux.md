---
title: CLI IOS / IOS XE — fondamentaux
description: Bases communes à tous les équipements Cisco IOS et IOS XE — accès console (câble, paramètres série) et SSH, modes utilisateur, privilégié et configuration, aide et raccourcis, configuration initiale sécurisée (nom, domaine, secrets, utilisateurs, SSH v2, bannières, VTY, journalisation, NTP), running-config et startup-config, filtrage des sorties, sauvegarde, archive et rollback, mise à jour d'IOS XE (mode install), récupération de mot de passe.
tags: [cisco, ios, ios xe, cli, ssh, configuration initiale, sauvegarde, rollback]
icon: terminal
---

Les routeurs (ISR, Catalyst 8000), commutateurs Catalyst et de nombreux autres équipements Cisco partagent le même système d'exploitation **IOS** ou sa version modulaire **IOS XE** (noyau Linux, même CLI). Les commandes de cette page sont valables sur les [[03-cisco-routeurs/01-interfaces-routage|routeurs]] et les [[04-cisco-commutateurs/01-vlan-trunk-stp|commutateurs]] ; les pare-feu [[05-cisco-asa/01-presentation-acces-interfaces|ASA]] ont une CLI proche mais distincte.

## Accès

| Accès | Paramètres |
| --- | --- |
| **Console** | Câble RJ45 bleu (*rollover*) ou USB-C/mini-USB ; **9600 bauds, 8 bits, sans parité, 1 bit d'arrêt, sans contrôle de flux** ([[01-acces-administration/01-putty\|PuTTY]], Tera Term, `screen /dev/ttyUSB0 9600`) |
| **SSH** | Après configuration (voir plus bas) |
| Port de gestion | `GigabitEthernet0/0` (Mgmt) dans la VRF `Mgmt-intf` / `Mgmt-vrf` sur IOS XE |
| Telnet | À désactiver |

## Modes et navigation

```cisco
Router>                         ! mode utilisateur (consultation limitée)
Router> enable
Router#                         ! mode privilégié (show, copy, debug, reload)
Router# configure terminal
Router(config)#                 ! configuration globale
Router(config)# interface GigabitEthernet0/0/1
Router(config-if)#              ! sous-mode interface
Router(config-if)# end          ! retour en mode privilégié (Ctrl+Z)
Router# exit
```

| Aide | Effet |
| --- | --- |
| `?` | Commandes ou paramètres possibles |
| <kbd>Tab</kbd> | Complétion ; les commandes peuvent être abrégées (`sh ip int br`) |
| `do show …` | Exécuter une commande `show` depuis le mode configuration |
| `no <commande>` | Annuler une commande |
| `default interface Gi0/1` | Remettre une interface à sa configuration par défaut |
| <kbd>Ctrl</kbd>+<kbd>Maj</kbd>+<kbd>6</kbd> | Interrompre un ping/traceroute |
| `terminal length 0` | Pas de pagination (scripts, copies de sorties) |

## Configuration initiale sécurisée

```cisco
hostname R1-PARIS
ip domain name corp.exemple.fr
! évite les résolutions sur les fautes de frappe
no ip domain lookup
enable algorithm-type scrypt secret MotDePasseEnableTresLong
username admin privilege 15 algorithm-type scrypt secret MotDePasseAdminTresLong
service password-encryption
security passwords min-length 12
login block-for 120 attempts 5 within 60
!
crypto key generate rsa modulus 3072 label SSH
ip ssh version 2
ip ssh time-out 60
ip ssh authentication-retries 3
!
ip access-list standard ACL-ADMIN
 permit 10.0.99.0 0.0.0.255
 deny any log
line vty 0 15
 access-class ACL-ADMIN in
 transport input ssh
 login local
 exec-timeout 10 0
line con 0
 login local
 exec-timeout 10 0
 logging synchronous
!
banner login ^
Accès réservé aux personnes autorisées. Toute connexion est journalisée.
^
!
service timestamps log datetime msec localtime show-timezone
clock timezone CET 1 0
clock summer-time CEST recurring last Sun Mar 2:00 last Sun Oct 3:00
ntp server 10.0.10.123 prefer
logging host 10.0.98.20
logging trap informational
no ip http server
! seulement si l'interface web est utilisée
ip http secure-server
```

L'authentification centralisée (**AAA** avec RADIUS ou TACACS+) est détaillée dans [[01-freeradius/09-administration-equipements|FreeRADIUS — administration des équipements]] et [[02-nps/02-8021x-vpn-equipements-depannage|NPS]] : `aaa new-model`, groupe de serveurs, et toujours un compte local de secours.

## Configuration en cours et sauvegardée

| Commande | Effet |
| --- | --- |
| `show running-config` | Configuration en mémoire (active) |
| `show startup-config` | Configuration chargée au démarrage (NVRAM) |
| `copy running-config startup-config` (ou `write memory`) | **Enregistrer** — sans cela, les changements sont perdus au redémarrage |
| `show running-config \| section ^interface` | Filtrer par section |
| `show running-config \| include ^username\|^ip route` | Filtrer par lignes (expressions régulières) |
| `show running-config interface Gi0/0/1` | Configuration d'une interface |
| `show archive config differences nvram:startup-config system:running-config` | Changements non enregistrés |

```cisco
! Sauvegarde vers un serveur (SCP de préférence à TFTP)
copy running-config scp://sauvegarde@10.0.98.30/configs/R1-PARIS.cfg
! Archive automatique à chaque enregistrement + rollback
archive
 path flash:archive/R1-PARIS-
 maximum 10
 write-memory
 log config
  logging enable
  hidekeys
! Changement risqué avec retour arrière automatique si la session est perdue
configure terminal revert timer 10
! … modifications … puis, si tout va bien :
configure confirm
! Retour à une version archivée
configure replace flash:archive/R1-PARIS-3 list
```

Les sauvegardes automatisées de tout le parc se font avec Oxidized, RANCID ou [[01-ansible/03-automatisation-reseau|Ansible]].

## Informations et vérifications

```cisco
! modèle, version, uptime, licences, registre de configuration
show version
! numéros de série des modules
show inventory
! interfaces, adresses, état
show ip interface brief
! (commutateurs) ports, VLAN, vitesse, duplex
show interfaces status
show logging
! sessions ouvertes
show users
! charge CPU
show processes cpu sorted
! alimentations, ventilateurs, températures
show environment all
! licences Smart Licensing
show license summary
! voisins Cisco (ou show lldp neighbors detail)
show cdp neighbors detail
```

## Mise à jour d'IOS XE

Mode **install** (recommandé, paquets extraits) :

```cisco
copy scp://depot@10.0.98.30/images/cat9k_iosxe.17.12.04.SPA.bin flash:
verify /md5 flash:cat9k_iosxe.17.12.04.SPA.bin
install add file flash:cat9k_iosxe.17.12.04.SPA.bin activate commit
show install summary
! libérer l'espace des anciennes versions
install remove inactive
```

Choisir une version **recommandée** (étoile dorée sur le site de téléchargement Cisco) et lire les notes de version ; sur un empilement, la commande met à jour tous les membres.

## Récupération du mot de passe

Accès **physique** à la console requis :

- Routeurs : interrompre le démarrage (*Break*) → ROMMON `confreg 0x2142` → `reset` → démarrer sans configuration → `copy startup-config running-config` → changer les secrets → `config-register 0x2102` → `write memory`.
- Commutateurs Catalyst : maintenir le bouton **Mode** au démarrage, ou `SWITCH_IGNORE_STARTUP_CFG=1` en ROMMON (IOS XE).

La commande `no service password-recovery` désactive cette procédure (protection contre le vol de configuration) : la récupération efface alors la configuration.

Suite : [[02-outils-graphiques-gestion|outils graphiques et de gestion Cisco]].
