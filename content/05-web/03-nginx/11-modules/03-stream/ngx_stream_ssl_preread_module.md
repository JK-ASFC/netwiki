---
title: "ngx_stream_ssl_preread_module"
description: "Module nginx ngx_stream_ssl_preread_module — Le module ngx_stream_ssl_preread_module (1.11.5) permet d'extraire des informations du message ClientHello sans terminer SSL/TLS, par exemple le nom de serveur demandé via SNI ou les protocoles annoncés dans ALPN. Ce…"
tags: [nginx, module, ngx_stream_ssl_preread_module]
icon: puzzle
---

Le module `ngx_stream_ssl_preread_module` (1.11.5) permet d'extraire des informations du message [ClientHello](https://datatracker.ietf.org/doc/html/rfc5246#section-7.4.1.2) sans terminer SSL/TLS, par exemple le nom de serveur demandé via [SNI](https://datatracker.ietf.org/doc/html/rfc6066#section-3) ou les protocoles annoncés dans [ALPN](https://datatracker.ietf.org/doc/html/rfc7301). Ce module n'est pas compilé par défaut ; activez-le avec le paramètre de configuration `--with-stream_ssl_preread_module`.

## Exemple de configuration

Choisir un groupe amont selon le nom de serveur :

```nginx
map $ssl_preread_server_name $name {
    backend.example.com      backend;
    default                  backend2;
}

upstream backend {
    server 192.168.0.1:12345;
    server 192.168.0.2:12345;
}

upstream backend2 {
    server 192.168.0.3:12345;
    server 192.168.0.4:12345;
}

server {
    listen      12346;
    proxy_pass  $name;
    ssl_preread on;
}
```

Choisir un groupe amont selon le protocole :

```nginx
map $ssl_preread_alpn_protocols $proxy {
    ~\bh2\b           127.0.0.1:8001;
    ~\bhttp/1.1\b     127.0.0.1:8002;
    ~\bxmpp-client\b  127.0.0.1:8003;
}

server {
    listen      9000;
    proxy_pass  $proxy;
    ssl_preread on;
}
```

Choisir un groupe amont selon la version du protocole SSL :

```nginx
map $ssl_preread_protocol $upstream {
    ""        ssh.example.com:22;
    "TLSv1.2" new.example.com:443;
    default   tls.example.com:443;
}

# ssh and https on the same port
server {
    listen      192.168.0.1:443;
    proxy_pass  $upstream;
    ssl_preread on;
}
```

## Directives

- [[12-directives/ssl-preread|ssl_preread]]

## Variables intégrées

- [[13-variables/ssl-preread-protocol|$ssl_preread_protocol]]
- [[13-variables/ssl-preread-server-name|$ssl_preread_server_name]]
- [[13-variables/ssl-preread-alpn-protocols|$ssl_preread_alpn_protocols]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
