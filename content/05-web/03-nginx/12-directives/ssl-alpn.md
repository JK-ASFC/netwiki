---
title: "ssl_alpn"
description: "Directive nginx ssl_alpn (ngx_stream_ssl_module) — Specifies the list of supported ALPN protocols. One of the protocols must be negotiated if the client uses ALPN: nginx map $ssl_alpn_protocol $proxy { h2 127.0.0.1:8001; http/1.1 127.0.0.1:8002; }…"
tags: [nginx, directive, ngx_stream_ssl_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `ssl_alpn protocol ...;` |
| **Valeur par défaut** | — |
| **Contexte** | `stream`, `server` |
| **Apparue dans la version** | 1.21.4 |
| **Module** | [[11-modules/03-stream/ngx_stream_ssl_module\|ngx_stream_ssl_module]] |

## Utilisation

Specifies the list of supported [ALPN](https://datatracker.ietf.org/doc/html/rfc7301) protocols. One of the protocols must be [[13-variables/ssl-alpn-protocol-stream-ssl|negotiated]] if the client uses ALPN:

```nginx
map $ssl_alpn_protocol $proxy {
    h2                127.0.0.1:8001;
    http/1.1          127.0.0.1:8002;
}

server {
    listen      12346;
    proxy_pass  $proxy;
    ssl_alpn    h2 http/1.1;
}
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
