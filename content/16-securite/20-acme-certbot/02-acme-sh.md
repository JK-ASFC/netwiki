---
title: acme.sh
description: acme.sh — client ACME écrit en shell POSIX, sans dépendance (Linux, BSD, macOS, routeurs, WSL) : installation pour un utilisateur, AC par défaut (ZeroSSL) et choix de Let's Encrypt, modes webroot, standalone, nginx et apache, plus de 150 API DNS (Cloudflare, OVH, Gandi, PowerDNS, nsupdate RFC 2136, Infoblox…), mode alias DNS (délégation _acme-challenge), certificats ECC, installation des certificats dans les services (--install-cert et --reloadcmd), déploiement vers des équipements (hooks deploy : HAProxy, Synology, routeurs, FortiGate…), renouvellement par cron et mises à jour.
tags: [acme.sh, acme, letsencrypt, zerossl, dns-01, certificats]
icon: info
---

**acme.sh** est un client ACME en **shell pur** : il fonctionne partout (serveurs minimalistes, NAS, routeurs, conteneurs) et prend en charge un très grand nombre de **fournisseurs DNS** pour le défi DNS-01, ainsi que des scripts de **déploiement** vers des équipements (HAProxy, Synology, pare-feu…).

## Installation

```bash
curl https://get.acme.sh | sh -s email=admin@corp.exemple.fr     # installe dans ~/.acme.sh et crée une tâche cron
source ~/.bashrc
acme.sh --set-default-ca --server letsencrypt                   # l'AC par défaut est ZeroSSL
```

## Obtenir des certificats

```bash
acme.sh --issue -d www.corp.exemple.fr -w /var/www/html                            # webroot
acme.sh --issue --standalone -d srv-app-01.corp.exemple.fr                         # serveur temporaire (port 80)
export OVH_AK=… OVH_AS=… OVH_CK=…
acme.sh --issue --dns dns_ovh -d corp.exemple.fr -d '*.corp.exemple.fr' --keylength ec-256   # DNS-01, ECC
export NSUPDATE_SERVER=10.0.10.53 NSUPDATE_KEY=/etc/acme/tsig.key
acme.sh --issue --dns dns_nsupdate -d '*.interne.corp.exemple.fr'                  # BIND en RFC 2136
```

**Mode alias** : si le DNS principal n'a pas d'API, créer un CNAME `_acme-challenge.corp.exemple.fr` vers une zone dédiée gérable (`--challenge-alias acme.exemple.net`).

## Installer et déployer

```bash
acme.sh --install-cert -d www.corp.exemple.fr --ecc \
  --key-file /etc/nginx/tls/www.key --fullchain-file /etc/nginx/tls/www.crt --reloadcmd "systemctl reload nginx"
export DEPLOY_HAPROXY_PEM_PATH=/etc/haproxy/certs DEPLOY_HAPROXY_RELOAD="systemctl reload haproxy"
acme.sh --deploy -d corp.exemple.fr --ecc --deploy-hook haproxy
acme.sh --list ; acme.sh --cron --home ~/.acme.sh       # renouvellement (tâche cron quotidienne installée)
```

Commandes : [[90-aide-memoire|aide-mémoire]].
