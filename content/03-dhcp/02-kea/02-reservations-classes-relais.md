---
title: Réservations, classes, relais, DHCPv6 et DDNS
description: Configurer Kea pour un réseau d'entreprise — réservations par adresse MAC ou identifiant client (fichier ou base), classes de clients (téléphones IP, PXE BIOS/UEFI, constructeurs), options spécifiques (43, 66/67, 150), relais DHCP et option 82, réseaux partagés, DHCPv6 avec délégation de préfixe, mises à jour DNS dynamiques avec kea-dhcp-ddns et TSIG.
tags: [kea, réservations, classes, pxe, relais, option 82, dhcpv6, ddns]
icon: settings-2
---

## Réservations

```kea extrait de subnet4
{
  "id": 20,
  "subnet": "10.0.20.0/24",
  "pools": [ { "pool": "10.0.20.50 - 10.0.20.250" } ],
  "reservations": [
    { "hw-address": "00:50:56:aa:bb:01", "ip-address": "10.0.20.10", "hostname": "imp-rdc-01" },
    { "client-id": "01:00:50:56:aa:bb:02", "ip-address": "10.0.20.11", "hostname": "srv-badge" },
    {
      "hw-address": "00:50:56:aa:bb:03",
      "ip-address": "10.0.20.12",
      "option-data": [ { "name": "domain-name-servers", "data": "10.0.10.99" } ]
    }
  ]
}
```

| Réglage | Effet |
| --- | --- |
| `host-reservation-identifiers` | Identifiants consultés : `hw-address`, `client-id`, `circuit-id`, `duid`, `flex-id` |
| `reservations-in-subnet` / `reservations-out-of-pool` | Optimisations : réservations hors pool (aucun conflit avec les adresses dynamiques) |
| `hosts-database` | Réservations en MySQL/PostgreSQL, modifiables à chaud par l'API (`reservation-add`, greffon `host_cmds`) |

Placez les réservations **hors des pools** : pas de risque qu'une adresse réservée soit déjà louée à un autre client.

## Classes de clients

```kea
"client-classes": [
  {
    "name": "telephones-ip",
    "test": "substring(option[60].hex,0,13) == 'Cisco Systems'",
    "option-data": [ { "name": "tftp-server-address", "code": 150, "space": "dhcp4", "data": "10.0.30.5" } ]
  },
  {
    "name": "pxe-uefi",
    "test": "option[93].hex == 0x0007 or option[93].hex == 0x0009",
    "next-server": "10.0.10.69",
    "boot-file-name": "ipxe.efi"
  },
  {
    "name": "pxe-bios",
    "test": "option[93].hex == 0x0000",
    "next-server": "10.0.10.69",
    "boot-file-name": "undionly.kpxe"
  },
  {
    "name": "points-acces",
    "test": "substring(option[60].hex,0,7) == 'ArubaAP'",
    "option-data": [ { "name": "vendor-encapsulated-options", "csv-format": false, "data": "0A000A20" } ]
  }
]
```

```kea Pool réservé à une classe
"pools": [
  { "pool": "10.0.30.100 - 10.0.30.200", "client-classes": [ "telephones-ip" ] }
]
```

L'option **150** (TFTP Cisco) n'est pas standard : déclarez-la dans `option-def` si nécessaire. La définition des options PXE BIOS/UEFI est détaillée aussi dans [[01-isc-dhcp/04-reservations-classes-options|ISC DHCP]] (même logique).

## Relais DHCP et option 82

