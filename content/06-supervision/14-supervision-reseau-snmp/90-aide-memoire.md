---
title: Supervision réseau SNMP — aide-mémoire des commandes
description: Commandes LibreNMS (lnms device:add/remove/poll/discover, config:get/set, validate.php, dispatcher, daily.sh, snmp-scan.py), tests SNMP (snmpwalk, snmpget v2c et v3, snmptrap), Observium (add_device.php, discovery.php, poller.php), OpenNMS (journaux, send-event.pl, provision.pl) et NetXMS (nxadm, nxdbmgr, nxget) avec exemples.
tags: [aide-mémoire, librenms, snmp, opennms, netxms, observium]
icon: terminal
---

Explications : [[01-librenms|LibreNMS]] · [[02-observium-opennms-netxms|Observium, OpenNMS et NetXMS]].

```bash
snmpwalk -v3 -l authPriv -u supervision -a SHA -A "$AUTH" -x AES -X "$PRIV" sw-coeur-01 1.3.6.1.2.1.1
snmpget -v2c -c lecture sw-acces-01 sysUpTime.0 ; snmpwalk -v2c -c lecture sw-acces-01 IF-MIB::ifOperStatus
sudo -u librenms lnms device:add --v2c -c lecture sw-acces-02 ; sudo -u librenms lnms device:remove ancien-sw
sudo -u librenms lnms device:discover sw-acces-02 ; sudo -u librenms lnms device:poll sw-acces-02 -vv
sudo -u librenms lnms config:get nets ; sudo -u librenms lnms config:set nets.+ 10.0.30.0/24 ; sudo -u librenms /opt/librenms/validate.php
sudo -u librenms /opt/librenms/snmp-scan.py 10.0.30.0/24 ; sudo -u librenms /opt/librenms/daily.sh
cd /opt/observium && ./add_device.php sw-coeur-01 v2c lecture ; ./discovery.php -h sw-coeur-01 ; ./poller.php -h sw-coeur-01
tail -f /var/log/opennms/manager.log ; /usr/share/opennms/bin/send-event.pl uei.opennms.org/test 10.0.30.11
nxadm -c "show sessions" ; nxget 10.0.30.11 Agent.Version
```
