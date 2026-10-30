---
title: API, PKI interne, TLS à la demande et modules
description: Piloter Caddy par l'API d'administration et la configuration JSON, utiliser l'autorité de certification interne (tls internal, serveur ACME interne), le TLS à la demande pour les domaines clients, le stockage partagé en cluster, et compiler des modules avec xcaddy.
tags: [caddy, api, json, pki, acme, on-demand tls, xcaddy, modules]
icon: settings-2
---

## API d'administration

Par défaut l'API écoute sur `localhost:2019` (jamais exposée sur le réseau).

```bash
curl -s localhost:2019/config/ | jq .                                   # configuration courante (JSON)
curl -s localhost:2019/config/apps/http/servers | jq 'keys'
caddy adapt --config /etc/caddy/Caddyfile > caddy.json                  # convertir un Caddyfile
curl -X POST localhost:2019/load -H "Content-Type: application/json" -d @caddy.json   # charger (sans coupure)
curl -s localhost:2019/reverse_proxy/upstreams | jq .                   # état des backends (requêtes, échecs)
curl -X POST localhost:2019/stop
```

Modification ciblée d'un élément (chemin JSON) :

```bash
# Ajouter un backend à la première route du serveur srv0
curl -X POST localhost:2019/config/apps/http/servers/srv0/routes/0/handle/0/upstreams \
  -H "Content-Type: application/json" -d '{"dial":"10.0.20.34:8080"}'
```

```caddy
{
    admin 127.0.0.1:2019 {
        origins localhost 127.0.0.1         # en-têtes Origin acceptés
    }
    # admin off                             # désactiver l'API (les rechargements passent alors par un redémarrage)
}
```

> [!WARNING]
> Quiconque accède à l'API peut **remplacer toute la configuration** (et donc rediriger le trafic). Gardez-la sur localhost ou un socket Unix (`admin unix//run/caddy/admin.sock`), et n'utilisez jamais `admin 0.0.0.0:2019`.

> [!NOTE]
> Avec le service `caddy` standard, un `caddy reload` relit le Caddyfile : les modifications faites par l'API sont **écrasées** au prochain rechargement. Pour une gestion 100 % API, utilisez le service `caddy-api` (`--resume` : reprend la dernière configuration autosauvegardée).

## PKI interne

Caddy embarque une **autorité de certification** (racine + intermédiaire) générée au premier usage.

```caddy
{
    pki {
        ca local {
            name "Exemple - AC interne Caddy"
            root_cn "Exemple Caddy Root"
            intermediate_cn "Exemple Caddy Intermediate"
        }
    }
}

grafana.lab.local {
    tls internal
    reverse_proxy 10.0.30.10:3000
}
```

```bash
# Racine à déployer sur les postes (GPO, MDM)
sudo cat /var/lib/caddy/.local/share/caddy/pki/authorities/local/root.crt
caddy trust      # l'installer dans le magasin du système local
```

### Caddy comme serveur ACME interne

D'autres serveurs (Caddy, certbot, Traefik, acme.sh) obtiennent leurs certificats internes auprès de ce Caddy comme auprès de Let's Encrypt :

```caddy
acme.lab.local {
    tls internal
    acme_server {
        ca local
        lifetime 7d
        allow {
            domains *.lab.local
        }
    }
}
```

```caddy
# Sur un autre serveur Caddy
{
    acme_ca https://acme.lab.local/acme/local/directory
    acme_ca_root /etc/caddy/certs/caddy-root.crt
}
```

> [!TIP]
> Pour une PKI d'entreprise complète (révocation, modèles, identité Active Directory), préférez [[01-active-directory/10-adcs-pki|AD CS]] ou **step-ca** ; la PKI de Caddy est idéale pour les laboratoires et les services internes simples.

## TLS à la demande (on-demand TLS)

Pour une plateforme où les **clients pointent leurs propres domaines** vers vos serveurs (SaaS, hébergement) : Caddy obtient le certificat **à la première connexion TLS** pour le nom demandé.

```caddy
{
    on_demand_tls {
        ask http://127.0.0.1:5555/domaine-autorise     # doit répondre 200 si le domaine est un client légitime
    }
}

https:// {
    tls {
        on_demand
    }
    reverse_proxy 127.0.0.1:8080
}
```

> [!CAUTION]
> Sans endpoint `ask`, n'importe qui pourrait faire émettre des certificats pour des domaines arbitraires pointant vers votre IP (abus, limites de taux). L'option `ask` est **obligatoire en pratique**.

## Cluster : stockage partagé

Plusieurs instances Caddy derrière un répartiteur doivent partager certificats et verrous ACME :

```caddy
{
    storage file_system /mnt/partage-nfs/caddy
    # ou un module : storage redis / consul / s3 (binaire compilé avec le module correspondant)
}
```

## Modules tiers : xcaddy

```bash
go install github.com/caddyserver/xcaddy/cmd/xcaddy@latest
xcaddy build \
  --with github.com/caddy-dns/ovh \
  --with github.com/caddy-dns/rfc2136 \
  --with github.com/mholt/caddy-ratelimit \
  --with github.com/corazawaf/coraza-caddy/v2
sudo dpkg-divert --divert /usr/bin/caddy.default --rename /usr/bin/caddy   # préserver le binaire du paquet (Debian)
sudo mv ./caddy /usr/bin/caddy.custom
sudo update-alternatives --install /usr/bin/caddy caddy /usr/bin/caddy.default 10
sudo update-alternatives --install /usr/bin/caddy caddy /usr/bin/caddy.custom 50
sudo systemctl restart caddy
caddy list-modules | grep -E "dns|rate|coraza"
```

Le site caddyserver.com propose aussi un **générateur de binaires** avec les modules choisis.

| Module populaire | Usage |
| --- | --- |
| `caddy-dns/<fournisseur>` | Défi DNS-01 (wildcard) |
| `caddy-ratelimit` | Limitation de débit |
| `coraza-caddy` | WAF compatible OWASP CRS |
| `caddy-l4` | Proxy TCP/UDP (couche 4), routage par SNI |
| `caddy-security` | Authentification (OAuth2, SAML, LDAP) intégrée |
| `cache-handler` | Cache HTTP |

### Exemple : WAF Coraza + OWASP CRS

```caddy
{
    order coraza_waf first
}
www.exemple.fr {
    coraza_waf {
        load_owasp_crs
        directives `
            Include @coraza.conf-recommended
            Include @crs-setup.conf.example
            Include @owasp_crs/*.conf
            SecRuleEngine DetectionOnly
        `
    }
    reverse_proxy 127.0.0.1:8080
}
```

### Exemple : limitation de débit

```caddy
{
    order rate_limit before basic_auth
}
api.exemple.fr {
    rate_limit {
        zone par_ip {
            key {remote_host}
            events 100
            window 1m
        }
    }
    reverse_proxy 127.0.0.1:8080
}
```