Les clients des autres VLAN atteignent Kea via un **relais** (`ip helper-address 10.0.10.67` sur l'interface SVI du routeur ou du commutateur de niveau 3). Kea choisit le sous-réseau d'après l'adresse **giaddr** du relais.

```kea
"subnet4": [
  {
    "id": 30,
    "subnet": "10.0.30.0/24",
    "relay": { "ip-addresses": [ "10.0.30.1" ] },
    "pools": [ { "pool": "10.0.30.100 - 10.0.30.250" } ],
    "option-data": [ { "name": "routers", "data": "10.0.30.1" } ]
  }
]
```

Avec l'**option 82** (*relay agent information*, insérée par le commutateur avec DHCP snooping), on peut réserver par port (`circuit-id`) ou classer (`relay4[1].hex` = circuit-id, `relay4[2].hex` = remote-id).

## Réseaux partagés

Plusieurs sous-réseaux sur le même lien (extension d'un VLAN saturé) :

```kea
"shared-networks": [
  {
    "name": "vlan-utilisateurs",
    "relay": { "ip-addresses": [ "10.0.40.1" ] },
    "subnet4": [
      { "id": 40, "subnet": "10.0.40.0/24", "pools": [ { "pool": "10.0.40.20 - 10.0.40.250" } ], "option-data": [ { "name": "routers", "data": "10.0.40.1" } ] },
      { "id": 41, "subnet": "10.0.41.0/24", "pools": [ { "pool": "10.0.41.20 - 10.0.41.250" } ], "option-data": [ { "name": "routers", "data": "10.0.41.1" } ] }
    ]
  }
]
```

## DHCPv6

```kea /etc/kea/kea-dhcp6.conf
{
  "Dhcp6": {
    "interfaces-config": { "interfaces": [ "eth0" ] },
    "lease-database": { "type": "memfile" },
    "preferred-lifetime": 14400,
    "valid-lifetime": 28800,
    "option-data": [
      { "name": "dns-servers", "data": "2001:db8:10::53" },
      { "name": "domain-search", "data": "corp.exemple.fr" }
    ],
    "subnet6": [
      {
        "id": 610,
        "subnet": "2001:db8:10::/64",
        "interface": "eth0",
        "pools": [ { "pool": "2001:db8:10::1000 - 2001:db8:10::1fff" } ],
        "pd-pools": [ { "prefix": "2001:db8:8000::", "prefix-len": 48, "delegated-len": 56 } ]
      }
    ]
  }
}
```

En IPv6, la **passerelle** n'est pas fournie par DHCPv6 mais par les annonces de routeur (RA) ; les drapeaux **M/O** des RA indiquent aux clients d'utiliser DHCPv6. Android ne prend pas en charge DHCPv6 avec état : prévoyez SLAAC (+ RDNSS) sur les réseaux d'invités et de mobiles.

## Mises à jour DNS dynamiques

```kea Extrait de kea-dhcp4.conf
"dhcp-ddns": { "enable-updates": true },
"ddns-send-updates": true,
"ddns-qualifying-suffix": "corp.exemple.fr.",
"ddns-override-client-update": true,
"ddns-replace-client-name": "when-not-present",
"ddns-generated-prefix": "dhcp"
```

```kea /etc/kea/kea-dhcp-ddns.conf
{
  "DhcpDdns": {
    "ip-address": "127.0.0.1",
    "port": 53001,
    "tsig-keys": [
      { "name": "kea-ddns", "algorithm": "HMAC-SHA256", "secret-file": "/etc/kea/tsig-kea-ddns.secret" }
    ],
    "forward-ddns": {
      "ddns-domains": [
        { "name": "corp.exemple.fr.", "key-name": "kea-ddns", "dns-servers": [ { "ip-address": "10.0.10.53" } ] }
      ]
    },
    "reverse-ddns": {
      "ddns-domains": [
        { "name": "10.in-addr.arpa.", "key-name": "kea-ddns", "dns-servers": [ { "ip-address": "10.0.10.53" } ] }
      ]
    }
  }
}
```

Côté BIND, la clé TSIG et `update-policy` sont décrites dans [[01-bind9/08-ddns-nsupdate|DDNS et nsupdate]]. Kea gère les conflits de noms par enregistrements **DHCID** (RFC 4703).
