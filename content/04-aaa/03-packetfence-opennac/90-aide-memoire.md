---
title: PacketFence et NAC — aide-mémoire des commandes
description: Commandes PacketFence avec exemples — pfcmd (checkup, service, node view/edit, reevaluate_access, configreload), journaux (packetfence.log, radius.log), test RADIUS (radtest, eapol_test), CoA, et commandes de vérification 802.1X/MAB côté commutateur Cisco.
tags: [aide-mémoire, packetfence, nac, 802.1x, radius]
icon: terminal
---

Références : [[01-packetfence|PacketFence]], [[02-opennac|OpenNAC]].

## PacketFence

```bash
PF=/usr/local/pf/bin/pfcmd
$PF checkup                                   # contrôle de la configuration
$PF service pf status ; $PF service pf restart ; $PF service radiusd restart
$PF configreload hard                         # recharger la configuration
$PF node view 00:11:22:33:44:55
$PF node edit 00:11:22:33:44:55 category=voip status=reg
/usr/local/pf/bin/pfcmd_vlan -reevaluate_access -mac 00:11:22:33:44:55
tail -f /usr/local/pf/logs/packetfence.log /usr/local/pf/logs/radius.log
radtest -t mschap alice 'MotDePasse' 127.0.0.1 0 testing123
eapol_test -c peap-alice.conf -s SecretRadiusPartage -a 10.0.99.20     # test 802.1X complet (wpa_supplicant)
```

## Commutateur Cisco (vérifications)

```text
show authentication sessions interface Gi1/0/5 details
show access-session interface Gi1/0/5 details
show dot1x interface Gi1/0/5
show mab interface Gi1/0/5
show aaa servers
test aaa group radius alice MotDePasse new-code
clear access-session interface Gi1/0/5
```
