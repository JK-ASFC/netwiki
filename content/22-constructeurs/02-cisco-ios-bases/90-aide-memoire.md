---
title: Cisco IOS / IOS XE — aide-mémoire des commandes de base
description: Commandes Cisco IOS et IOS XE de base avec exemples — modes, navigation et aide, filtres de sortie, configuration initiale sécurisée (nom, utilisateurs, SSH, bannière, NTP, syslog, SNMPv3), sauvegarde et restauration (copy, archive, configure replace), mise à jour d'IOS XE (install), récupération de mot de passe, vérifications usuelles.
tags: [aide-mémoire, cisco, ios, ios xe, ssh, archive, copy]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-cli-fondamentaux|CLI Cisco IOS]].

## Modes, aide, filtres

```cisco
enable
configure terminal
end
show running-config | section interface
show running-config | include snmp|logging
show ip interface brief | exclude unassigned
show interfaces status | include connected
show logging | begin %LINK
terminal length 0
do show ip interface brief
```

## Configuration initiale sécurisée

```cisco
hostname SW-PARIS-01
ip domain name exemple.fr
username admin privilege 15 algorithm-type scrypt secret MotDePasseLong2026
enable algorithm-type scrypt secret AutreSecretLong2026
service password-encryption
crypto key generate rsa modulus 3072
ip ssh version 2
ip ssh time-out 60
ip ssh authentication-retries 3
line vty 0 15
 transport input ssh
 login local
 exec-timeout 10 0
 access-class ADMIN in
ip access-list standard ADMIN
 permit 10.0.99.0 0.0.0.255
banner motd ^Accès réservé aux personnes autorisées.^
ntp server 10.0.10.123
clock timezone CET 1 0
clock summer-time CEST recurring last Sun Mar 2:00 last Sun Oct 3:00
logging host 10.0.98.20
logging trap informational
service timestamps log datetime msec localtime show-timezone
snmp-server group SUPERVISION v3 priv
snmp-server user supervision SUPERVISION v3 auth sha AuthLongue2026 priv aes 128 PrivLongue2026
no ip http server
end
write memory
```

## Sauvegarde, restauration, archive

```cisco
copy running-config startup-config
copy running-config tftp://10.0.99.30/sw-paris-01.cfg
copy running-config scp://sauvegarde@10.0.99.30/configs/sw-paris-01.cfg
archive
 path flash:archive/config
 write-memory
 maximum 14
show archive
configure replace flash:archive/config-3 list
show archive config differences
```

## Mise à jour IOS XE (mode install)

```cisco
copy tftp://10.0.99.30/cat9k_iosxe.17.12.04.SPA.bin flash:
install add file flash:cat9k_iosxe.17.12.04.SPA.bin activate commit
show install summary
install remove inactive
```

## Vérifications usuelles

```cisco
show version
show inventory
show processes cpu sorted | exclude 0.00
show memory statistics
show environment all
show users
show clock detail
show ntp associations
show logging
show tech-support | redirect flash:tech.txt
```
