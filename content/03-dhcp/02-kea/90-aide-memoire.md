---
title: Kea DHCP — aide-mémoire des commandes
description: Commandes Kea avec exemples — vérification (kea-dhcp4 -t), service, keactrl, agent de contrôle et socket, API (config-get, config-set, config-reload, config-write, list-commands, status-get, lease4-get/add/del/wipe, reservation-add avec host_cmds, ha-heartbeat, statistic-get-all), baux en mémoire (CSV) ou base de données (kea-admin), migration depuis ISC DHCP (keama), tests.
tags: [aide-mémoire, kea, dhcp, api, keactrl, kea-admin]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-installation|Kea]].

## Service et vérification

```bash
sudo kea-dhcp4 -t /etc/kea/kea-dhcp4.conf         # syntaxe
sudo kea-dhcp6 -t /etc/kea/kea-dhcp6.conf
sudo systemctl restart kea-dhcp4-server           # RHEL : kea-dhcp4
sudo keactrl status                                # si keactrl est utilisé
sudo journalctl -u kea-dhcp4-server -f
kea-dhcp4 -V
```

## Commandes par socket (sans agent)

```bash
SOCK=/run/kea/kea4-ctrl-socket
echo '{ "command": "list-commands" }' | sudo socat - UNIX:$SOCK | jq .
echo '{ "command": "config-reload" }' | sudo socat - UNIX:$SOCK | jq .
echo '{ "command": "status-get" }' | sudo socat - UNIX:$SOCK | jq .arguments
echo '{ "command": "statistic-get-all" }' | sudo socat - UNIX:$SOCK | jq '.arguments | with_entries(select(.key | test("assigned")))'
```

## Commandes HTTP (via l'agent de contrôle ou l'écoute HTTP intégrée)

```bash
K=http://127.0.0.1:8000/
kea() { curl -s -u kea-api:"$MDP" -H "Content-Type: application/json" -d "$1" "$K" | jq .; }
kea '{ "command": "config-get", "service": [ "dhcp4" ] }'
kea '{ "command": "config-write", "service": [ "dhcp4" ], "arguments": { "filename": "/etc/kea/kea-dhcp4.conf" } }'
# Baux (bibliothèque lease_cmds chargée)
kea '{ "command": "lease4-get", "service": [ "dhcp4" ], "arguments": { "ip-address": "10.0.20.57" } }'
kea '{ "command": "lease4-get-by-hw-address", "service": [ "dhcp4" ], "arguments": { "hw-address": "00:11:22:33:44:55" } }'
kea '{ "command": "lease4-get-all", "service": [ "dhcp4" ], "arguments": { "subnets": [ 20 ] } }'
kea '{ "command": "lease4-del", "service": [ "dhcp4" ], "arguments": { "ip-address": "10.0.20.57" } }'
kea '{ "command": "lease4-wipe", "service": [ "dhcp4" ], "arguments": { "subnet-id": 20 } }'
# Réservations (bibliothèque host_cmds + stockage en base)
kea '{ "command": "reservation-add", "service": [ "dhcp4" ], "arguments": { "reservation": { "subnet-id": 20, "hw-address": "00:11:22:33:44:55", "ip-address": "10.0.20.10", "hostname": "imprimante-rdc" } } }'
kea '{ "command": "reservation-get-all", "service": [ "dhcp4" ], "arguments": { "subnet-id": 20 } }'
kea '{ "command": "reservation-del", "service": [ "dhcp4" ], "arguments": { "subnet-id": 20, "identifier-type": "hw-address", "identifier": "00:11:22:33:44:55" } }'
# Haute disponibilité
kea '{ "command": "ha-heartbeat", "service": [ "dhcp4" ] }'
kea '{ "command": "status-get", "service": [ "dhcp4" ] }'
```

## Baux et base de données

```bash
sudo tail /var/lib/kea/kea-leases4.csv            # stockage memfile
sudo kea-admin db-init pgsql -u kea -p "$MDP_BASE" -n kea      # créer le schéma
sudo kea-admin db-upgrade pgsql -u kea -p "$MDP_BASE" -n kea   # après mise à jour de Kea
sudo kea-admin db-version pgsql -u kea -p "$MDP_BASE" -n kea
sudo kea-admin lease-dump pgsql -4 -u kea -p "$MDP_BASE" -n kea -o /tmp/baux.csv
```

## Extrait de configuration

```json
{
  "Dhcp4": {
    "interfaces-config": { "interfaces": [ "eth1" ] },
    "control-socket": { "socket-type": "unix", "socket-name": "/run/kea/kea4-ctrl-socket" },
    "lease-database": { "type": "memfile", "lfc-interval": 3600 },
    "hooks-libraries": [ { "library": "/usr/lib/x86_64-linux-gnu/kea/hooks/libdhcp_lease_cmds.so" } ],
    "valid-lifetime": 28800,
    "option-data": [ { "name": "domain-name-servers", "data": "10.0.10.53, 10.0.10.54" } ],
    "subnet4": [ {
      "id": 20, "subnet": "10.0.20.0/24",
      "pools": [ { "pool": "10.0.20.50 - 10.0.20.250" } ],
      "option-data": [ { "name": "routers", "data": "10.0.20.1" } ],
      "reservations": [ { "hw-address": "00:11:22:33:44:55", "ip-address": "10.0.20.10" } ]
    } ]
  }
}
```

## Migration depuis ISC DHCP

```bash
keama -4 -i /etc/dhcp/dhcpd.conf -o /tmp/kea-dhcp4.json      # conversion à relire et compléter
```
