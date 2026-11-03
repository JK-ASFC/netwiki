---
title: "ngx_http_upstream_module"
description: "Module nginx ngx_http_upstream_module — The ngx_http_upstream_module module is used to define groups of servers that can be referenced by the proxy_pass, fastcgi_pass, uwsgi_pass, scgi_pass, memcached_pass, and grpc_pass directives."
tags: [nginx, module, ngx_http_upstream_module]
icon: puzzle
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

The `ngx_http_upstream_module` module is used to define groups of servers that can be referenced by the [[12-directives/proxy-pass-http-proxy|proxy_pass]], [[12-directives/fastcgi-pass|fastcgi_pass]], [[12-directives/uwsgi-pass|uwsgi_pass]], [[12-directives/scgi-pass|scgi_pass]], [[12-directives/memcached-pass|memcached_pass]], and [[12-directives/grpc-pass|grpc_pass]] directives.

## Exemple de configuration

```nginx
upstream backend {
    server backend1.example.com       weight=5;
    server backend2.example.com:8080;
    server unix:/tmp/backend3;

    server backup1.example.com:8080   backup;
    server backup2.example.com:8080   backup;
}

server {
    location / {
        proxy_pass http://backend;
    }
}
```

Dynamically configurable group with periodic [[11-modules/02-http/ngx_http_upstream_hc_module|health checks]] is available as part of our [abonnement commercial](https://nginx.com/products/):

```nginx
resolver 10.0.0.1;

upstream dynamic {
    zone upstream_dynamic 64k;

    server backend1.example.com      weight=5;
    server backend2.example.com:8080 fail_timeout=5s slow_start=30s;
    server 192.0.2.1                 max_fails=3;
    server backend3.example.com      resolve;
    server backend4.example.com      service=http resolve;

    server backup1.example.com:8080  backup;
    server backup2.example.com:8080  backup;
}

server {
    location / {
        proxy_pass http://dynamic;
        health_check;
    }
}
```

## Directives

- [[12-directives/upstream-http-upstream|upstream]]
- [[12-directives/server-http-upstream|server]]
- [[12-directives/zone-http-upstream|zone]]
- [[12-directives/state-http-upstream|state]]
- [[12-directives/hash-http-upstream|hash]]
- [[12-directives/ip-hash|ip_hash]]
- [[12-directives/keepalive|keepalive]]
- [[12-directives/keepalive-requests-http-upstream|keepalive_requests]]
- [[12-directives/keepalive-time-http-upstream|keepalive_time]]
- [[12-directives/keepalive-timeout-http-upstream|keepalive_timeout]]
- [[12-directives/ntlm|ntlm]]
- [[12-directives/least-conn-http-upstream|least_conn]]
- [[12-directives/least-time-http-upstream|least_time]]
- [[12-directives/queue|queue]]
- [[12-directives/random-http-upstream|random]]
- [[12-directives/resolver-http-upstream|resolver]]
- [[12-directives/resolver-timeout-http-upstream|resolver_timeout]]
- [[12-directives/sticky|sticky]]

## Variables intégrées

- [[13-variables/upstream-addr-http-upstream|$upstream_addr]]
- [[13-variables/upstream-bytes-received-http-upstream|$upstream_bytes_received]]
- [[13-variables/upstream-bytes-sent-http-upstream|$upstream_bytes_sent]]
- [[13-variables/upstream-cache-status|$upstream_cache_status]]
- [[13-variables/upstream-connect-time-http-upstream|$upstream_connect_time]]
- [[13-variables/upstream-cookie-name|$upstream_cookie_name]]
- [[13-variables/upstream-header-time|$upstream_header_time]]
- [[13-variables/upstream-http-name|$upstream_http_name]]
- [[13-variables/upstream-last-addr-http-upstream|$upstream_last_addr]]
- [[13-variables/upstream-last-server-name|$upstream_last_server_name]]
- [[13-variables/upstream-queue-time|$upstream_queue_time]]
- [[13-variables/upstream-response-length|$upstream_response_length]]
- [[13-variables/upstream-response-time|$upstream_response_time]]
- [[13-variables/upstream-status|$upstream_status]]
- [[13-variables/upstream-trailer-name|$upstream_trailer_name]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
