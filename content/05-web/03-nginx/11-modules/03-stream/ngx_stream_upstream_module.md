---
title: "ngx_stream_upstream_module"
description: "Module nginx ngx_stream_upstream_module — The ngx_stream_upstream_module module (1.9.0) is used to define groups of servers that can be referenced by the proxy_pass directive."
tags: [nginx, module, ngx_stream_upstream_module]
icon: puzzle
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

The `ngx_stream_upstream_module` module (1.9.0) is used to define groups of servers that can be referenced by the [[12-directives/proxy-pass-stream-proxy|proxy_pass]] directive.

## Example Configuration

```nginx
upstream backend {
    hash $remote_addr consistent;

    server backend1.example.com:12345  weight=5;
    server backend2.example.com:12345;
    server unix:/tmp/backend3;

    server backup1.example.com:12345   backup;
    server backup2.example.com:12345   backup;
}

server {
    listen 12346;
    proxy_pass backend;
}
```

Dynamically configurable group with periodic [[11-modules/03-stream/ngx_stream_upstream_hc_module|health checks]] is available as part of our [abonnement commercial](https://nginx.com/products/):

```nginx
resolver 10.0.0.1;

upstream dynamic {
    zone upstream_dynamic 64k;

    server backend1.example.com:12345 weight=5;
    server backend2.example.com:12345 fail_timeout=5s slow_start=30s;
    server 192.0.2.1:12345            max_fails=3;
    server backend3.example.com:12345 resolve;
    server backend4.example.com       service=http resolve;

    server backup1.example.com:12345  backup;
    server backup2.example.com:12345  backup;
}

server {
    listen 12346;
    proxy_pass dynamic;
    health_check;
}
```

## Directives

- [[12-directives/upstream-stream-upstream|upstream]]
- [[12-directives/server-stream-upstream|server]]
- [[12-directives/zone-stream-upstream|zone]]
- [[12-directives/state-stream-upstream|state]]
- [[12-directives/hash-stream-upstream|hash]]
- [[12-directives/least-conn-stream-upstream|least_conn]]
- [[12-directives/least-time-stream-upstream|least_time]]
- [[12-directives/random-stream-upstream|random]]
- [[12-directives/resolver-stream-upstream|resolver]]
- [[12-directives/resolver-timeout-stream-upstream|resolver_timeout]]

## Variables intégrées

- [[13-variables/upstream-addr-stream-upstream|$upstream_addr]]
- [[13-variables/upstream-bytes-received-stream-upstream|$upstream_bytes_received]]
- [[13-variables/upstream-bytes-sent-stream-upstream|$upstream_bytes_sent]]
- [[13-variables/upstream-connect-time-stream-upstream|$upstream_connect_time]]
- [[13-variables/upstream-first-byte-time|$upstream_first_byte_time]]
- [[13-variables/upstream-last-addr-stream-upstream|$upstream_last_addr]]
- [[13-variables/upstream-session-time|$upstream_session_time]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
