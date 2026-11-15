---
title: PacketFence et NAC — aide-mémoire des commandes
description: Référence complète des commandes PacketFence avec exemples — pfcmd (contrôle de configuration, services, rechargement, nœuds : liste, ajout, modification, suppression, import ; réévaluation d'accès, version, permissions), API REST (connexion, nœuds), sauvegarde, journaux, tests RADIUS et 802.1X, et vérifications des sessions 802.1X/MAB sur les commutateurs Cisco, Aruba AOS-CX, HPE Comware et Juniper.
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

## PacketFence : compléments

```bash
PF=/usr/local/pf/bin/pfcmd
$PF version
$PF service pf start
$PF service radiusd status
$PF service httpd.portal restart
$PF configreload soft
$PF node view all | head
$PF node add 00:11:22:33:44:66 status=reg category=imprimantes pid=default notes="Imprimante RDC"
$PF node delete 00:11:22:33:44:66
$PF import nodes /tmp/postes.csv                            # import en masse (MAC, catégorie…)
$PF fixpermissions
sudo /usr/local/pf/addons/backup-and-maintenance.sh         # sauvegarde de la base et de la configuration
ls /root/backup/
tail -f /usr/local/pf/logs/httpd.portal.error /usr/local/pf/logs/pfdhcplistener.log
```

```bash
# API REST (compte d'administration ou compte de services web)
T=$(curl -sk -X POST https://pf.corp.exemple.fr:9999/api/v1/login -d '{"username":"admin","password":"MotDePasse"}' | jq -r .token)
curl -sk -H "Authorization: $T" "https://pf.corp.exemple.fr:9999/api/v1/nodes?limit=10" | jq '.items[] | {mac, status, category_id, last_seen}'
curl -sk -H "Authorization: $T" "https://pf.corp.exemple.fr:9999/api/v1/node/00:11:22:33:44:55" | jq .item
```

## Sessions 802.1X / MAB sur les commutateurs

```text
! Aruba AOS-CX
show port-access clients
show port-access clients interface 1/1/5 detail
show radius-server detail
# HPE Comware
display dot1x connection
display mac-authentication connection
display radius scheme
# Juniper
show dot1x interface ge-0/0/5.0 detail
show dot1x authentication-failed-users
```
