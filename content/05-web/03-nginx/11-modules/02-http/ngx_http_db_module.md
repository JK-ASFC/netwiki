---
title: "ngx_http_db_module"
description: "Module nginx ngx_http_db_module — The ngx_http_db_module module (1.31.6) retrieves values for the specified key from a database and returns them as HTTP response bodies. The key can contain variables. Authentication and database selection are also…"
tags: [nginx, module, ngx_http_db_module]
icon: puzzle
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

The `ngx_http_db_module` module (1.31.6) retrieves values for the specified [[12-directives/db-get|key]] from a [[12-directives/db-pass|database]] and returns them as HTTP response bodies. The key can contain variables. [[12-directives/db-auth|Authentication]] and [[12-directives/db-name|database selection]] are also supported.

Currently, the module supports single-key lookups using the `GET` command of Redis database over TCP or TLS.

Lookup results can be [[12-directives/db-cache|cached]] in a [[12-directives/keyval-zone-http-keyval|shared memory zone]]. Retrieved values can be used in [[12-directives/db-var|variables]].

> [!NOTE]
> This module is available as part of our [abonnement commercial](https://nginx.com/products/).

## Example Configuration

Redis authentication and database selection:

```nginx
upstream redis_backend {
    server    127.0.0.1:6379;
    keepalive 4;

    db_type redis;
}

server {
    ...
    location = /lookup {
            db_pass redis_backend;
            db_name 3;
            db_auth "secret";
            db_get  $arg_key;
    }
}
```

Per-database lookup caching:

```nginx
keyval_zone zone=dbcache_db0:1m timeout=60s;
keyval_zone zone=dbcache_db1:1m timeout=60s;

upstream redis_backend {
    server    127.0.0.1:6379;
    keepalive 4;

    db_type redis;
}

server {
    ...
    location /db0 {
        db_pass  redis_backend;
        db_name  0;
        db_get   $arg_key;
        db_cache dbcache_db0;
    }

    location /db1 {
        db_pass  redis_backend;
        db_name  1;
        db_get   $arg_key;
        db_cache dbcache_db1;
    }
}
```

Verified TLS and mutual TLS connection:

```nginx
location /db {
    db_pass redis_backend;
    db_get  $arg_key;

    db_ssl                     on;
    db_ssl_verify              on;
    db_ssl_trusted_certificate ca.crt;
    db_ssl_name                localhost;

    db_ssl_certificate         client.crt;
    db_ssl_certificate_key     client.key;
}
```

Using database-backed variables, for example, retrieving a resource owner from Redis and adding it to a response header.

```nginx
location = /internal/db-get {
    internal;
    db_pass redis_backend;
    db_get  $arg_key;
}

location /resource {
    db_var     $owner /internal/db-get "key=$arg_id" default=unknown;
    add_header X-Owner $owner;
    proxy_pass http://application;
}
```

## Directives

- [[12-directives/db-auth|db_auth]]
- [[12-directives/db-bind|db_bind]]
- [[12-directives/db-buffer-size|db_buffer_size]]
- [[12-directives/db-cache|db_cache]]
- [[12-directives/db-connect-timeout|db_connect_timeout]]
- [[12-directives/db-get|db_get]]
- [[12-directives/db-name|db_name]]
- [[12-directives/db-next-upstream|db_next_upstream]]
- [[12-directives/db-next-upstream-timeout|db_next_upstream_timeout]]
- [[12-directives/db-next-upstream-tries|db_next_upstream_tries]]
- [[12-directives/db-pass|db_pass]]
- [[12-directives/db-read-timeout|db_read_timeout]]
- [[12-directives/db-send-timeout|db_send_timeout]]
- [[12-directives/db-socket-keepalive|db_socket_keepalive]]
- [[12-directives/db-ssl|db_ssl]]
- [[12-directives/db-ssl-certificate|db_ssl_certificate]]
- [[12-directives/db-ssl-certificate-cache|db_ssl_certificate_cache]]
- [[12-directives/db-ssl-certificate-key|db_ssl_certificate_key]]
- [[12-directives/db-ssl-ciphers|db_ssl_ciphers]]
- [[12-directives/db-ssl-conf-command|db_ssl_conf_command]]
- [[12-directives/db-ssl-crl|db_ssl_crl]]
- [[12-directives/db-ssl-key-log|db_ssl_key_log]]
- [[12-directives/db-ssl-name|db_ssl_name]]
- [[12-directives/db-ssl-password-file|db_ssl_password_file]]
- [[12-directives/db-ssl-protocols|db_ssl_protocols]]
- [[12-directives/db-ssl-server-name|db_ssl_server_name]]
- [[12-directives/db-ssl-session-reuse|db_ssl_session_reuse]]
- [[12-directives/db-ssl-trusted-certificate|db_ssl_trusted_certificate]]
- [[12-directives/db-ssl-verify|db_ssl_verify]]
- [[12-directives/db-ssl-verify-depth|db_ssl_verify_depth]]
- [[12-directives/db-type|db_type]]
- [[12-directives/db-var|db_var]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
