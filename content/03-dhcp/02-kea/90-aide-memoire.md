---
title: Kea DHCP — aide-mémoire des commandes
description: Référence complète des commandes Kea avec exemples — installation (paquets Debian, dépôt ISC Cloudsmith, RHEL), services, vérification, commandes par socket et par HTTP (kea-shell), configuration à chaud (config-test, config-set, config-write), état et version, suspension du service, sous-réseaux, baux (lecture, ajout, modification, suppression, récupération des expirés, DNS), réservations, statistiques, haute disponibilité (maintenance, synchronisation, reprise), bases de données (kea-admin : initialisation, mise à niveau, export et import des baux), journalisation, test de charge perfdhcp, Stork, configuration type et migration depuis ISC DHCP.
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

## Installation

```bash
sudo apt install kea-dhcp4-server kea-ctrl-agent kea-admin     # Debian / Ubuntu (paquets de la distribution)
# Dépôt ISC (versions récentes, paquets isc-kea-*)
curl -1sLf 'https://dl.cloudsmith.io/public/isc/kea-2-6/setup.deb.sh' | sudo -E bash
sudo apt install isc-kea                                       # dhcp4, dhcp6, agent, ddns, hooks
sudo dnf install kea                                           # RHEL / Rocky (EPEL ou dépôt ISC)
sudo systemctl enable --now kea-dhcp4-server                   # isc-kea-dhcp4-server (dépôt ISC), kea-dhcp4 (RHEL)
sudo firewall-cmd --permanent --add-service=dhcp && sudo firewall-cmd --reload
```

## kea-shell

```bash
kea-shell --host 127.0.0.1 --port 8000 --auth-user kea-api --auth-password "$MDP" --service dhcp4 list-commands
echo '{ "ip-address": "10.0.20.57" }' | kea-shell --host 127.0.0.1 --port 8000 --auth-user kea-api --auth-password "$MDP" --service dhcp4 lease4-get
```

## Commandes complémentaires (fonction kea() définie plus haut)

```bash
# Configuration
kea '{ "command": "config-test", "service": [ "dhcp4" ], "arguments": '"$(cat /etc/kea/kea-dhcp4.conf)"' }'
kea '{ "command": "config-reload", "service": [ "dhcp4" ] }'
kea '{ "command": "version-get", "service": [ "dhcp4" ] }'
kea '{ "command": "build-report", "service": [ "dhcp4" ] }'
# Suspendre puis reprendre la distribution d'adresses (maintenance)
kea '{ "command": "dhcp-disable", "service": [ "dhcp4" ], "arguments": { "max-period": 600 } }'
kea '{ "command": "dhcp-enable", "service": [ "dhcp4" ] }'
# Sous-réseaux (bibliothèque subnet_cmds)
kea '{ "command": "subnet4-list", "service": [ "dhcp4" ] }'
kea '{ "command": "subnet4-get", "service": [ "dhcp4" ], "arguments": { "id": 20 } }'
# Baux
kea '{ "command": "lease4-add", "service": [ "dhcp4" ], "arguments": { "ip-address": "10.0.20.60", "hw-address": "00:11:22:33:44:66", "subnet-id": 20 } }'
kea '{ "command": "lease4-update", "service": [ "dhcp4" ], "arguments": { "ip-address": "10.0.20.60", "hw-address": "00:11:22:33:44:77", "hostname": "poste-60" } }'
kea '{ "command": "lease4-resend-ddns", "service": [ "dhcp4" ], "arguments": { "ip-address": "10.0.20.60" } }'
kea '{ "command": "leases-reclaim", "service": [ "dhcp4" ], "arguments": { "remove": true } }'
# Statistiques
kea '{ "command": "statistic-get", "service": [ "dhcp4" ], "arguments": { "name": "subnet[20].assigned-addresses" } }'
kea '{ "command": "stat-lease4-get", "service": [ "dhcp4" ] }'          # bibliothèque stat_cmds
kea '{ "command": "statistic-reset-all", "service": [ "dhcp4" ] }'
# Haute disponibilité
kea '{ "command": "ha-maintenance-start", "service": [ "dhcp4" ] }'    # avant d'arrêter le partenaire
kea '{ "command": "ha-maintenance-cancel", "service": [ "dhcp4" ] }'
kea '{ "command": "ha-sync", "service": [ "dhcp4" ], "arguments": { "server-name": "dhcp02" } }'
kea '{ "command": "ha-continue", "service": [ "dhcp4" ] }'
kea '{ "command": "ha-scopes", "service": [ "dhcp4" ], "arguments": { "scopes": [ "dhcp01", "dhcp02" ] } }'
```

## Base de données des baux

```bash
sudo kea-admin lease-upload pgsql -4 -u kea -p "$MDP_BASE" -n kea -i /tmp/baux.csv      # importer des baux (CSV)
sudo kea-lfc -4 -x /var/lib/kea/kea-leases4.csv -i /var/lib/kea/kea-leases4.csv.2 -o /var/lib/kea/kea-leases4.csv.output -f /var/lib/kea/kea-leases4.csv.completed -p /run/kea/kea-lfc.pid -c /etc/kea/kea-dhcp4.conf   # compactage manuel (normalement automatique)
```

## Journalisation et test de charge

```json kea-dhcp4.conf (extrait)
"loggers": [
  {
    "name": "kea-dhcp4",
    "output-options": [ { "output": "/var/log/kea/kea-dhcp4.log", "maxsize": 10485760, "maxver": 5 } ],
    "severity": "INFO"
  },
  {
    "name": "kea-dhcp4.packets",
    "output-options": [ { "output": "/var/log/kea/kea-dhcp4-paquets.log" } ],
    "severity": "DEBUG",
    "debuglevel": 55
  }
]
```

```bash
sudo tail -f /var/log/kea/kea-dhcp4.log
# 100 requêtes par seconde, 1 000 clients simulés, pendant 30 s (depuis un poste de test, jamais en production)
sudo perfdhcp -4 -r 100 -R 1000 -p 30 -l eth1 10.0.10.67
# Stork : rattacher le serveur à l'interface de supervision
sudo stork-agent register --server-url http://stork.corp.exemple.fr:8080
```
