---
title: Reverse proxy et répartition de charge
description: Directive reverse_proxy de Caddy (en-têtes, backends HTTPS, WebSocket, gRPC), répartition de charge (politiques, sondes actives et passives, nouvelles tentatives), backends dynamiques, authentification déléguée (forward_auth) et publication d'applications internes.
tags: [caddy, reverse proxy, load balancing, forward_auth, websocket, health check]
icon: split
---

## Reverse proxy minimal

```caddy
app.exemple.fr {
    reverse_proxy 127.0.0.1:3000
}
```

Caddy transmet automatiquement `X-Forwarded-For`, `X-Forwarded-Proto`, `X-Forwarded-Host` et conserve l'en-tête `Host`. **WebSocket** et **HTTP/2 côté client** sont gérés sans configuration.

## En-têtes et réponses

```caddy
app.exemple.fr {
    reverse_proxy 127.0.0.1:3000 {
        header_up X-Real-IP {remote_host}
        header_up -Authorization          # ne pas transmettre un en-tête
        header_down -X-Powered-By         # masquer un en-tête de réponse
        header_down Strict-Transport-Security "max-age=31536000"
    }
}
```

> [!NOTE]
> Derrière un autre proxy ou un CDN, déclarez les proxys de confiance pour que `{client_ip}` et `X-Forwarded-For` reflètent le vrai client :
> ```caddy
> {
>     servers {
>         trusted_proxies static 10.0.10.5/32 10.0.10.6/32
>     }
> }
> ```

## Backend HTTPS

```caddy
reverse_proxy https://app-interne.corp.exemple.fr:8443 {
    transport http {
        tls_server_name app-interne.corp.exemple.fr
        tls_trusted_ca_certs /etc/caddy/certs/corp-ca.pem
        # tls_insecure_skip_verify     # à éviter en production
        dial_timeout 5s
        response_header_timeout 60s
    }
}
```

## gRPC et h2c

```caddy
grpc.exemple.fr {
    reverse_proxy h2c://10.0.20.40:50051
}
```

## Plusieurs applications

```caddy
outils.exemple.fr {
    handle_path /grafana/* {
        reverse_proxy 10.0.30.10:3000      # Grafana configuré avec root_url=/grafana/
    }
    handle /api/* {
        reverse_proxy 10.0.20.31:8080
    }
    handle {
        reverse_proxy 10.0.20.30:80
    }
}
```

Le plus simple reste souvent **un sous-domaine par application** : aucune réécriture de chemin, certificats automatiques pour chaque nom.

## Répartition de charge

```caddy
app.exemple.fr {
    reverse_proxy 10.0.20.31:8080 10.0.20.32:8080 10.0.20.33:8080 {
        lb_policy least_conn
        lb_retries 2
        lb_try_duration 5s
        lb_try_interval 250ms

        # Sondes actives
        health_uri /health
        health_interval 10s
        health_timeout 3s
        health_status 2xx
        health_body "OK"

        # Sondes passives
        fail_duration 30s
        max_fails 3
        unhealthy_status 5xx
        unhealthy_latency 3s
    }
}
```

| `lb_policy` | Comportement |
| --- | --- |
| `random` (défaut) | Aléatoire |
| `round_robin` / `weighted_round_robin 3 1 1` | Tourniquet (pondéré) |
| `least_conn` | Moins de requêtes en cours |
| `first` | Le premier disponible (actif/passif) |
| `ip_hash` / `client_ip_hash` | Affinité par IP |
| `uri_hash` | Même URI → même backend (caches) |
| `header X-Tenant` | Hachage d'un en-tête |
| `cookie lb_affinite` | Affinité par cookie (posé par Caddy) |
| `random_choose 2` | Deux tirés au hasard, le moins chargé |

### Backends dynamiques

```caddy
reverse_proxy {
    dynamic a app.service.consul 8080 {        # résolution DNS A/AAAA périodique
        refresh 30s
    }
    # dynamic srv _app._tcp.service.consul     # enregistrements SRV
}
```

## Authentification déléguée (SSO) : forward_auth

```caddy
grafana.exemple.fr {
    forward_auth 127.0.0.1:9091 {
        uri /api/authz/forward-auth             # Authelia
        copy_headers Remote-User Remote-Groups Remote-Email Remote-Name
    }
    reverse_proxy 10.0.30.10:3000
}

auth.exemple.fr {
    reverse_proxy 127.0.0.1:9091                # portail Authelia
}
```

Même principe avec **oauth2-proxy** (Keycloak, Entra ID) ou **Authentik**.

## Filtrage d'accès avant le proxy

```caddy
admin.exemple.fr {
    @externe not remote_ip 10.0.10.0/24 192.168.50.0/24
    respond @externe "Accès refusé" 403
    reverse_proxy 10.0.20.50:8080
}
```

## Délais et tampons

```caddy
reverse_proxy 127.0.0.1:3000 {
    flush_interval -1          # streaming immédiat (Server-Sent Events, logs en direct)
    request_buffers 4MiB
    transport http {
        read_timeout 5m
        write_timeout 5m
        keepalive 90s
        keepalive_idle_conns 64
    }
}
```

## Interception des réponses du backend

```caddy
reverse_proxy 127.0.0.1:3000 {
    @erreur status 502 503 504
    handle_response @erreur {
        root * /srv/erreurs
        rewrite * /maintenance.html
        file_server
    }
}
```

## Exemple complet : petite infrastructure

```caddy /etc/caddy/Caddyfile
{
    email admin@exemple.fr
}

(commun) {
    encode zstd gzip
    header -Server
    log {
        output file /var/log/caddy/{args[0]}.log {
            roll_size 50MiB
            roll_keep 10
        }
        format json
    }
}

wiki.exemple.fr {
    import commun wiki
    reverse_proxy 10.0.30.20:3000
}

nextcloud.exemple.fr {
    import commun nextcloud
    request_body {
        max_size 10GB
    }
    redir /.well-known/carddav /remote.php/dav 301
    redir /.well-known/caldav /remote.php/dav 301
    reverse_proxy 10.0.30.21:80
}

supervision.exemple.fr {
    import commun supervision
    @externe not remote_ip 10.0.0.0/8
    respond @externe 403
    reverse_proxy 10.0.30.30:80
}
```
