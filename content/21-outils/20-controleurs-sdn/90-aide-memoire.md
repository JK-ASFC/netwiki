---
title: Contrôleurs SDN — aide-mémoire
description: Ports et commandes d'OpenDaylight (Karaf, feature:install, RESTCONF), ONOS (Docker, CLI SSH 8101, apps, devices) et Ryu (ryu-manager, test avec Mininet).
tags: [aide-mémoire, sdn, opendaylight, onos, ryu, openflow]
icon: terminal
---

Explications : [[01-opendaylight-onos-ryu|OpenDaylight, ONOS et Ryu]].

| Contrôleur | Ports |
| --- | --- |
| OpenFlow (sud) | 6653 (6633 historique) |
| OpenDaylight | 8181 RESTCONF, 8101 SSH Karaf |
| ONOS | 8181 interface/API, 8101 CLI SSH, 6653 OpenFlow |
| Ryu | 6653 OpenFlow, 8080 API REST |

```bash
# OpenDaylight (console Karaf)
./bin/karaf
feature:install odl-restconf odl-openflowplugin-flow-services-ui
curl -u admin:admin http://127.0.0.1:8181/restconf/operational/opendaylight-inventory:nodes/

# ONOS
docker run -d -p 127.0.0.1:8181:8181 -p 127.0.0.1:8101:8101 -p 6653:6653 onosproject/onos:latest
ssh -p 8101 onos@localhost          # mot de passe « rocks »
onos> apps -a -s ; onos> app activate org.onosproject.openflow org.onosproject.fwd
onos> devices ; onos> links ; onos> hosts

# Ryu
ryu-manager ryu.app.simple_switch_13
sudo mn --topo single,3 --switch ovs --controller=remote,ip=127.0.0.1,port=6653
```
