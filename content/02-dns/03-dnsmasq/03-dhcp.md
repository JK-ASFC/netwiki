---
title: "DHCP : plages, réservations, options, étiquettes, IPv6"
description: Configurer le serveur DHCP de dnsmasq — plages et durées de bail, réservations par MAC ou nom, options standard et propriétaires, étiquettes (tags) pour plusieurs réseaux et classes de clients, relais, enregistrement automatique dans le DNS, script de bail, DHCPv6 et annonces de routeur.
tags: [dnsmasq, dhcp, dhcpv6, slaac, réservation, options, tags]
icon: network
---

## Plage de base

```ini /etc/dnsmasq.d/dhcp.conf
dhcp-authoritative                        # répondre (NAK) aux clients avec une adresse incorrecte
dhcp-range=192.168.30.100,192.168.30.199,255.255.255.0,12h
dhcp-option=option:router,192.168.30.1
dhcp-option=option:dns-server,192.168.30.2
dhcp-option=option:domain-name,agence.exemple.fr
dhcp-option=option:domain-search,agence.exemple.fr,corp.exemple.fr
dhcp-option=option:ntp-server,192.168.30.1
dhcp-lease-max=500
```

Par défaut, si `dhcp-option=option:dns-server` est absent, dnsmasq annonce **sa propre adresse** comme DNS — c'est souvent ce qu'on souhaite. Idem pour le routeur (`0.0.0.0` = « moi-même »).

## Réservations

```ini
dhcp-host=00:11:22:33:44:55,nas,192.168.30.10,infinite
dhcp-host=00:1b:a9:12:34:56,imprimante-rdc,192.168.30.11
dhcp-host=camera-entree,192.168.30.12              # par nom d'hôte envoyé par le client
dhcp-host=id:01:00:11:22:33:44:55,serveur-vm,192.168.30.13   # par identifiant client (option 61)
dhcp-host=00:de:ad:be:ef:00,ignore                 # ne jamais répondre à cet équipement
dhcp-hostsfile=/etc/dnsmasq.d/reservations.txt     # fichier rechargé par SIGHUP
```

Le nom attribué est automatiquement résolvable dans le DNS de dnsmasq (`nas.agence.exemple.fr`) : c'est l'un des grands avantages de l'outil.

## Plusieurs réseaux avec des étiquettes (tags)

```ini
# Deux VLAN (interfaces ens224.30 et ens224.50), ou réseaux relayés
dhcp-range=set:bureaux,192.168.30.100,192.168.30.199,255.255.255.0,12h
dhcp-range=set:invites,192.168.50.10,192.168.50.250,255.255.255.0,1h

dhcp-option=tag:bureaux,option:router,192.168.30.1
dhcp-option=tag:invites,option:router,192.168.50.1
dhcp-option=tag:invites,option:dns-server,9.9.9.9,149.112.112.112
```

### Classes de clients

```ini
# Par constructeur (préfixe de MAC)
dhcp-mac=set:telephones,80:5e:c0:*:*:*
dhcp-option=tag:telephones,option:tftp-server,"http://prov.exemple.fr/"
dhcp-option=tag:telephones,66,"10.0.60.5"

# Par vendor class (option 60)
dhcp-vendorclass=set:windows,MSFT
dhcp-option=tag:windows,option:netbios-ns,0.0.0.0

# Par user class (option 77)
dhcp-userclass=set:kiosque,kiosque

# Contrôleur Wi-Fi Cisco : option 43 encapsulée (sous-option 241)
dhcp-vendorclass=set:cisco-ap,Cisco AP
dhcp-option=tag:cisco-ap,vendor:Cisco AP,241,10.0.80.10

# Seuls les clients connus (avec dhcp-host) obtiennent une adresse
dhcp-ignore=tag:!known
```

| Construction | Rôle |
| --- | --- |
| `set:nom` | Attribuer une étiquette |
| `tag:nom` | Condition sur une étiquette |
| `tag:!nom` | Négation |
| `known` | Étiquette automatique des clients ayant un `dhcp-host` |
| Plusieurs `tag:` sur une option | ET logique |

