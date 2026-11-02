---
title: Blocky
description: Blocky — proxy DNS filtrant léger en Go, sans interface web, configuré en YAML (amonts chiffrés, groupes de listes par client, mise en cache et préchargement, mappage DNS personnalisé, transfert conditionnel, journal des requêtes en base), adapté à Kubernetes et aux déploiements sans état, installation binaire et conteneur, métriques Prometheus et tableau de bord Grafana, API REST.
tags: [blocky, dns filtrant, yaml, kubernetes, prometheus, doh]
icon: shield-check
---

**Blocky** (Apache 2.0) est un **proxy DNS filtrant sans interface** : toute la configuration est dans un fichier YAML, ce qui le rend idéal pour l'infrastructure en code, Kubernetes et la haute disponibilité (plusieurs instances identiques, état partagé possible par Redis). Les statistiques passent par **Prometheus** et [[03-grafana/01-presentation-installation|Grafana]].

## Installation

```bash
docker run -d --name blocky -p 53:53/udp -p 53:53/tcp -p 4000:4000 -v /etc/blocky/config.yml:/app/config.yml spx01/blocky
# ou binaire des Releases GitHub (Linux, Windows, macOS, FreeBSD) avec un service systemd
```

## Configuration

```yaml /etc/blocky/config.yml
upstreams:
  groups:
    default:
      - https://dns.quad9.net/dns-query
      - tcp-tls:dns.adguard-dns.com:853
conditional:
  mapping:
    corp.exemple.fr: 10.0.10.11,10.0.10.12
    20.0.10.in-addr.arpa: 10.0.10.11
customDNS:
  mapping:
    wiki.corp.exemple.fr: 10.0.20.30
blocking:
  denylists:
    publicite:
      - https://raw.githubusercontent.com/StevenBlack/hosts/master/hosts
    malveillant:
      - https://urlhaus.abuse.ch/downloads/hostfile/
  allowlists:
    publicite:
      - |
        site-metier.example
  clientGroupsBlock:
    default: [publicite, malveillant]
    10.0.50.0/24: [malveillant]           # réseau d'invités : uniquement les domaines malveillants
caching:
  minTime: 5m
  prefetching: true
ports:
  dns: 53
  http: 4000
prometheus:
  enable: true
queryLog:
  type: csv
  target: /var/log/blocky
  logRetentionDays: 7
```

Vérifiez la syntaxe exacte des clés dans la documentation de la version utilisée (certaines ont été renommées au fil des versions, par exemple `blackLists` → `denylists`).

## Exploitation

```bash
curl -s http://localhost:4000/api/blocking/status
curl -s -X POST http://localhost:4000/api/lists/refresh
curl -s http://localhost:4000/metrics | grep blocky_query_total | head
dig @localhost wiki.corp.exemple.fr +short
```

Commandes : [[90-aide-memoire|aide-mémoire]].
