---
title: "HTTP avancé : ACL, routage, en-têtes, stick-tables, cache"
description: Écrire des ACL (host, path, méthodes, IP, en-têtes), router vers les backends, maps, redirections, manipulation des en-têtes et des chemins, limitation de débit et anti-abus avec les stick-tables, authentification basique, cache et compression, CORS et maintenance.
tags: [haproxy, acl, routage, stick-table, rate limiting, headers, cache, maps]
icon: workflow
---

## ACL

```haproxy
frontend fe_https
    bind :443 ssl crt /etc/haproxy/certs/ alpn h2,http/1.1

    acl est_api        hdr(host) -i api.exemple.fr
    acl chemin_admin   path_beg -i /admin
    acl chemin_static  path_end .css .js .png .svg .woff2
    acl reseau_admin   src 10.0.10.0/24 192.168.50.0/24
    acl methode_ecriture method POST PUT PATCH DELETE
    acl mobile         req.hdr(User-Agent) -m sub -i mobile
    acl a_session      req.cook(session) -m found

    http-request deny deny_status 403 if chemin_admin !reseau_admin
    use_backend be_api    if est_api
    use_backend be_static if chemin_static
    default_backend be_web
```

| Échantillon (*fetch*) | Contenu |
| --- | --- |
| `hdr(host)`, `req.hdr(nom)` | En-têtes de requête |
| `path`, `path_beg`, `path_end`, `path_reg`, `url_param(nom)` | Chemin, paramètres |
| `method` | Méthode HTTP |
| `src`, `src_port` | IP / port source |
| `ssl_fc`, `ssl_fc_sni`, `ssl_c_s_dn` | Informations TLS |
| `req.cook(nom)` | Cookie |
| `res.hdr(nom)`, `status` | Réponse |
| `nbsrv(backend)` | Nombre de serveurs UP dans un backend |

Comparateurs : `-i` (insensible à la casse), `-m str|beg|end|sub|reg|found|len`. Combinaisons : ET implicite, `||` (OU), `!` (NON). ACL anonymes : `if { path_beg /api }`.

## Maps : routage par table

```text /etc/haproxy/maps/hotes.map
www.exemple.fr        be_web
api.exemple.fr        be_api
grafana.exemple.fr    be_outils
supervision.exemple.fr be_outils
```

```haproxy
frontend fe_https
    use_backend %[req.hdr(host),lower,map(/etc/haproxy/maps/hotes.map,be_web)]
```

Les maps se modifient **à chaud** via l'API runtime (`add map`, `set map`) sans rechargement.

## Redirections

```haproxy
http-request redirect scheme https code 301 unless { ssl_fc }
http-request redirect prefix https://www.exemple.fr code 301 if { hdr(host) -i exemple.fr }
http-request redirect location /maintenance.html code 302 if { nbsrv(be_web) eq 0 } !{ path /maintenance.html }

# Redirections en masse depuis une map
http-request redirect location %[path,map_str(/etc/haproxy/maps/redirections.map)] code 301 if { path,map_str(/etc/haproxy/maps/redirections.map) -m found }
```

## Manipuler requêtes et réponses

```haproxy
# Requête
http-request set-header X-Forwarded-Proto https if { ssl_fc }
http-request set-header X-Request-ID %[uuid]
http-request del-header Proxy                              # protection « httpoxy »
http-request replace-path ^/v1/(.*) /api/\1
http-request set-path %[path,regsub(^/app/,/)]             # retirer un préfixe
http-request set-var(txn.host) req.hdr(host)

# Réponse
http-response set-header Strict-Transport-Security "max-age=31536000; includeSubDomains"
http-response set-header X-Content-Type-Options nosniff
http-response del-header Server
http-response del-header X-Powered-By
http-response replace-header Location ^http://(.*) https://\1
http-response set-header X-Served-By %s                    # nom du serveur qui a répondu (débogage)
```

### CORS

