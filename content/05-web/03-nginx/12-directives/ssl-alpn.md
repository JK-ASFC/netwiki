---
title: "ssl_alpn"
description: "Directive nginx ssl_alpn (ngx_stream_ssl_module) — Indique la liste des protocoles ALPN pris en charge. L'un d'eux doit être négocié si le client utilise ALPN : nginx map $ssl_alpn_protocol $proxy { h2 127.0.0.1:8001; http/1.1 127.0.0.1:8002; }…"
tags: [nginx, directive, ngx_stream_ssl_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `ssl_alpn protocol ...;` |
| **Valeur par défaut** | — |
| **Contexte** | `stream`, `server` |
| **Apparue dans la version** | 1.21.4 |
| **Module** | [[11-modules/03-stream/ngx_stream_ssl_module\|ngx_stream_ssl_module]] |

## Utilisation

Indique la liste des protocoles [ALPN](https://datatracker.ietf.org/doc/html/rfc7301) pris en charge. L'un d'eux doit être [[13-variables/ssl-alpn-protocol-stream-ssl|négocié]] si le client utilise ALPN :

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
