---
title: TP-Link JetStream et Omada — aide-mémoire des commandes
description: Commandes TP-Link JetStream avec exemples (CLI de style Cisco : état, VLAN, LAG, STP, LLDP, PoE, sauvegarde) et contrôleur Omada (service Linux, conteneur Docker, sauvegarde, adoption, ports).
tags: [aide-mémoire, tp-link, jetstream, omada, vlan]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-jetstream-cli-web|JetStream]] et [[02-omada-controleur|Omada]].

## JetStream (CLI)

```tplink
enable
show system-info
show running-config
show vlan brief
show interface status
show interface switchport gigabitEthernet 1/0/12
show etherchannel 1 summary
show spanning-tree active
show lldp neighbor-information interface gigabitEthernet 1/0/12
show power inline information interface gigabitEthernet 1/0/12
show mac address-table interface gigabitEthernet 1/0/12
copy running-config startup-config
copy startup-config tftp ip-address 10.0.99.30 filename sw-tplink
```

## Contrôleur Omada

```bash
sudo tpeap status
sudo tpeap stop && sudo tpeap start
docker run -d --name omada --network host -v omada-data:/opt/tplink/EAPController/data -v omada-logs:/opt/tplink/EAPController/logs mbentley/omada-controller:5.15
docker logs -f omada
```

| Élément | Valeur |
| --- | --- |
| Interface web | `https://<contrôleur>:8043` |
| Adoption des équipements | UDP 29810, TCP 29811-29816 (selon version) |
| Sauvegarde | *Paramètres → Maintenance → Sauvegarde et restauration* (planifiable) |
| Adoption à distance | URL d'inform (DHCP option 138 ou outil de découverte Omada) |
