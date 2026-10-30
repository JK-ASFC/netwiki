---
title: Nginx — aide-mémoire des commandes
description: Commandes Nginx avec exemples — vérification et rechargement (nginx -t, -T, -s reload), service, blocs server HTTP/HTTPS, redirections, proxy inverse et WebSocket, équilibrage (upstream), cache, limitation de débit, restrictions d'accès, authentification de base, certificats (certbot), journaux et formats, tests (curl), Windows et macOS.
tags: [aide-mémoire, nginx, reverse proxy, certbot, upstream, web]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation|Nginx]].

## Service et vérification

```bash
sudo nginx -t                         # tester la configuration
sudo nginx -T | less                  # tester et afficher la configuration complète chargée
sudo nginx -s reload                  # recharger sans couper
sudo systemctl reload nginx
sudo nginx -V 2>&1 | tr ' ' '\n' | grep module     # modules compilés
sudo ss -ltnp | grep nginx
```

## Site HTTPS et redirection

```nginx
# /etc/nginx/sites-available/intranet (Debian) ou /etc/nginx/conf.d/intranet.conf
server {
    listen 80;
    server_name intranet.exemple.fr;
    return 301 https://$host$request_uri;
}
server {
    listen 443 ssl;
    http2 on;
    server_name intranet.exemple.fr;
    ssl_certificate     /etc/letsencrypt/live/intranet.exemple.fr/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/intranet.exemple.fr/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    add_header Strict-Transport-Security "max-age=31536000" always;
    root /var/www/intranet;
    index index.html;
    location / { try_files $uri $uri/ =404; }
    location /admin/ { allow 10.0.99.0/24; deny all; }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/intranet /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

## Proxy inverse, WebSocket, équilibrage

```nginx
upstream app_backend {
    least_conn;
    server 10.0.30.21:8080 max_fails=3 fail_timeout=30s;
    server 10.0.30.22:8080 max_fails=3 fail_timeout=30s;
    keepalive 32;
}
server {
    listen 443 ssl;
    server_name app.exemple.fr;
    ssl_certificate     /etc/ssl/certs/app.crt;
    ssl_certificate_key /etc/ssl/private/app.key;
    client_max_body_size 100m;
    location / {
        proxy_pass http://app_backend;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_read_timeout 300s;
    }
}
```

## Cache, limitation, authentification

```nginx
proxy_cache_path /var/cache/nginx/app levels=1:2 keys_zone=app_cache:50m max_size=2g inactive=60m;
limit_req_zone $binary_remote_addr zone=connexion:10m rate=5r/m;
server {
    location /static/ {
        proxy_cache app_cache;
        proxy_cache_valid 200 302 10m;
        add_header X-Cache $upstream_cache_status;
        proxy_pass http://app_backend;
    }
    location = /login {
        limit_req zone=connexion burst=5 nodelay;
        proxy_pass http://app_backend;
    }
    location /prive/ {
        auth_basic "Zone protégée";
        auth_basic_user_file /etc/nginx/.htpasswd;
    }
}
```

```bash
sudo htpasswd -c -B /etc/nginx/.htpasswd amartin     # paquet apache2-utils / httpd-tools
```

## Certificats

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d intranet.exemple.fr -m admin@exemple.fr --agree-tos --redirect
sudo certbot renew --dry-run
openssl s_client -connect intranet.exemple.fr:443 -servername intranet.exemple.fr </dev/null 2>/dev/null | openssl x509 -noout -dates -subject
```

## Journaux et tests

```bash
sudo tail -f /var/log/nginx/access.log /var/log/nginx/error.log
awk '{print $9}' /var/log/nginx/access.log | sort | uniq -c | sort -rn
awk '{print $1}' /var/log/nginx/access.log | sort | uniq -c | sort -rn | head      # IP les plus actives
curl -I -H "Host: intranet.exemple.fr" http://127.0.0.1/
curl -sk --resolve app.exemple.fr:443:10.0.30.10 https://app.exemple.fr/health
```

```nginx
# Format JSON pour un SIEM
log_format json escape=json '{"time":"$time_iso8601","ip":"$remote_addr","req":"$request","status":$status,"bytes":$body_bytes_sent,"rt":$request_time,"ua":"$http_user_agent"}';
access_log /var/log/nginx/access.json json;
```

## Windows et macOS

```powershell
cd C:\nginx; start nginx; .\nginx.exe -t; .\nginx.exe -s reload; .\nginx.exe -s quit
```

```bash
brew install nginx && brew services start nginx      # macOS, port 8080 par défaut, conf /opt/homebrew/etc/nginx
```
