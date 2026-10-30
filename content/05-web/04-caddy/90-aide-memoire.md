---
title: Caddy — aide-mémoire des commandes
description: Commandes Caddy avec exemples — service, validation, formatage et rechargement du Caddyfile, commandes rapides (file-server, reverse-proxy), API d'administration (config, load), certificats automatiques (ACME, interne), modules (caddy list-modules, add-package, xcaddy), Caddyfile type (HTTPS, proxy, en-têtes, compression, authentification, journaux).
tags: [aide-mémoire, caddy, caddyfile, reverse proxy, https, acme]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-installation|Caddy]].

## Service et Caddyfile

```bash
sudo systemctl status caddy
caddy validate --config /etc/caddy/Caddyfile
caddy fmt --overwrite /etc/caddy/Caddyfile
sudo systemctl reload caddy                       # ou : caddy reload --config /etc/caddy/Caddyfile
caddy adapt --config /etc/caddy/Caddyfile --pretty     # voir la configuration JSON résultante
caddy version
caddy list-modules | head
sudo journalctl -u caddy -f
```

## Commandes rapides (sans fichier)

```bash
caddy file-server --root /srv/partage --browse --listen :8080
caddy reverse-proxy --from app.exemple.fr --to 10.0.30.21:8080
caddy respond --listen :9000 "OK"
caddy hash-password --plaintext 'MotDePasse'          # pour basic_auth
caddy trust                                            # installer l'AC locale de Caddy (certificats internes)
```

## Caddyfile type

```caddyfile
{
    email admin@exemple.fr
}

intranet.exemple.fr {
    root * /var/www/intranet
    file_server
    encode zstd gzip
    header {
        Strict-Transport-Security "max-age=31536000"
        -Server
    }
    log {
        output file /var/log/caddy/intranet.log
        format json
    }
}

app.exemple.fr {
    reverse_proxy 10.0.30.21:8080 10.0.30.22:8080 {
        lb_policy least_conn
        health_uri /health
    }
    @admin path /admin*
    handle @admin {
        @interne remote_ip 10.0.99.0/24
        handle @interne {
            reverse_proxy 10.0.30.21:8080
        }
        respond 403
    }
}

prive.exemple.fr {
    basic_auth {
        amartin $2a$14$...empreinte...
    }
    reverse_proxy 10.0.30.30:3000
}

# Certificat émis par l'AC interne de Caddy (réseau privé)
nas.maison.lan {
    tls internal
    reverse_proxy 192.168.1.5:5000
}
```

## API d'administration

```bash
curl -s localhost:2019/config/ | jq .
curl -s localhost:2019/reverse_proxy/upstreams | jq .
curl -X POST localhost:2019/load -H "Content-Type: application/json" -d @caddy.json
```

## Modules additionnels

```bash
sudo caddy add-package github.com/caddy-dns/cloudflare     # binaire officiel modifié (DNS-01)
xcaddy build --with github.com/caddy-dns/ovh                 # compilation personnalisée
```
