---
title: "ngx_http_memcached_module"
description: "Module nginx ngx_http_memcached_module — Le module ngx_http_memcached_module sert à obtenir les réponses d'un serveur memcached. La clé est définie dans la variable $memcached_key. La réponse doit avoir été placée dans memcached au préalable par un moyen…"
tags: [nginx, module, ngx_http_memcached_module]
icon: puzzle
---

Le module `ngx_http_memcached_module` sert à obtenir les réponses d'un serveur memcached. La clé est définie dans la variable `$memcached_key`. La réponse doit avoir été placée dans memcached au préalable par un moyen extérieur à nginx.

## Exemple de configuration

```nginx
server {
    location / {
        set            $memcached_key "$uri?$args";
        memcached_pass host:11211;
        error_page     404 502 504 = @fallback;
    }

    location @fallback {
        proxy_pass     http://backend;
    }
}
```

## Directives

- [[12-directives/memcached-allow-upstream|memcached_allow_upstream]]
- [[12-directives/memcached-bind|memcached_bind]]
- [[12-directives/memcached-bind-dynamic|memcached_bind_dynamic]]
- [[12-directives/memcached-buffer-size|memcached_buffer_size]]
- [[12-directives/memcached-connect-timeout|memcached_connect_timeout]]
- [[12-directives/memcached-gzip-flag|memcached_gzip_flag]]
- [[12-directives/memcached-next-upstream|memcached_next_upstream]]
- [[12-directives/memcached-next-upstream-timeout|memcached_next_upstream_timeout]]
- [[12-directives/memcached-next-upstream-tries|memcached_next_upstream_tries]]
- [[12-directives/memcached-pass|memcached_pass]]
- [[12-directives/memcached-read-timeout|memcached_read_timeout]]
- [[12-directives/memcached-send-timeout|memcached_send_timeout]]
- [[12-directives/memcached-socket-keepalive|memcached_socket_keepalive]]

## Variables intégrées

- [[13-variables/memcached-key|$memcached_key]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
