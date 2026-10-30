---
title: CrowdSec — aide-mémoire des commandes
description: Commandes CrowdSec avec exemples — cscli (hub : collections, parseurs, scénarios ; décisions : liste, ajout, suppression ; alertes ; bouncers ; machines ; métriques ; explain ; console), acquisition des journaux, bouncers (pare-feu nftables, Nginx, Traefik), listes de blocage, liste blanche, Windows, Docker.
tags: [aide-mémoire, crowdsec, cscli, bouncer, sécurité, ips]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-installation|CrowdSec]].

## Hub et collections

```bash
sudo cscli hub update && sudo cscli hub upgrade
sudo cscli collections list
sudo cscli collections install crowdsecurity/nginx crowdsecurity/sshd crowdsecurity/linux
sudo cscli parsers list
sudo cscli scenarios list
sudo cscli scenarios inspect crowdsecurity/ssh-bf
sudo systemctl reload crowdsec
```

## Décisions et alertes

```bash
sudo cscli decisions list
sudo cscli decisions list --origin crowdsec -o json | jq '.[].decisions[0].value'
sudo cscli decisions add --ip 203.0.113.50 --duration 24h --reason "Balayage manuel"
sudo cscli decisions add --range 198.51.100.0/24 --duration 4h
sudo cscli decisions delete --ip 203.0.113.50
sudo cscli alerts list
sudo cscli alerts inspect 42 -d
```

## Bouncers et machines

```bash
sudo apt install crowdsec-firewall-bouncer-nftables
sudo cscli bouncers list
sudo cscli bouncers add bouncer-traefik           # affiche la clé d'API à reporter dans le bouncer
sudo cscli bouncers delete ancien-bouncer
sudo cscli machines list
```

## Diagnostic

```bash
sudo cscli metrics                                 # lignes lues, analysées, buckets, décisions
sudo cscli explain --file /var/log/nginx/access.log --type nginx
sudo cscli explain --log "Failed password for root from 203.0.113.50 port 51234 ssh2" --type syslog
sudo cscli config show | head
sudo tail -f /var/log/crowdsec.log
```

```yaml
# /etc/crowdsec/acquis.d/nginx.yaml
filenames:
  - /var/log/nginx/access.log
  - /var/log/nginx/error.log
labels:
  type: nginx
```

## Liste blanche

```yaml
# /etc/crowdsec/parsers/s02-enrich/liste-blanche.yaml
name: exemple/liste-blanche
description: "Réseaux d'administration"
whitelist:
  reason: "Réseau interne"
  cidr:
    - "10.0.99.0/24"
```

## Console et Docker

```bash
sudo cscli console enroll <jeton>                  # rattacher à la console CrowdSec (listes de blocage, tableau de bord)
docker exec crowdsec cscli decisions list
```
