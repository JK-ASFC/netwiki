---
title: Sécurité, limitation de débit et authentification
description: Durcissement de Nginx (version, méthodes, en-têtes, fichiers sensibles), contrôle d'accès par IP et géolocalisation, limitation de débit et de connexions, authentification basique, authentification déléguée (auth_request vers Authelia/oauth2-proxy), WAF (ModSecurity) et liste de contrôle.
tags: [nginx, sécurité, limit_req, rate limiting, auth_request, waf, durcissement]
icon: shield
---

## Durcissement de base

```nginx /etc/nginx/snippets/securite.conf
add_header X-Content-Type-Options "nosniff" always;
add_header X-Frame-Options "SAMEORIGIN" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;
add_header Content-Security-Policy "default-src 'self'; img-src 'self' data:; object-src 'none'; frame-ancestors 'self'; base-uri 'self'" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
```

```nginx /etc/nginx/nginx.conf (http)
server_tokens off;                   # « Server: nginx » sans version
client_max_body_size 10m;
client_body_buffer_size 16k;
large_client_header_buffers 4 16k;
```

```nginx
server {
    include snippets/securite.conf;

    # Méthodes autorisées
    if ($request_method !~ ^(GET|HEAD|POST)$) { return 405; }

    # Fichiers cachés et sauvegardes
    location ~ /\.(?!well-known) { deny all; }
    location ~* \.(bak|old|orig|sql|swp|log|ini|env)$ { deny all; }
}
```

> [!IMPORTANT]
> Rappel : `add_header` n'est hérité que si le niveau courant n'en déclare **aucun**. Incluez `snippets/securite.conf` dans chaque `location` qui ajoute ses propres en-têtes.

Pour supprimer complètement l'en-tête `Server` ou masquer `X-Powered-By` d'un backend :

```nginx
proxy_hide_header X-Powered-By;
fastcgi_hide_header X-Powered-By;
more_clear_headers Server;           # module headers-more (libnginx-mod-http-headers-more-filter)
```

## Contrôle d'accès par IP

```nginx
location /admin/ {
    allow 10.0.10.0/24;
    allow 2001:db8:10::/48;
    deny all;
}

# Listes réutilisables avec geo
geo $reseau_admin {
    default        0;
    10.0.10.0/24   1;
    192.168.50.0/24 1;
}
server {
    location /admin/ {
        if ($reseau_admin = 0) { return 403; }
    }
}
```

### Géolocalisation (GeoIP2)

```nginx
load_module modules/ngx_http_geoip2_module.so;
http {
    geoip2 /usr/share/GeoIP/GeoLite2-Country.mmdb {
        $geoip2_pays country iso_code;
    }
    map $geoip2_pays $pays_autorise {
        default no;
        FR yes; BE yes; CH yes; LU yes;
    }
}
server {
    location /extranet/ {
        if ($pays_autorise = no) { return 403; }
    }
}
```

## Limitation de débit (limit_req)

```nginx
# http : zones de comptage par IP
limit_req_zone $binary_remote_addr zone=par_ip:20m rate=10r/s;
limit_req_zone $binary_remote_addr zone=connexion:10m rate=5r/m;
limit_req_status 429;
limit_conn_zone $binary_remote_addr zone=conn_ip:10m;
limit_conn_status 429;

server {
    location / {
        limit_req zone=par_ip burst=40 nodelay;    # 10 req/s, rafales de 40 tolérées sans délai
        limit_conn conn_ip 50;                     # 50 connexions simultanées par IP
        proxy_pass http://ferme_app;
    }
    location = /login {
        limit_req zone=connexion burst=5;          # anti brute force : 5 tentatives par minute
        proxy_pass http://ferme_app;
    }
}
```

| Paramètre | Effet |
| --- | --- |
| `rate=10r/s` | Débit moyen autorisé |
| `burst=40` | Requêtes en excès acceptées en file |
| `nodelay` | Les requêtes du *burst* sont servies immédiatement (sinon lissées) |
| `delay=20` | Les 20 premières en excès sans délai, les suivantes lissées |
| `limit_req_dry_run on` | Mode observation (journalise sans bloquer) |

