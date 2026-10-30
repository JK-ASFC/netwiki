---
title: Cisco Meraki — aide-mémoire des commandes
description: Aide-mémoire Cisco Meraki avec exemples — API Dashboard v1 avec curl (organisations, réseaux, équipements, état, clients, VLAN, règles de pare-feu, configuration de ports), page locale de l'équipement, emplacements du tableau de bord pour les outils de diagnostic.
tags: [aide-mémoire, meraki, api, dashboard, curl]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-tableau-de-bord-configuration|tableau de bord et configuration]].

## API Dashboard (v1)

```bash
export MERAKI_API_KEY="CLE_API_EN_VARIABLE"      # jamais dans un script versionné
API=https://api.meraki.com/api/v1
H="Authorization: Bearer $MERAKI_API_KEY"

curl -s -H "$H" $API/organizations | jq '.[] | {id, name}'
curl -s -H "$H" $API/organizations/<orgId>/networks | jq '.[] | {id, name, productTypes}'
curl -s -H "$H" "$API/organizations/<orgId>/devices/statuses" | jq '.[] | select(.status != "online") | {name, serial, status}'
curl -s -H "$H" "$API/networks/<networkId>/clients?timespan=3600" | jq '.[] | {description, ip, vlan, usage}'
curl -s -H "$H" $API/networks/<networkId>/appliance/vlans | jq '.[] | {id, name, subnet}'
curl -s -H "$H" $API/networks/<networkId>/appliance/firewall/l3FirewallRules | jq .
curl -s -H "$H" $API/devices/<serial>/switch/ports | jq '.[] | {portId, enabled, type, vlan}'
curl -s -X PUT -H "$H" -H "Content-Type: application/json" \
  -d '{"vlan":30,"type":"access","name":"Serveur ESX"}' \
  $API/devices/<serial>/switch/ports/12
```

## Diagnostic

| Tâche | Emplacement |
| --- | --- |
| Page locale de l'équipement (IP, liaison, réinitialisation) | `http://setup.meraki.com` ou l'adresse IP de l'équipement |
| Ping, traceroute, capture, cycle de port | *Équipement → Tools* |
| Journal des événements | *Network-wide → Event log* |
| Modifications de configuration | *Organization → Change log* |
| Topologie et voisins LLDP/CDP | *Network-wide → Topology* |
