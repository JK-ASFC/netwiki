---
title: Reverse proxy et répartition de charge
description: Publier des applications avec proxy_pass (en-têtes, délais, tampons, chemin et barre oblique finale), WebSocket, gRPC, upstreams et méthodes de répartition, connexions keep-alive vers les backends, sondes passives, affinité, IP réelle derrière un répartiteur.
tags: [nginx, reverse proxy, upstream, load balancing, websocket, grpc, proxy_pass]
icon: split
---

## Reverse proxy de base

```nginx /etc/nginx/snippets/proxy-headers.conf
proxy_http_version 1.1;
proxy_set_header Host              $host;
proxy_set_header X-Real-IP         $remote_addr;
proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
proxy_set_header X-Forwarded-Proto $scheme;
proxy_set_header X-Forwarded-Host  $host;
proxy_set_header X-Forwarded-Port  $server_port;
proxy_set_header Connection        "";          # keep-alive vers l'upstream
```

```nginx
server {
    listen 443 ssl;
    http2 on;
    server_name app.exemple.fr;
    ssl_certificate     /etc/nginx/certs/app.fullchain.pem;
    ssl_certificate_key /etc/nginx/certs/app.key;

    location / {
        include snippets/proxy-headers.conf;
        proxy_pass http://127.0.0.1:3000;
        proxy_connect_timeout 5s;
        proxy_read_timeout 60s;
        proxy_send_timeout 60s;
    }
}
```

### La barre oblique finale de proxy_pass

| Configuration | Requête | Transmis au backend |
| --- | --- | --- |
| `location /api/ { proxy_pass http://b:8080; }` | `/api/users` | `/api/users` (URI inchangée) |
| `location /api/ { proxy_pass http://b:8080/; }` | `/api/users` | `/users` (préfixe remplacé par `/`) |
| `location /api/ { proxy_pass http://b:8080/v2/; }` | `/api/users` | `/v2/users` |

> [!TIP]
> Avec une URI dans `proxy_pass` (même juste `/`), Nginx **remplace** la partie correspondant à la `location`. Sans URI, il transmet la requête telle quelle. C'est la source la plus fréquente de 404 côté backend.

### Réécrire les redirections et cookies du backend

```nginx
proxy_redirect http://127.0.0.1:3000/ https://app.exemple.fr/;
proxy_cookie_domain 127.0.0.1 app.exemple.fr;
proxy_cookie_path / "/; Secure; HttpOnly; SameSite=Lax";
```

### Backend HTTPS

```nginx
location / {
    proxy_pass https://app-interne.corp.exemple.fr:8443;
    proxy_ssl_server_name on;                         # SNI vers le backend
    proxy_ssl_verify on;
    proxy_ssl_trusted_certificate /etc/nginx/certs/corp-ca.pem;
    proxy_ssl_verify_depth 2;
}
```

## WebSocket

```nginx
# contexte http
map $http_upgrade $connection_upgrade {
    default upgrade;
    ''      close;
}

location /ws/ {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection $connection_upgrade;
    proxy_set_header Host $host;
    proxy_read_timeout 3600s;              # connexions longues
}
```

## gRPC

```nginx
server {
    listen 443 ssl;
    http2 on;
    server_name grpc.exemple.fr;
    location / {
        grpc_pass grpc://10.0.20.40:50051;        # grpcs:// pour un backend TLS
        grpc_set_header X-Real-IP $remote_addr;
    }
}
```

## Upstreams et répartition de charge

```nginx
upstream ferme_app {
    zone ferme_app 64k;                    # mémoire partagée (statistiques, résolution dynamique)
    least_conn;                            # méthode de répartition
    server 10.0.20.31:8080 weight=3 max_fails=3 fail_timeout=15s;
    server 10.0.20.32:8080 weight=1 max_fails=3 fail_timeout=15s;
    server 10.0.20.33:8080 backup;         # secours
    server 10.0.20.34:8080 down;           # retiré (maintenance)
    keepalive 32;                          # connexions persistantes vers les backends
}

server {
    location / {
        include snippets/proxy-headers.conf;
        proxy_pass http://ferme_app;
        proxy_next_upstream error timeout http_502 http_503 http_504;
        proxy_next_upstream_tries 2;
    }
}
```

