---
title: Présentation, installation et configuration
description: Apache Traffic Server (ATS) — proxy et cache HTTP haute performance (Yahoo, Apple, Comcast) : rôles (reverse proxy, cache de CDN, proxy direct), installation Debian/Ubuntu, RHEL, FreeBSD, compilation, fichiers (records.yaml ou records.config, remap.config, storage.config, ip_allow.yaml, sni.yaml, ssl_multicert.config, parent.config, logging.yaml), règles de cache, TLS, hiérarchie de caches parents, plugins (header_rewrite, cache_promote, s3_auth), traffic_ctl, traffic_top, journaux et comparaison avec Varnish et Squid.
tags: [apache traffic server, ats, cache http, cdn, reverse proxy, traffic_ctl]
icon: info
---

**Apache Traffic Server** (ATS, Apache 2.0) est un proxy-cache HTTP conçu pour les **CDN** et les très gros volumes : multi-thread, cache disque brut de plusieurs To, hiérarchies de caches. Pour un site unique, [[03-varnish/01-presentation-installation|Varnish]] ou [[03-nginx/01-presentation|NGINX]] sont plus simples ; ATS brille dès qu'il faut un cache massif et réparti.

## Installation

```bash
sudo apt install trafficserver            # Debian/Ubuntu (port 8080 par défaut)
sudo dnf install trafficserver            # Fedora / RHEL (EPEL)
sudo pkg install trafficserver            # FreeBSD
sudo systemctl enable --now trafficserver
traffic_ctl metric get proxy.process.version.server.short
```

Fichiers dans `/etc/trafficserver/`. La configuration générale passe de `records.config` (9.x) à **`records.yaml`** (10.x) ; `traffic_ctl` fonctionne de la même façon.

## Reverse proxy avec cache

```yaml
# records.yaml (ATS 10) — extraits
records:
  http:
    server_ports: "80 443:ssl"
    cache:
      required_headers: 2           # ne cacher que si Expires ou Cache-Control max-age
  reverse_proxy:
    enabled: 1
  url_remap:
    remap_required: 1               # refuser toute requête sans règle de remap
```

```text
# remap.config — client → origine
map https://www.corp.exemple.fr/ http://10.0.20.10:8080/
map https://static.corp.exemple.fr/ http://10.0.20.11/ @plugin=header_rewrite.so @pparam=static.conf
regex_map http://(.*)\.cdn\.corp\.exemple\.fr/ http://$1.origine.corp.exemple.fr/
```

```text
# storage.config — espace de cache
/var/cache/trafficserver 50G
# ou disque brut dédié (meilleures performances)
# /dev/sdb
```

```text
# ssl_multicert.config
dest_ip=* ssl_cert_name=/etc/trafficserver/ssl/corp.exemple.fr.pem ssl_key_name=/etc/trafficserver/ssl/corp.exemple.fr.key
```

```bash
sudo traffic_ctl config reload        # appliquer remap.config et la plupart des réglages
sudo traffic_ctl server restart       # pour storage.config et les ports
```

## Hiérarchie et accès

- `parent.config` : envoyer les absences de cache vers des caches parents (`dest_domain=. parent="cache-p1:8080; cache-p2:8080" round_robin=consistent_hash`).
- `ip_allow.yaml` : quelles adresses peuvent utiliser le proxy et quelles méthodes (PURGE réservé à l'administration).
- `logging.yaml` : formats de journaux (`squid`, `common`, personnalisés), sortie dans `/var/log/trafficserver/`.

## Supervision

```bash
traffic_top                                                     # tableau de bord en temps réel
traffic_ctl metric get proxy.process.http.completed_requests
traffic_ctl metric match cache_hit
curl -X PURGE -H "Host: www.corp.exemple.fr" http://127.0.0.1/images/logo.png
```

Plugin `stats_over_http` pour exposer les métriques (export vers [[02-prometheus/01-presentation-installation|Prometheus]]).

## Greffons (plugins)

ATS est extensible par greffons (globaux dans `plugin.config`, ou par règle avec `@plugin=` dans `remap.config`) :

| Greffon | Rôle |
| --- | --- |
| `header_rewrite` | Réécrire/ajouter/supprimer des en-têtes selon des conditions |
| `cache_promote` | Ne mettre en cache qu'après N accès (évite de polluer le cache) |
| `cache_range_requests` | Mettre en cache les requêtes `Range` (vidéo, gros fichiers) |
| `s3_auth` | Signer les requêtes vers un stockage objet S3 en origine |
| `regex_remap` | Remap par expressions régulières |
| `compress` | Compression gzip/brotli à la volée |
| `xdebug` | En-têtes de débogage (`X-Cache`, `Via`) via l'en-tête `X-Debug` |
| `lua` / `ts_lua` | Logique sur mesure en Lua |
| `prometheus` / `stats_over_http` | Exposition des métriques |

## traffic_ctl et outils

```bash
traffic_ctl config get proxy.config.http.cache.required_headers   # lire un paramètre
traffic_ctl config set proxy.config.http.insert_age_in_response 0 # écrire (persistant)
traffic_ctl config diff                                           # écarts par rapport aux valeurs par défaut
traffic_ctl config reload          # recharger (remap, header_rewrite, la plupart des records)
traffic_ctl server restart         # redémarrage (ports, storage.config)
traffic_ctl metric match hit       # tous les compteurs contenant « hit »
traffic_ctl plugin msg <plugin> <message>   # message à un greffon à chaud
traffic_logstats -f /var/log/trafficserver/access.log           # statistiques des journaux
traffic_server -C verify_config    # vérifier la configuration
```

Taux de succès du cache : `proxy.process.http.cache_hit_ratio` (via `traffic_ctl metric get`). Commandes : [[90-aide-memoire|aide-mémoire]].