## Options : syntaxe

```ini
dhcp-option=3,192.168.30.1                         # par numéro
dhcp-option=option:router,192.168.30.1             # par nom (dnsmasq --help dhcp pour la liste)
dhcp-option=121,10.20.0.0/16,192.168.30.254,0.0.0.0/0,192.168.30.1   # routes statiques sans classe (inclure la route par défaut)
dhcp-option=252,"http://wpad.agence.exemple.fr/wpad.dat"
dhcp-option-force=option:mtu,1400                  # envoyer même si le client ne l'a pas demandé
dhcp-option=option6:dns-server,[2001:db8:30::2]    # DHCPv6
```

## Relais DHCP

dnsmasq peut servir des réseaux distants relayés (`giaddr`) : déclarer simplement les plages de ces réseaux (`dhcp-range=10.40.0.100,10.40.0.200,255.255.255.0`). Il peut aussi **être** relais :

```ini
dhcp-relay=192.168.30.2,10.0.10.21          # relayer les requêtes reçues sur 192.168.30.2 vers le serveur 10.0.10.21
```

## Enregistrement DNS des clients

- Les noms envoyés par les clients (option 12) deviennent résolvables : `pc-07.agence.exemple.fr`.
- `dhcp-fqdn` : n'enregistrer que des noms complets ; `domain=` par plage possible : `domain=invites.exemple.fr,192.168.50.0/24`.
- Les noms des `dhcp-host` sont prioritaires sur les noms annoncés par les clients.

## Script de bail

```ini
dhcp-script=/usr/local/sbin/dnsmasq-bail.sh
```

```bash /usr/local/sbin/dnsmasq-bail.sh
#!/bin/sh
# $1 = add | old | del ; $2 = MAC ; $3 = IP ; $4 = nom (si connu)
logger -t dnsmasq-bail "$1 $2 $3 ${4:-?}"
```

Utile pour tracer les baux dans un SIEM, ou alimenter un inventaire / IPAM.

## IPv6 : DHCPv6 et annonces de routeur

```ini
enable-ra                                           # dnsmasq envoie les annonces de routeur (RA)
# SLAAC + DHCPv6 sans état (adresses auto, options par DHCPv6) + noms via « ra-names »
dhcp-range=::,constructor:ens224,ra-stateless,ra-names,12h
# ou adressage DHCPv6 avec état :
# dhcp-range=::100,::1ff,constructor:ens224,64,12h
dhcp-option=option6:dns-server,[::]                 # [::] = l'adresse du serveur lui-même
dhcp-option=option6:domain-search,agence.exemple.fr
```

| Mode `dhcp-range` | Adressage des clients |
| --- | --- |
| `ra-only` | SLAAC uniquement, pas de DHCPv6 |
| `slaac` | SLAAC + DHCPv6 avec état en parallèle |
| `ra-stateless` | SLAAC + options par DHCPv6 sans état |
| `ra-names` | Devine l'adresse SLAAC des clients double pile et l'enregistre dans le DNS |
| (plage d'adresses) | DHCPv6 avec état |

`constructor:ens224` construit la plage à partir du préfixe configuré sur l'interface (pratique avec un préfixe délégué qui change).

## Points d'attention

> [!IMPORTANT]
> - Un **seul** serveur DHCP `authoritative` par réseau : un dnsmasq de test branché sur le réseau de production distribue des adresses erronées (protégez-vous avec le *DHCP snooping*, voir [[01-isc-dhcp/09-exploitation-securite-kea|sécurité DHCP]]).
> - dnsmasq n'a **pas de failover** : pour deux serveurs, partagez la plage en deux sous-plages disjointes, ou passez à Kea / ISC DHCP / DHCP Windows.
> - Les baux sont dans un fichier texte : sauvegardez-le si les adresses doivent rester stables après une réinstallation.
