---
title: Knot DNS, NSD et MaraDNS — aide-mémoire des commandes
description: Commandes avec exemples — Knot DNS (knotc conf-check, status, reload, zone-status, zone-begin/set/commit, zone-reload, zone-retransfer, stats ; keymgr ; kdig), NSD (nsd-checkconf, nsd-checkzone, nsd-control reload, zonestatus, transfer, stats) et MaraDNS, tests dig.
tags: [aide-mémoire, knot dns, nsd, maradns, dns]
icon: terminal
---

Références : [[01-knot-dns|Knot DNS]], [[02-nsd|NSD]], [[03-maradns|MaraDNS]].

## Knot DNS

```bash
sudo knotc conf-check ; sudo knotc status ; sudo knotc reload
sudo knotc zone-status ; sudo knotc zone-status corp.exemple.fr
sudo knotc zone-reload corp.exemple.fr ; sudo knotc zone-retransfer corp.exemple.fr ; sudo knotc zone-notify corp.exemple.fr
sudo knotc zone-begin corp.exemple.fr && sudo knotc zone-set corp.exemple.fr www 300 CNAME srv-web-01 && sudo knotc zone-commit corp.exemple.fr
sudo knotc zone-read corp.exemple.fr @ SOA
sudo knotc stats ; sudo knotc zone-stats corp.exemple.fr
sudo keymgr corp.exemple.fr list ; sudo keymgr corp.exemple.fr ds ; keymgr -t transfert hmac-sha256
kdig @ns1.corp.exemple.fr corp.exemple.fr AXFR -y hmac-sha256:transfert:Rk9PQkFSY2xlVFNJR3BhcnRhZ2Vl
kdig +dnssec +multi corp.exemple.fr DNSKEY
```

## NSD

```bash
sudo nsd-checkconf /etc/nsd/nsd.conf ; sudo nsd-checkzone exemple.fr /etc/nsd/zones/exemple.fr.zone
sudo nsd-control status ; sudo nsd-control reload ; sudo nsd-control reload exemple.fr
sudo nsd-control zonestatus ; sudo nsd-control transfer exemple.fr ; sudo nsd-control force_transfer exemple.fr
sudo nsd-control stats_noreset
```

## MaraDNS et tests

```bash
sudo systemctl status maradns maradns-deadwood
dig @10.0.10.60 srv-test-01.labo.exemple.fr +short
dig @ns1.corp.exemple.fr corp.exemple.fr SOA +norecurse
```
