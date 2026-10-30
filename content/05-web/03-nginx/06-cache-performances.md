---
title: Cache et performances
description: Réglages des workers et des connexions, sendfile et open_file_cache, compression gzip et Brotli, cache navigateur, cache de proxy et micro-cache (proxy_cache, clés, verrous, contenu périmé, purge), cache FastCGI et mesures de performance.
tags: [nginx, cache, proxy_cache, performance, gzip, brotli, tuning]
icon: gauge
---

## Workers et connexions

```nginx /etc/nginx/nginx.conf
worker_processes auto;                 # un par cœur
worker_rlimit_nofile 65535;            # descripteurs de fichiers par worker
events {
    worker_connections 8192;           # connexions simultanées par worker (clients + backends)
    multi_accept on;
}
```

Capacité théorique ≈ `worker_processes × worker_connections` (÷ 2 en reverse proxy : chaque requête ouvre aussi une connexion vers le backend). Augmentez aussi la limite systemd : `LimitNOFILE=65535` (surcharge `systemctl edit nginx`).

## Envoi des fichiers et keep-alive

```nginx
http {
    sendfile on;               # copie noyau → socket sans passer par l'espace utilisateur
    tcp_nopush on;             # en-têtes + début du fichier dans le même paquet
    tcp_nodelay on;
    keepalive_timeout 30s;
    keepalive_requests 1000;
    reset_timedout_connection on;
    server_tokens off;

    open_file_cache max=10000 inactive=60s;   # descripteurs et métadonnées des fichiers statiques
    open_file_cache_valid 120s;
    open_file_cache_min_uses 2;
    open_file_cache_errors on;
}
```

## Compression

```nginx
gzip on;
gzip_comp_level 5;
gzip_min_length 1024;
gzip_vary on;
gzip_proxied any;
gzip_types text/plain text/css text/xml application/javascript application/json application/xml image/svg+xml application/wasm;

# Fichiers pré-compressés (app.js.gz généré au build) : aucun coût CPU à l'exécution
gzip_static on;
```

Brotli nécessite le module `ngx_brotli` (paquet `libnginx-mod-http-brotli-*` sur certaines distributions, ou compilation) :

```nginx
brotli on;
brotli_comp_level 5;
brotli_static on;
brotli_types text/plain text/css application/javascript application/json image/svg+xml;
```

## Cache navigateur

```nginx
map $sent_http_content_type $expiration {
    default                    off;
    text/html                  epoch;          # pas de cache
    text/css                   1y;
    application/javascript     1y;
    ~image/                    30d;
    ~font/                     1y;
}
server {
    expires $expiration;
}
```

## Cache de proxy

```nginx
# contexte http
proxy_cache_path /var/cache/nginx/app levels=1:2 keys_zone=cache_app:50m max_size=5g inactive=7d use_temp_path=off;

server {
    location / {
        proxy_pass http://ferme_app;
        proxy_cache cache_app;
        proxy_cache_key "$scheme$request_method$host$request_uri";
        proxy_cache_valid 200 301 10m;
        proxy_cache_valid 404 1m;
        proxy_cache_lock on;                                    # une seule requête au backend pour un même objet manquant
        proxy_cache_use_stale error timeout updating http_500 http_502 http_503 http_504;
        proxy_cache_background_update on;                       # servir le périmé pendant le rafraîchissement
        proxy_cache_bypass $cookie_session $http_authorization; # pas de cache pour les utilisateurs connectés
        proxy_no_cache     $cookie_session $http_authorization;
        add_header X-Cache-Status $upstream_cache_status always;
    }
}
```

| `$upstream_cache_status` | Signification |
| --- | --- |
| `HIT` | Servi depuis le cache |
| `MISS` | Absent, demandé au backend |
| `EXPIRED` | Périmé, redemandé |
| `STALE` | Périmé mais servi (backend en erreur) |
| `UPDATING` | Périmé servi pendant la mise à jour |
| `BYPASS` | Cache volontairement contourné |

> [!WARNING]
> Ne mettez jamais en cache des réponses **personnalisées** (pages avec session, en-tête `Authorization`) sans les exclure : un utilisateur pourrait recevoir la page d'un autre. Par défaut, Nginx ne met pas en cache les réponses avec `Set-Cookie` ou `Cache-Control: private/no-store`.

### Micro-cache

Mettre en cache **une seconde** des pages dynamiques très demandées absorbe les pics sans risque d'obsolescence notable :

```nginx
proxy_cache_valid 200 1s;
proxy_cache_lock on;
proxy_cache_use_stale updating;
```

### Purger

La purge par URL (`proxy_cache_purge`) est réservée à NGINX Plus ou au module tiers `ngx_cache_purge`. Solutions en open source :

```bash
# Supprimer tout le cache
sudo find /var/cache/nginx/app -type f -delete
# Supprimer une entrée : le nom du fichier est le MD5 de la clé
echo -n "httpsGETwww.exemple.fr/accueil" | md5sum
```

ou forcer le rafraîchissement d'une URL avec un en-tête réservé aux administrateurs : `proxy_cache_bypass $http_x_refresh;` (et filtrer cet en-tête depuis l'extérieur).

## Cache FastCGI (PHP)

```nginx
fastcgi_cache_path /var/cache/nginx/php levels=1:2 keys_zone=cache_php:50m inactive=60m;
fastcgi_cache_key "$scheme$request_method$host$request_uri";

location ~ \.php$ {
    include fastcgi_params;
    fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
    fastcgi_pass unix:/run/php/php8.2-fpm.sock;
    fastcgi_cache cache_php;
    fastcgi_cache_valid 200 5m;
    fastcgi_cache_bypass $cookie_wordpress_logged_in $arg_preview;
    fastcgi_no_cache     $cookie_wordpress_logged_in $arg_preview;
    add_header X-FastCGI-Cache $upstream_cache_status;
}
```

## Fichiers volumineux et vidéos

```nginx
location /videos/ {
    mp4;                          # module ngx_http_mp4_module : lecture à une position (?start=)
    mp4_buffer_size 1m;
    aio threads;                  # lecture asynchrone dans un pool de threads
    directio 8m;
    output_buffers 2 1m;
}
location /telechargements/ {
    limit_rate_after 50m;         # pleine vitesse jusqu'à 50 Mo…
    limit_rate 2m;                # …puis 2 Mo/s
}
```

## Mesurer

```bash
# Charge (depuis une autre machine)
wrk -t4 -c200 -d30s https://www.exemple.fr/
h2load -n 10000 -c 100 https://www.exemple.fr/        # HTTP/2

# Temps de réponse : ajouter $request_time et $upstream_response_time au format de journal,
# puis repérer les URL lentes
awk '{print $NF, $7}' /var/log/nginx/access.log | sort -rn | head
```

Indicateurs : `stub_status` (connexions actives, en lecture/écriture/attente), taux de `HIT` du cache, temps upstream vs temps total (voir [[08-stream-logs-depannage]]).
