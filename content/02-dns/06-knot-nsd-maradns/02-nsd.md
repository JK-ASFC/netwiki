---
title: NSD
description: NSD (Name Server Daemon, NLnet Labs) — serveur DNS uniquement faisant autorité, sobre et sûr, utilisé par des serveurs racine et OpenBSD, installation, nsd.conf (zones primaires et secondaires, TSIG, notify, provide-xfr, request-xfr), contrôle à distance (nsd-control), vérification des zones (nsd-checkzone), DNSSEC (signature externe avec ldns-signzone) et association avec Unbound.
tags: [nsd, dns, autoritaire, nlnet labs, axfr, tsig, openbsd]
icon: globe
---

**NSD** (BSD, NLnet Labs) ne fait **que** répondre pour ses zones : pas de récursion, pas de cache, une surface d'attaque minimale. Il est utilisé par plusieurs serveurs **racine** et inclus dans **OpenBSD**. Architecture courante : NSD pour les zones publiques + [[02-unbound/01-presentation-installation|Unbound]] comme résolveur interne.

## Installation

```bash
sudo apt install nsd                  # Debian / Ubuntu
sudo dnf install nsd                  # RHEL / Rocky (EPEL), Fedora
pkg install nsd                       # FreeBSD (base d'OpenBSD : déjà présent)
sudo nsd-control-setup                # clés pour nsd-control
```

## Configuration

```yaml /etc/nsd/nsd.conf
server:
  ip-address: 0.0.0.0
  ip-address: ::
  hide-version: yes
  zonesdir: "/etc/nsd/zones"

remote-control:
  control-enable: yes

key:
  name: "transfert"
  algorithm: hmac-sha256
  secret: "Rk9PQkFSY2xlVFNJR3BhcnRhZ2Vl"

zone:
  name: "exemple.fr"
  zonefile: "exemple.fr.zone"
  notify: 203.0.113.54 transfert
  provide-xfr: 203.0.113.54 transfert
```

Secondaire :

```yaml
zone:
  name: "exemple.fr"
  zonefile: "exemple.fr.zone"
  allow-notify: 203.0.113.53 transfert
  request-xfr: AXFR 203.0.113.53 transfert
```

```bash
sudo nsd-checkconf /etc/nsd/nsd.conf
sudo nsd-checkzone exemple.fr /etc/nsd/zones/exemple.fr.zone
sudo systemctl enable --now nsd
sudo nsd-control reload exemple.fr ; sudo nsd-control zonestatus exemple.fr
```

## DNSSEC

NSD sert des zones déjà signées : signer avec `ldns-signzone` (paquet `ldns-utils`) ou un outil comme OpenDNSSEC, puis recharger.

```bash
ldns-keygen -a ECDSAP256SHA256 -k exemple.fr       # KSK
ldns-keygen -a ECDSAP256SHA256 exemple.fr          # ZSK
ldns-signzone -n exemple.fr.zone Kexemple.fr.+013+12345 Kexemple.fr.+013+54321
```

Pour une signature automatique, préférez [[01-knot-dns|Knot DNS]].

Commandes : [[90-aide-memoire|aide-mémoire]].
