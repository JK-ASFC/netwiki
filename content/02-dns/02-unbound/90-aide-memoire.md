---
title: Unbound — aide-mémoire des commandes
description: Commandes Unbound avec exemples — vérification (unbound-checkconf), contrôle à distance (unbound-control setup, status, reload, flush, flush_zone, dump_cache, load_cache, stats, list_forwards, forward_add, local_data, local_zone), ancre de confiance DNSSEC (unbound-anchor), tests (dig, unbound-host), journaux et réglages courants.
tags: [aide-mémoire, unbound, unbound-control, dns, dnssec, cache]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-installation|Unbound]].

## Service et vérification

```bash
sudo unbound-checkconf                         # /etc/unbound/unbound.conf
sudo unbound-checkconf /etc/unbound/unbound.conf.d/local.conf
sudo systemctl restart unbound
sudo unbound-anchor -a /var/lib/unbound/root.key     # créer/mettre à jour l'ancre DNSSEC racine
unbound -V
```

## unbound-control

```bash
sudo unbound-control-setup                       # générer les certificats de contrôle (une fois)
sudo unbound-control status
sudo unbound-control reload                      # relire la configuration (vide le cache)
sudo unbound-control reload_keep_cache           # versions récentes : garder le cache
sudo unbound-control flush www.exemple.com       # un nom
sudo unbound-control flush_zone exemple.com      # une zone entière
sudo unbound-control flush_bogus                 # entrées DNSSEC invalides
sudo unbound-control flush_requestlist
sudo unbound-control dump_cache > /tmp/cache.txt
sudo unbound-control load_cache < /tmp/cache.txt
sudo unbound-control stats_noreset | grep -E "total.num.queries|cachehits|cachemiss"
sudo unbound-control list_forwards
sudo unbound-control forward_add corp.exemple.fr 10.0.10.11 10.0.10.12
sudo unbound-control forward_remove corp.exemple.fr
sudo unbound-control local_zone "pub.exemple.net" always_nxdomain     # bloquer un domaine
sudo unbound-control local_data "intranet.exemple.fr. 300 IN A 10.0.30.20"
sudo unbound-control local_data_remove intranet.exemple.fr
sudo unbound-control list_local_zones | head
sudo unbound-control lookup www.exemple.com      # quels serveurs seraient interrogés
sudo unbound-control verbosity 3                 # temporaire
sudo unbound-control set_option log-queries: yes
```

## Tests

```bash
dig @127.0.0.1 www.exemple.com
dig @127.0.0.1 dnssec-failed.org             # doit renvoyer SERVFAIL (validation active)
dig @127.0.0.1 www.isc.org +dnssec           # drapeau ad
unbound-host -v -r www.exemple.com           # résolution avec l'état DNSSEC
kdig @10.0.10.53 +tls www.exemple.com        # DNS over TLS si activé (port 853)
```

## Extraits de configuration fréquents

```ini
# /etc/unbound/unbound.conf.d/local.conf
server:
    interface: 0.0.0.0
    access-control: 10.0.0.0/8 allow
    access-control: 0.0.0.0/0 refuse
    hide-identity: yes
    hide-version: yes
    qname-minimisation: yes
    prefetch: yes
    local-zone: "exemple.fr." transparent
    local-data: "nas.exemple.fr. IN A 10.0.40.5"
forward-zone:
    name: "corp.exemple.fr."
    forward-addr: 10.0.10.11
```

## Journaux

```bash
sudo journalctl -u unbound -f
sudo unbound-control log_reopen
```