| Méthode | Comportement |
| --- | --- |
| (défaut) | Tourniquet pondéré (`weight`) |
| `least_conn` | Serveur avec le moins de connexions actives |
| `ip_hash` | Affinité par IP cliente (/24 en IPv4) |
| `hash $cookie_session consistent` | Hachage cohérent sur une clé (cookie, URI) — limite les déplacements quand un serveur change |
| `random two least_conn` | Deux serveurs tirés au hasard, puis le moins chargé |

### Santé des backends

- **Sondes passives** (open source) : après `max_fails` échecs pendant `fail_timeout`, le serveur est écarté pendant `fail_timeout`.
- **Sondes actives** (`health_check`) : NGINX Plus uniquement. En open source, utilisez une supervision externe, ou placez [[01-haproxy/01-presentation|HAProxy]] pour les besoins avancés (sondes actives, statistiques, API runtime).

### Résolution DNS dynamique des backends

```nginx
resolver 10.0.10.53 valid=30s;
upstream api {
    zone api 64k;
    server api.service.consul:8080 resolve;    # 1.27.3+ en open source
}
```

Pour les versions antérieures : utiliser une variable dans `proxy_pass` (`set $backend http://api.interne:8080; proxy_pass $backend;`), qui force la résolution au fil de l'eau via `resolver`.

## Tampons et gros contenus

```nginx
proxy_buffering on;                 # off pour du streaming (SSE, longues réponses)
proxy_buffer_size 16k;              # en-têtes de réponse volumineux (gros cookies JWT)
proxy_buffers 8 32k;
proxy_busy_buffers_size 64k;
client_max_body_size 100m;          # téléversements
proxy_request_buffering off;        # transmettre les envois au fil de l'eau
```

> [!NOTE]
> Erreur `upstream sent too big header while reading response header` → augmenter `proxy_buffer_size` (et `proxy_buffers`). Pour des *Server-Sent Events* : `proxy_buffering off;` et `proxy_cache off;`.

## Nginx derrière un répartiteur ou un CDN : IP réelle

```nginx
set_real_ip_from 10.0.10.5;          # IP des répartiteurs de confiance
set_real_ip_from 10.0.10.6;
real_ip_header X-Forwarded-For;
real_ip_recursive on;

# Avec le protocole PROXY (HAProxy send-proxy-v2)
# listen 443 ssl proxy_protocol;
# real_ip_header proxy_protocol;
```

## Plusieurs applications sur un même nom

```nginx
location /grafana/ {
    include snippets/proxy-headers.conf;
    proxy_pass http://10.0.30.10:3000;          # Grafana avec root_url=/grafana/ et serve_from_sub_path=true
}
location /prometheus/ {
    include snippets/proxy-headers.conf;
    proxy_pass http://10.0.30.11:9090;          # --web.route-prefix=/prometheus
}
```

## Miroir de trafic (tests)

```nginx
location / {
    mirror /miroir;                 # copie chaque requête vers l'environnement de test (réponse ignorée)
    proxy_pass http://ferme_app;
}
location = /miroir {
    internal;
    proxy_pass http://10.0.50.10:8080$request_uri;
}
```

## Dépannage

| Message / symptôme | Cause |
| --- | --- |
| `502 Bad Gateway` + `connect() failed (111: Connection refused)` | Backend arrêté ou mauvais port |
| `connect() … (13: Permission denied)` (RHEL) | SELinux : `setsebool -P httpd_can_network_connect on` |
| `504 Gateway Time-out` + `upstream timed out` | Backend lent : `proxy_read_timeout`, ou problème applicatif |
| `no live upstreams while connecting to upstream` | Tous les membres écartés (`max_fails`) |
| `upstream prematurely closed connection` | Le backend ferme la connexion (keep-alive incompatible, crash) |
| Redirections vers `http://` ou vers l'IP interne | `X-Forwarded-Proto` / `Host` non transmis, `proxy_redirect` |
| WebSocket qui se coupe après 60 s | `proxy_read_timeout` trop court |
