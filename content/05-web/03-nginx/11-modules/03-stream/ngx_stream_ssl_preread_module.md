---
title: "ngx_stream_ssl_preread_module"
description: "Module nginx ngx_stream_ssl_preread_module — The ngx_stream_ssl_preread_module module (1.11.5) allows extracting information from the ClientHello message without terminating SSL/TLS, for example, the server name requested through SNI or protocols advertised in…"
tags: [nginx, module, ngx_stream_ssl_preread_module]
icon: puzzle
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

The `ngx_stream_ssl_preread_module` module (1.11.5) allows extracting information from the [ClientHello](https://datatracker.ietf.org/doc/html/rfc5246#section-7.4.1.2) message without terminating SSL/TLS, for example, the server name requested through [SNI](https://datatracker.ietf.org/doc/html/rfc6066#section-3) or protocols advertised in [ALPN](https://datatracker.ietf.org/doc/html/rfc7301). This module is not built by default, it should be enabled with the `--with-stream_ssl_preread_module` configuration parameter.

## Exemple de configuration

Selecting an upstream based on server name:

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

Selecting an upstream based on protocol:

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

Selecting an upstream based on SSL protocol version:

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
