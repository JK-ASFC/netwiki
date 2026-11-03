---
title: "match (ngx_stream_upstream_hc_module)"
description: "Directive nginx match (ngx_stream_upstream_hc_module) — Defines the named test set used to verify server responses to health checks. The following parameters can be configured: - send string; sends a string to the server; - expect string | ~ regex; a…"
tags: [nginx, directive, ngx_stream_upstream_hc_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `match name { ... }` |
| **Valeur par défaut** | — |
| **Contexte** | `stream` |
| **Module** | [[11-modules/03-stream/ngx_stream_upstream_hc_module\|ngx_stream_upstream_hc_module]] |

## Utilisation

Defines the named test set used to verify server responses to health checks.

The following parameters can be configured:

- **`send` *string*;**

  sends a *string* to the server;

- **`expect` *string* | `~` *regex*;**

  a literal string (1.9.12) or a regular expression that the data obtained from the server should match. The regular expression is specified with the preceding “`~*`” modifier (for case-insensitive matching), or the “`~`” modifier (for case-sensitive matching).

Both `send` and `expect` parameters can contain hexadecimal literals with the prefix “`\x`” followed by two hex digits, for example, “`\x80`” (1.9.12).

Health check is passed if:

- the TCP connection was successfully established;
- the *string* from the `send` parameter, if specified, was sent;
- the data obtained from the server matched the string or regular expression from the `expect` parameter, if specified;
- the time elapsed does not exceed the value specified in the [[12-directives/health-check-timeout|health_check_timeout]] directive.

Exemple :

```nginx
upstream backend {
    zone     upstream_backend 10m;
    server   127.0.0.1:12345;
}

match http {
    send     "GET / HTTP/1.0\r\nHost: localhost\r\n\r\n";
    expect ~ "200 OK";
}

server {
    listen       12346;
    proxy_pass   backend;
    health_check match=http;
}
```

> [!NOTE]
> Only the first [[12-directives/proxy-buffer-size-stream-proxy|proxy_buffer_size]] bytes of data obtained from the server are examined.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