```haproxy
http-request return status 204 hdr Access-Control-Allow-Origin "%[req.hdr(origin)]" hdr Access-Control-Allow-Methods "GET, POST, OPTIONS" hdr Access-Control-Allow-Headers "Authorization, Content-Type" if METH_OPTIONS { req.hdr(origin) -m end .exemple.fr }
http-response set-header Access-Control-Allow-Origin "%[var(txn.origin)]" if { var(txn.origin) -m end .exemple.fr }
http-request set-var(txn.origin) req.hdr(origin)
```

## Stick-tables : limitation de débit et anti-abus

Une **stick-table** mémorise des compteurs par clé (IP, cookie, en-tête) : débit de requêtes, connexions simultanées, taux d'erreurs.

```haproxy
backend st_par_ip
    stick-table type ipv6 size 1m expire 10m store http_req_rate(10s),http_err_rate(10s),conn_cur,gpc0

frontend fe_https
    bind :443 ssl crt /etc/haproxy/certs/
    http-request track-sc0 src table st_par_ip

    # Plus de 100 requêtes / 10 s → 429
    http-request deny deny_status 429 if { sc_http_req_rate(0) gt 100 }
    # Plus de 20 connexions simultanées par IP
    http-request deny deny_status 429 if { sc_conn_cur(0) gt 20 }
    # Beaucoup d'erreurs 4xx (scan) → blocage pour la durée d'expiration
    http-request sc-inc-gpc0(0) if { sc_http_err_rate(0) gt 20 }
    http-request deny if { sc_get_gpc0(0) gt 0 }

    # Brute force sur la page de connexion
    acl login path /login
    http-request deny deny_status 429 if login METH_POST { sc_http_req_rate(0) gt 10 }
```

> [!TIP]
> Exemptez les sondes de supervision et les réseaux internes (`acl confiance src -f /etc/haproxy/listes/confiance.lst`) et testez d'abord avec `http-request set-header X-Abus 1 if …` plutôt qu'un `deny`.

Consulter une table : `echo "show table st_par_ip" | socat stdio /run/haproxy/admin.sock`.

### Listes de blocage

```haproxy
acl ip_bloquees src -f /etc/haproxy/listes/ip-bloquees.lst
http-request deny if ip_bloquees
```

Le fichier se met à jour à chaud via l'API (`add acl /etc/haproxy/listes/ip-bloquees.lst 198.51.100.7`).

## Authentification basique

```haproxy
userlist admins
    user alice password $6$rounds=5000$sel$hash...      # mkpasswd -m sha-512
    user bruno password $6$...

backend be_admin
    http-request auth realm "Administration" unless { http_auth(admins) }
    server admin01 10.0.20.50:8080 check
```

## Cache et compression

```haproxy
cache cache_statique
    total-max-size 512          # Mo
    max-object-size 1048576     # octets
    max-age 600

backend be_static
    http-request cache-use cache_statique
    http-response cache-store cache_statique
    http-response set-header X-Cache-Status HIT if !{ srv_id -m found }
    compression algo gzip
    compression type text/html text/css application/javascript application/json image/svg+xml
    server static01 10.0.20.41:80 check
```

Le cache d'HAProxy est volontairement simple (petits objets, en mémoire) ; pour un cache HTTP complet, voir [[03-varnish/01-presentation-installation|Varnish]].

## Maintenance et routage conditionnel

```haproxy
frontend fe_https
    # Page de maintenance si aucun serveur n'est disponible
    use_backend be_maintenance if { nbsrv(be_web) eq 0 }
    # Déploiement canari : 10 % du trafic vers la nouvelle version
    use_backend be_web_v2 if { rand(100) lt 10 }
    default_backend be_web

backend be_maintenance
    http-request return status 503 content-type "text/html" file /etc/haproxy/errors/maintenance.html
```

## Journaliser des informations supplémentaires

```haproxy
frontend fe_https
    http-request capture req.hdr(Host) len 64
    http-request capture req.hdr(User-Agent) len 128
    http-response capture res.hdr(Content-Type) len 32
```

Les valeurs capturées apparaissent entre accolades dans la ligne de journal `httplog`.
