---
title: "proxy_pass_request_body"
description: "Directive nginx proxy_pass_request_body (ngx_http_proxy_module) — Indicates whether the original request body is passed to the proxied server. nginx location /x-accel-redirect-here/ { proxy_method GET; proxy_pass_request_body off; proxy_set_header Content-Length…"
tags: [nginx, directive, ngx_http_proxy_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `proxy_pass_request_body on \| off;` |
| **Valeur par défaut** | `proxy_pass_request_body on;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_proxy_module\|ngx_http_proxy_module]] |

## Utilisation

Indicates whether the original request body is passed to the proxied server.

```nginx
location /x-accel-redirect-here/ {
    proxy_method GET;
    proxy_pass_request_body off;
    proxy_set_header Content-Length "";

    proxy_pass ...
}
```

See also the [[12-directives/proxy-set-header|proxy_set_header]] and [[12-directives/proxy-pass-request-headers|proxy_pass_request_headers]] directives.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
