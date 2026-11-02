---
title: Knot DNS
description: Knot DNS (CZ.NIC) — serveur DNS faisant autorité hautes performances, installation sur Debian/Ubuntu (dépôt CZ.NIC), RHEL/Rocky (EPEL) et conteneur, knot.conf (serveur, journaux, ACL, distants, modèles, zones), zones primaires et secondaires (AXFR/IXFR, NOTIFY, TSIG), DNSSEC automatique (politique, KSK/ZSK, roulement, CDS/CDNSKEY), mises à jour dynamiques, knotc (rechargement, édition transactionnelle de zone, statistiques) et supervision.
tags: [knot dns, dns, autoritaire, dnssec, axfr, tsig, knotc]
icon: globe
---

**Knot DNS** (CZ.NIC, GPL) est un serveur DNS **faisant autorité** très performant (opérateurs de domaines de premier niveau, hébergeurs) avec une gestion **DNSSEC entièrement automatique** (génération et roulement des clés, publication CDS/CDNSKEY). Son résolveur frère est *Knot Resolver*. Comparable à [[01-bind9/01-presentation|BIND9]] et [[04-powerdns/01-presentation|PowerDNS]].

## Installation

```bash
# Debian / Ubuntu : dépôt officiel CZ.NIC pour la dernière version (sinon paquet knot de la distribution)
sudo apt install apt-transport-https ca-certificates wget
sudo wget -O /usr/share/keyrings/cznic-labs-pkg.gpg https://pkg.labs.nic.cz/gpg
echo "deb [signed-by=/usr/share/keyrings/cznic-labs-pkg.gpg] https://pkg.labs.nic.cz/knot-dns $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/cznic-labs-knot-dns.list
sudo apt update && sudo apt install knot knot-dnsutils
sudo dnf install epel-release && sudo dnf install knot knot-utils                       # RHEL / Rocky / Alma
docker run -d --name knot -p 53:53/udp -p 53:53/tcp -v /etc/knot:/config cznic/knot knotd -c /config/knot.conf
```

## Configuration

```yaml /etc/knot/knot.conf
server:
  listen: [ 0.0.0.0@53, ::@53 ]
  identity: ns1.corp.exemple.fr
  version: ""                          # ne pas divulguer la version

log:
  - target: syslog
    any: info

key:
  - id: transfert
    algorithm: hmac-sha256
    secret: Rk9PQkFSY2xlVFNJR3BhcnRhZ2Vl          # keymgr -t transfert hmac-sha256

remote:
  - id: secondaire
    address: 10.0.10.54@53
    key: transfert

acl:
  - id: vers-secondaire
    address: 10.0.10.54
    key: transfert
    action: transfer

policy:
  - id: auto
    algorithm: ecdsap256sha256
    ksk-lifetime: 365d
    zsk-lifetime: 90d
    cds-cdnskey-publish: always

template:
  - id: default
    storage: /var/lib/knot/zones
    file: "%s.zone"
    semantic-checks: on

zone:
  - domain: corp.exemple.fr
    notify: secondaire
    acl: vers-secondaire
    dnssec-signing: on
    dnssec-policy: auto
```

Sur le secondaire : `remote` vers le primaire, `acl` *notify* autorisée, et zone avec `master: primaire`.

```bash
sudo knotc conf-check && sudo systemctl restart knot
sudo knotc zone-status corp.exemple.fr
kdig @127.0.0.1 corp.exemple.fr SOA +dnssec
```

## Modifier une zone (transaction)

```bash
sudo knotc zone-begin corp.exemple.fr
sudo knotc zone-set corp.exemple.fr srv-web-03 3600 A 10.0.20.13
sudo knotc zone-unset corp.exemple.fr ancien-serveur A
sudo knotc zone-commit corp.exemple.fr          # incrémente le numéro de série, signe et notifie
sudo knotc zone-read corp.exemple.fr srv-web-03
```

Ou éditer le fichier de zone puis `knotc zone-reload corp.exemple.fr`.

## DNSSEC

Avec `dnssec-signing: on`, Knot crée les clés, signe et renouvelle les signatures. Publier l'enregistrement **DS** chez le registre (ou laisser le registre lire les CDS/CDNSKEY) :

```bash
sudo keymgr corp.exemple.fr list
sudo keymgr corp.exemple.fr ds
sudo knotc zone-ksk-submitted corp.exemple.fr    # confirme que le DS est publié (fin du roulement de KSK)
```

Commandes : [[90-aide-memoire|aide-mémoire]].
