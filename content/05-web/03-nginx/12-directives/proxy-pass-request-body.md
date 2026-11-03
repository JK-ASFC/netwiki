---
title: "proxy_pass_request_body"
description: "Directive nginx proxy_pass_request_body (ngx_http_proxy_module) — Indique si le corps de la requête d'origine est transmis au serveur mandaté. nginx location /x-accel-redirect-here/ { proxy_method GET; proxy_pass_request_body off; proxy_set_header Content-Length…"
tags: [nginx, directive, ngx_http_proxy_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `proxy_pass_request_body on \| off;` |
| **Valeur par défaut** | `proxy_pass_request_body on;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_proxy_module\|ngx_http_proxy_module]] |

## Utilisation

Indique si le corps de la requête d'origine est transmis au serveur mandaté.

```nginx
location /x-accel-redirect-here/ {
    proxy_method GET;
    proxy_pass_request_body off;
    proxy_set_header Content-Length "";

    proxy_pass ...
}
```

Voir aussi les directives [[12-directives/proxy-set-header|proxy_set_header]] et [[12-directives/proxy-pass-request-headers|proxy_pass_request_headers]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
