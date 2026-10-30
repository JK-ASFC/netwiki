---
title: PowerDNS — aide-mémoire des commandes
description: Commandes PowerDNS avec exemples — serveur faisant autorité (pdns_server, pdnsutil : zones, enregistrements, édition, vérification, DNSSEC, clés TSIG, métadonnées, secondaires), pdns_control, API REST (curl), Recursor (rec_control), dnsdist (console, statistiques, règles), tests et journaux.
tags: [aide-mémoire, powerdns, pdnsutil, rec_control, dnsdist, api]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation|PowerDNS]].

## Serveur faisant autorité : pdnsutil

```bash
pdnsutil create-zone exemple.fr ns1.exemple.fr
pdnsutil add-record exemple.fr @ NS ns2.exemple.fr
pdnsutil add-record exemple.fr www A 3600 203.0.113.10
pdnsutil add-record exemple.fr @ MX "10 mail.exemple.fr"
pdnsutil add-record exemple.fr @ TXT '"v=spf1 mx -all"'
pdnsutil replace-rrset exemple.fr www A 300 203.0.113.11
pdnsutil delete-rrset exemple.fr www A
pdnsutil list-zone exemple.fr
pdnsutil list-all-zones
pdnsutil edit-zone exemple.fr              # édition dans $EDITOR, avec contrôle
pdnsutil check-zone exemple.fr
pdnsutil check-all-zones
pdnsutil increase-serial exemple.fr
pdnsutil rectify-zone exemple.fr
pdnsutil delete-zone ancienne.fr
pdnsutil load-zone exemple.fr /tmp/db.exemple.fr     # importer un fichier de zone BIND
# Secondaire
pdnsutil create-secondary-zone exemple.org 198.51.100.53
```

## DNSSEC et TSIG

```bash
pdnsutil secure-zone exemple.fr
pdnsutil show-zone exemple.fr               # clés et enregistrements DS à publier
pdnsutil export-zone-ds exemple.fr
pdnsutil set-nsec3 exemple.fr '1 0 0 -' narrow
pdnsutil rectify-zone exemple.fr
pdnsutil disable-dnssec exemple.fr
pdnsutil generate-tsig-key transfert hmac-sha256
pdnsutil activate-tsig-key exemple.fr transfert primary
pdnsutil set-meta exemple.fr ALLOW-AXFR-FROM 198.51.100.53
pdnsutil get-meta exemple.fr
```

## pdns_control et service

```bash
sudo systemctl restart pdns
pdns_control ping
pdns_control rping
pdns_control show '*'                  # statistiques
pdns_control purge exemple.fr$         # purger le cache d'une zone
pdns_control notify exemple.fr
pdns_control retrieve exemple.org      # forcer un transfert (secondaire)
```

## API REST

```bash
API=http://127.0.0.1:8081/api/v1/servers/localhost
curl -s -H "X-API-Key: $CLE" $API/zones | jq '.[].name'
curl -s -H "X-API-Key: $CLE" $API/zones/exemple.fr. | jq '.rrsets[] | {name, type}'
curl -s -X PATCH -H "X-API-Key: $CLE" $API/zones/exemple.fr. -d '{
  "rrsets": [{"name": "api.exemple.fr.", "type": "A", "ttl": 300, "changetype": "REPLACE",
              "records": [{"content": "203.0.113.20", "disabled": false}]}]}'
curl -s -H "X-API-Key: $CLE" $API/statistics | jq '.[0:5]'
```

## Recursor

```bash
rec_control ping
rec_control get-all | grep -E "questions|cache-hits|cache-misses"
rec_control wipe-cache www.exemple.com
rec_control wipe-cache exemple.com$          # nom et sous-domaines
rec_control reload-zones                     # forward-zones-file
rec_control reload-lua-script
rec_control trace-regex 'exemple\.com'       # trace détaillée des résolutions
rec_control dump-cache /tmp/cache.txt
```

## dnsdist

```bash
dnsdist --check-config
dnsdist -c                                   # console (controlSocket configuré)
# Dans la console :
#   showServers()
#   showRules()
#   topQueries(10)
#   topClients(10)
#   addAction(QNameRule("pub.exemple.net"), RCodeAction(DNSRCode.NXDOMAIN))
#   getPool(""):getCache():printStats()
```

## Tests

```bash
dig @10.0.10.53 exemple.fr SOA +short
dig @10.0.10.53 exemple.fr DNSKEY +dnssec
sudo journalctl -u pdns -u pdns-recursor -f
```
