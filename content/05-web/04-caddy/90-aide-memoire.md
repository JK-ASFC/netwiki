---
title: Caddy — aide-mémoire des commandes
description: Référence complète des commandes Caddy 2 avec exemples — installation (dépôt Debian/Ubuntu, COPR Fedora/RHEL, Alpine, Arch, FreeBSD, macOS, Windows, conteneur), service et Caddyfile, commandes (run, start, stop, reload, fmt, validate, adapt, environ, list-modules, add-package, storage export), commandes rapides sans fichier, Caddyfile type, journaux JSON et analyse jq, autorité de certification interne, emplacement des certificats, API d'administration (configuration, chargement d'un Caddyfile, amont, métriques), modules additionnels et xcaddy.
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

## Installation

```bash
# Debian / Ubuntu : dépôt officiel
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https curl
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update && sudo apt install caddy
# Fedora / RHEL
sudo dnf copr enable @caddy/caddy && sudo dnf install caddy
sudo apk add caddy                                     # Alpine
sudo pacman -S caddy                                   # Arch
sudo pkg install caddy && sudo sysrc caddy_enable=YES  # FreeBSD
brew install caddy                                     # macOS
choco install caddy                                    # Windows (ou scoop install caddy)
docker run -d --name caddy -p 80:80 -p 443:443 -p 443:443/udp -v /srv/caddy/Caddyfile:/etc/caddy/Caddyfile -v caddy_data:/data caddy:2
```

## Commandes complémentaires

```bash
sudo systemctl reload caddy                            # = caddy reload --config /etc/caddy/Caddyfile
caddy fmt --overwrite /etc/caddy/Caddyfile             # mise en forme
caddy adapt --config /etc/caddy/Caddyfile --pretty     # Caddyfile → JSON
caddy environ                                          # variables et chemins (stockage des certificats)
caddy list-modules --versions
sudo caddy add-package github.com/caddy-dns/ovh        # binaire non empaqueté seulement
sudo caddy storage export --config /etc/caddy/Caddyfile --output /srv/sauvegardes/caddy-stockage-$(date +%F).tar   # certificats et clés
# Construire un binaire avec un module (défi DNS-01 chez OVH)
xcaddy build --with github.com/caddy-dns/ovh
```

## Journaux JSON et analyse

```caddy /etc/caddy/Caddyfile (extrait)
intranet.exemple.fr {
    log {
        output file /var/log/caddy/intranet.log {
            roll_size 50mb
            roll_keep 5
        }
        format json
    }
    reverse_proxy 10.0.30.10:8080
}
```

```bash
sudo jq -r 'select(.status >= 500) | [.ts, .request.remote_ip, .request.uri, .status] | @tsv' /var/log/caddy/intranet.log | tail
sudo jq -r '.duration' /var/log/caddy/intranet.log | sort -rn | head      # durées les plus longues (s)
sudo journalctl -u caddy -f | grep -iE "error|certificate|acme"
```

## Certificats et autorité interne

```bash
# Paquet Debian/RHEL : stockage dans le répertoire du compte caddy
sudo ls /var/lib/caddy/.local/share/caddy/certificates/
# Racine de l'AC interne (« tls internal ») à distribuer aux postes
sudo cat /var/lib/caddy/.local/share/caddy/pki/authorities/local/root.crt
openssl s_client -connect intranet.exemple.fr:443 -servername intranet.exemple.fr </dev/null | openssl x509 -noout -issuer -enddate
```

## API d'administration (localhost:2019)

```bash
curl -s localhost:2019/config/ | jq .
curl -s localhost:2019/reverse_proxy/upstreams | jq '.[] | {address, num_requests, fails}'
curl -s localhost:2019/load -H "Content-Type: text/caddyfile" --data-binary @/etc/caddy/Caddyfile   # charger un Caddyfile
curl -s localhost:2019/metrics | grep -E "^caddy_http_requests_total" | head                         # option globale « metrics »
curl -s -X POST localhost:2019/stop
```
