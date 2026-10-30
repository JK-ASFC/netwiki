---
title: Server blocks, locations et configuration de base
description: Déclarer des sites (server, listen, server_name, default_server), root et alias, index et try_files, locations et expressions régulières, redirections et rewrite, return, map, pages d'erreur, PHP-FPM, applications monopages et listes de répertoires.
tags: [nginx, server block, location, try_files, rewrite, php-fpm, configuration]
icon: layers
---

## Un site statique

```nginx /etc/nginx/conf.d/intranet.conf
server {
    listen 80;
    listen [::]:80;
    server_name intranet.exemple.fr intranet;

    root /srv/www/intranet;
    index index.html;

    access_log /var/log/nginx/intranet.access.log;
    error_log  /var/log/nginx/intranet.error.log warn;

    location / {
        try_files $uri $uri/ =404;
    }
}
```

## Serveur par défaut

```nginx /etc/nginx/conf.d/00-default.conf
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    listen 443 ssl default_server;
    ssl_reject_handshake on;           # 1.19.4+ : refuse le TLS pour les noms inconnus, sans certificat
    server_name _;
    return 444;                        # ferme la connexion sans réponse
}
```

> [!IMPORTANT]
> Sans `default_server` explicite, le **premier** `server` chargé pour un port répond aux requêtes au nom inconnu ou à l'IP seule. Un serveur par défaut « muet » évite d'exposer un site par accident et réduit le bruit des scanners.

## server_name

```nginx
server_name exemple.fr www.exemple.fr;          # exacts
server_name *.exemple.fr;                       # joker en tête
server_name ~^(?<sousdomaine>.+)\.dev\.exemple\.fr$;   # regex avec capture nommée → $sousdomaine
```

## root, alias et try_files

```nginx
location /images/ {
    root /srv/static;              # /images/a.png → /srv/static/images/a.png
}
location /docs/ {
    alias /srv/partage/documentation/;   # /docs/a.pdf → /srv/partage/documentation/a.pdf (slash final des deux côtés !)
}

location / {
    try_files $uri $uri/ /index.html;    # application monopage (React, Vue, Angular)
}
```

> [!WARNING]
> `alias` dans une `location` sans slash final (`location /docs` + `alias /srv/doc/`) permet la traversée `GET /docs../secret` : gardez toujours le `/` final dans les deux.

## Locations courantes

```nginx
location = /favicon.ico { access_log off; log_not_found off; }
location = /robots.txt  { access_log off; log_not_found off; }

# Fichiers cachés (.git, .env, .htaccess)
location ~ /\. {
    deny all;
}

# Statiques avec cache long
location ~* \.(?:css|js|woff2|svg|png|jpg|jpeg|webp|avif)$ {
    expires 30d;
    add_header Cache-Control "public, immutable";
    access_log off;
}

# Zone d'administration filtrée
location ^~ /admin/ {
    allow 10.0.10.0/24;
    deny all;
    try_files $uri $uri/ =404;
}
```

## Redirections

```nginx
# HTTP → HTTPS
server {
    listen 80;
    server_name exemple.fr www.exemple.fr;
    return 301 https://www.exemple.fr$request_uri;
}

# Ancienne URL → nouvelle
location = /ancienne-page { return 301 /nouvelle-page; }

# Réécriture avec capture
rewrite ^/blog/(\d{4})/(.*)$ /articles/$2?annee=$1 permanent;
```

| Forme | Usage |
| --- | --- |
| `return 301 URL;` | Redirection simple, la plus rapide |
| `rewrite regex remplacement [last\|break\|redirect\|permanent];` | Réécriture avec expressions régulières |
| `last` | Relance la recherche de location avec la nouvelle URI |
| `break` | Reste dans la location courante |
| `redirect` / `permanent` | 302 / 301 externe |

## map : variables calculées

```nginx
# Dans le contexte http
map $http_upgrade $connection_upgrade {
    default upgrade;
    ''      close;
}

map $request_uri $nouvelle_url {
    default                 "";
    /ancien/contact.php     /contact;
    /ancien/tarifs.php      /offres;
    ~^/produit/(\d+)\.html$ /produits/$1;
}

server {
    if ($nouvelle_url) {
        return 301 $nouvelle_url;
    }
}
```

> [!TIP]
> « *If is evil* » : dans une `location`, `if` a des effets de bord surprenants. Utilisez-le seulement avec `return` ou `rewrite … last`, et préférez `map` pour les conditions.

## Pages d'erreur

```nginx
error_page 404 /erreurs/404.html;
error_page 500 502 503 504 /erreurs/50x.html;
location ^~ /erreurs/ {
    internal;                       # inaccessible directement
    root /srv/www/commun;
}
```

## PHP-FPM

```nginx
server {
    listen 443 ssl;
    server_name app.exemple.fr;
    root /srv/www/app/public;
    index index.php;

    location / {
        try_files $uri $uri/ /index.php?$query_string;    # contrôleur frontal (Laravel, Symfony, WordPress)
    }

    location ~ \.php$ {
        try_files $uri =404;                              # empêche l'exécution de fichiers inexistants
        fastcgi_split_path_info ^(.+\.php)(/.+)$;
        fastcgi_pass unix:/run/php/php8.2-fpm-app.sock;   # ou 127.0.0.1:9000
        fastcgi_index index.php;
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        fastcgi_param DOCUMENT_ROOT $realpath_root;
        fastcgi_read_timeout 60s;
    }

    # Pas d'exécution PHP dans les envois
    location ~* ^/uploads/.*\.php$ { deny all; }
}
```

Configuration des pools PHP-FPM : voir [[02-apache/05-php-applications|PHP-FPM]] (identique quel que soit le serveur web).

## Liste de répertoires

```nginx
location /miroir/ {
    alias /srv/miroir/;
    autoindex on;
    autoindex_exact_size off;
    autoindex_localtime on;
    autoindex_format html;     # ou json / xml pour des scripts
}
```

## Taille des envois et délais

```nginx
client_max_body_size 50m;        # 1m par défaut → erreur 413 au-delà
client_body_timeout 30s;
client_header_timeout 15s;
send_timeout 30s;
```

## Variables utiles

| Variable | Contenu |
| --- | --- |
| `$host` | Nom demandé (en-tête `Host` normalisé) |
| `$request_uri` | URI d'origine avec la chaîne de requête |
| `$uri` | URI normalisée, après réécriture, sans la chaîne de requête |
| `$args` / `$arg_nom` | Chaîne de requête / un paramètre |
| `$remote_addr` | IP du client (ou du proxy) |
| `$scheme` | `http` / `https` |
| `$http_<en-tête>` | En-tête de requête (`$http_user_agent`) |
| `$cookie_<nom>` | Cookie |
| `$request_time` | Durée de la requête |
| `$upstream_response_time` | Durée côté backend |
