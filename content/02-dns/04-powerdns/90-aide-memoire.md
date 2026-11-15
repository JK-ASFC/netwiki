---
title: PowerDNS — aide-mémoire des commandes
description: Référence complète des commandes PowerDNS avec exemples — paquets (autoritaire, backends, Recursor, dnsdist), pdnsutil (zones, enregistrements, édition, contrôle, rectification, import, secondaires, type et compte de zone, migration de backend), DNSSEC (sécurisation, clés : liste, activation, publication, NSEC3, DS) et TSIG (création, import, activation), pdns_control (statistiques, cache, notification, transfert, configuration courante), API REST (zones : liste, création, modification, export, rectification, notification, suppression ; recherche ; clés DNSSEC), Recursor (rec_control : cache, zones, Lua, traces, NTA, palmarès), dnsdist (console, commandes non interactives, serveurs, règles, statistiques, API), métriques Prometheus et tests.
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

## Paquets

```bash
# Paquets de la distribution ou du dépôt officiel repo.powerdns.com (voir l'article d'installation)
sudo apt install pdns-server pdns-backend-pgsql          # autoritaire + PostgreSQL (pdns-backend-mysql, pdns-backend-bind…)
sudo apt install pdns-recursor dnsdist
sudo dnf install pdns pdns-backend-postgresql pdns-recursor dnsdist   # RHEL (EPEL ou dépôt PowerDNS)
pdns_server --version ; pdns_recursor --version ; dnsdist --version
```

## pdnsutil : compléments

```bash
pdnsutil set-kind exemple.fr primary                     # native, primary, secondary
pdnsutil set-account exemple.fr equipe-reseau            # compte (filtrage dans les interfaces web)
pdnsutil add-record exemple.fr _sip._tls SRV "10 10 5061 pbx.exemple.fr"
pdnsutil add-record exemple.fr @ CAA '0 issue "letsencrypt.org"'
pdnsutil list-zone exemple.fr | grep -E "\sA\s"
pdnsutil create-zone 30.0.10.in-addr.arpa ns1.exemple.fr
pdnsutil add-record 30.0.10.in-addr.arpa 10 PTR www.exemple.fr
pdnsutil set-meta exemple.fr SOA-EDIT-API DEFAULT         # numéro de série incrémenté par les modifications API
pdnsutil b2b-migrate gmysql gpgsql                        # copier toutes les zones d'un backend vers un autre
```

## DNSSEC et TSIG : compléments

```bash
pdnsutil list-keys exemple.fr
pdnsutil activate-zone-key exemple.fr 3
pdnsutil deactivate-zone-key exemple.fr 2
pdnsutil publish-zone-key exemple.fr 3
pdnsutil unpublish-zone-key exemple.fr 2
pdnsutil remove-zone-key exemple.fr 2
pdnsutil set-presigned exemple.org                        # zone présignée reçue d'un primaire
pdnsutil list-tsig-keys
pdnsutil import-tsig-key transfert-ns2 hmac-sha256 'c2VjcmV0LWJhc2U2NC1mb3Vybmktc3VyLWxlLXByaW1haXJl'
pdnsutil delete-tsig-key ancienne-cle
```

## pdns_control : compléments

```bash
pdns_control current-config | grep -E "^(api|webserver|launch|primary|secondary)"
pdns_control list-zones
pdns_control bind-reload-now exemple.fr                   # backend BIND : relire un fichier de zone
pdns_control show uptime
pdns_control show query-cache-hit
```

## API REST : compléments

```bash
API=http://127.0.0.1:8081/api/v1/servers/localhost
H="X-API-Key: $CLE"
# Créer une zone
curl -s -X POST -H "$H" $API/zones -d '{"name":"nouvelle.fr.","kind":"Native","nameservers":["ns1.exemple.fr.","ns2.exemple.fr."],"soa_edit_api":"DEFAULT"}' | jq .id
# Supprimer un enregistrement
curl -s -X PATCH -H "$H" $API/zones/exemple.fr. -d '{"rrsets":[{"name":"ancien.exemple.fr.","type":"A","changetype":"DELETE"}]}'
# Export au format fichier de zone, rectification, notification, transfert (secondaire)
curl -s -H "$H" $API/zones/exemple.fr./export
curl -s -X PUT -H "$H" $API/zones/exemple.fr./rectify
curl -s -X PUT -H "$H" $API/zones/exemple.fr./notify
curl -s -X PUT -H "$H" $API/zones/exemple.org./axfr-retrieve
# Recherche dans toutes les zones
curl -s -H "$H" "$API/search-data?q=www*&max=20" | jq '.[] | {name, type, content}'
# Clés DNSSEC et DS
curl -s -H "$H" $API/zones/exemple.fr./cryptokeys | jq '.[] | {id, keytype, active, ds}'
curl -s -X DELETE -H "$H" $API/zones/nouvelle.fr.
```

## Recursor : compléments

```bash
rec_control get cache-entries
rec_control top-remotes                                   # clients les plus actifs
rec_control top-queries
rec_control top-servfail-queries
rec_control add-nta zone-cassee.exemple.org "DNSSEC défaillant chez le fournisseur"
rec_control get-ntas
rec_control clear-nta zone-cassee.exemple.org
rec_control reload-acls
rec_control quit-nicely
curl -s -H "X-API-Key: $CLE_REC" http://127.0.0.1:8082/metrics | grep -E "^pdns_recursor_(questions|cache_hits|cache_misses|servfail_answers)"
```

## dnsdist : compléments

```bash
dnsdist -c -e 'showServers()'                             # commande non interactive
dnsdist -c -e 'topQueries(20)'
dnsdist -c -e 'showDynBlocks()'
dnsdist -c -e 'dumpStats()'
dnsdist -c -e 'getServer(0):setDown()'                    # retirer un serveur de la rotation
dnsdist -c -e 'getServer(0):setAuto()'                    # rendre le contrôle de santé automatique
dnsdist -c -e 'grepq("exemple.com")'                      # requêtes récentes correspondant à un nom
curl -s -H "X-API-Key: $CLE_DNSDIST" http://127.0.0.1:8083/api/v1/servers/localhost/statistics | jq '.[0:10]'
curl -s -H "X-API-Key: $CLE" http://127.0.0.1:8081/metrics | grep -E "^pdns_auth_(udp_queries|tcp_queries|packetcache_hit)"
```
