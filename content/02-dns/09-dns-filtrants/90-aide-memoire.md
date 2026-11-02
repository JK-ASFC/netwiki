---
title: DNS filtrants — aide-mémoire des commandes
description: Commandes AdGuard Home (service, vérification de configuration, API), Pi-hole (pihole status, enable, disable, -g, -q, allow, deny, setpassword, -up, tail, FTL config, API) et Blocky (API blocking, refresh, cache, métriques), tests de blocage avec dig.
tags: [aide-mémoire, adguard home, pi-hole, blocky, dns]
icon: terminal
---

Références : [[01-adguard-home|AdGuard Home]], [[02-pi-hole|Pi-hole]], [[03-blocky|Blocky]].

## AdGuard Home

```bash
sudo /opt/AdGuardHome/AdGuardHome -s status ; sudo /opt/AdGuardHome/AdGuardHome -s restart
sudo /opt/AdGuardHome/AdGuardHome --check-config -c /opt/AdGuardHome/AdGuardHome.yaml
curl -s -u admin:MotDePasse http://dns-filtre:80/control/status | jq .
curl -s -u admin:MotDePasse http://dns-filtre:80/control/stats | jq '.num_dns_queries, .num_blocked_filtering'
curl -s -u admin:MotDePasse -X POST http://dns-filtre:80/control/filtering/refresh -d '{"whitelist":false}'
```

## Pi-hole

```bash
pihole status ; pihole -v
pihole disable 5m ; pihole enable
pihole -g                                   # mettre à jour les listes (gravity)
pihole -q doubleclick.net                   # dans quelle liste est ce domaine ?
pihole allow site-metier.example ; pihole deny domaine-malveillant.example
pihole -up                                  # mettre à jour Pi-hole
pihole setpassword
pihole tail                                 # journal en direct
pihole-FTL --config dns.upstreams
docker exec -it pihole pihole status
```

## Blocky

```bash
curl -s http://localhost:4000/api/blocking/status
curl -s http://localhost:4000/api/blocking/disable?duration=10m ; curl -s http://localhost:4000/api/blocking/enable
curl -s -X POST http://localhost:4000/api/lists/refresh ; curl -s -X POST http://localhost:4000/api/cache/flush
```

## Tests

```bash
dig @dns-filtre doubleclick.net +short       # 0.0.0.0 ou NXDOMAIN si bloqué
dig @dns-filtre srv-ad-01.corp.exemple.fr +short
```
