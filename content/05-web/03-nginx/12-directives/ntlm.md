---
title: "ntlm"
description: "Directive nginx ntlm (ngx_http_upstream_module) — Allows proxying requests with NTLM Authentication. The upstream connection is bound to the client connection once the client sends a request with the Authorization header field value starting with…"
tags: [nginx, directive, ngx_http_upstream_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `ntlm;` |
| **Valeur par défaut** | — |
| **Contexte** | `upstream` |
| **Apparue dans la version** | 1.9.2 |
| **Module** | [[11-modules/02-http/ngx_http_upstream_module\|ngx_http_upstream_module]] |

## Utilisation

Allows proxying requests with [NTLM Authentication](https://en.wikipedia.org/wiki/Integrated_Windows_Authentication). The upstream connection is bound to the client connection once the client sends a request with the `Authorization` header field value starting with “`Negotiate`” or “`NTLM`”. Further client requests will be proxied through the same upstream connection, keeping the authentication context.

In order for NTLM authentication to work, it is necessary to enable keepalive connections to upstream servers. The [[12-directives/proxy-http-version|proxy_http_version]] directive should be “`1.1`” (by default since 1.29.7) or set to “`2`” and the `Connection` header field should be cleared. This example is for versions prior to 1.29.7:

```nginx
upstream http_backend {
    server 127.0.0.1:8080;

    ntlm;
}

server {
    ...

    location /http/ {
        proxy_pass http://http_backend;
        # proxy_http_version 1.1; # before version 1.29.7
        # proxy_set_header Connection ""; # before version 1.29.7
        ...
    }
}
```

> [!NOTE]
> When using load balancer methods other than the default round-robin method, it is necessary to activate them before the `ntlm` directive.

> [!NOTE]
> This directive is available as part of our [abonnement commercial](https://nginx.com/products/).

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