> [!TIP]
> Exemptez les réseaux de confiance (sondes de supervision, NAT d'entreprise) : la clé de zone peut être une variable vide pour eux, car une clé vide n'est pas comptée.
> ```nginx
> geo $limite { default 1; 10.0.0.0/8 0; }
> map $limite $cle_limite { 0 ""; 1 $binary_remote_addr; }
> limit_req_zone $cle_limite zone=par_ip:20m rate=10r/s;
> ```

## Authentification basique

```bash
sudo apt install apache2-utils           # htpasswd (RHEL : httpd-tools)
sudo htpasswd -c -B /etc/nginx/.htpasswd-admin alice
```

```nginx
location /admin/ {
    auth_basic "Administration";
    auth_basic_user_file /etc/nginx/.htpasswd-admin;
}

# Accès sans mot de passe depuis le réseau d'administration, mot de passe sinon
location /outils/ {
    satisfy any;
    allow 10.0.10.0/24;
    deny all;
    auth_basic "Outils";
    auth_basic_user_file /etc/nginx/.htpasswd-admin;
}
```

## Authentification déléguée : auth_request (SSO)

Nginx interroge un service d'authentification **pour chaque requête** ; un 2xx autorise, un 401/403 refuse. Fonctionne avec **Authelia**, **oauth2-proxy** (Keycloak, Entra ID, Google), **Authentik**.

```nginx
server {
    server_name grafana.exemple.fr;

    location = /internal/auth {
        internal;
        proxy_pass http://127.0.0.1:9091/api/authz/auth-request;     # Authelia
        proxy_pass_request_body off;
        proxy_set_header Content-Length "";
        proxy_set_header X-Original-Method $request_method;
        proxy_set_header X-Original-URL $scheme://$http_host$request_uri;
        proxy_set_header X-Forwarded-For $remote_addr;
    }

    location / {
        auth_request /internal/auth;
        auth_request_set $utilisateur $upstream_http_remote_user;
        auth_request_set $groupes $upstream_http_remote_groups;
        proxy_set_header Remote-User $utilisateur;
        proxy_set_header Remote-Groups $groupes;
        error_page 401 =302 https://auth.exemple.fr/?rd=$scheme://$http_host$request_uri;
        proxy_pass http://10.0.30.10:3000;
    }
}
```

L'application en aval (ex. Grafana avec `auth.proxy`) fait confiance à l'en-tête `Remote-User` : assurez-vous qu'il est **toujours** écrasé par Nginx et que l'application n'est pas joignable directement.

## Certificats clients

Voir [[04-https-tls]] (section mTLS).

## Pare-feu applicatif

| Solution | Intégration |
| --- | --- |
| **ModSecurity v3** + connecteur `ModSecurity-nginx` + OWASP CRS | Module dynamique (`modsecurity on; modsecurity_rules_file …;`) — même logique de réglage que pour [[02-apache/07-securite-authentification\|Apache]] |
| **Coraza** (successeur moderne, compatible CRS) | Via proxy (Caddy, Envoy) ou module expérimental |
| **NAXSI** | WAF par liste blanche (projet peu maintenu) |
| **CrowdSec** (bouncer Nginx) | Blocage d'IP selon la réputation et la détection comportementale |

## Interdire l'accès direct par IP et les noms inconnus

Voir le serveur par défaut avec `return 444` dans [[03-server-blocks-locations]].

## Liste de contrôle

- [ ] `server_tokens off`, en-têtes de sécurité dans un extrait inclus partout
- [ ] Serveur par défaut muet (`444`, `ssl_reject_handshake on`)
- [ ] HTTPS uniquement, TLS 1.2+, HSTS
- [ ] Fichiers cachés et sauvegardes refusés, pas d'`autoindex` hors besoin
- [ ] `alias` toujours avec slash final
- [ ] Zones d'administration : filtrage IP + authentification
- [ ] `limit_req` sur les pages de connexion et les API
- [ ] `client_max_body_size` adapté par site
- [ ] Nginx à jour (avis de sécurité nginx.org)
- [ ] Journaux centralisés, alertes sur les 429/401/5xx
