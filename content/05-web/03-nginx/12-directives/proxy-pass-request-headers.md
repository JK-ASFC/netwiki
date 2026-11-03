---
title: "proxy_pass_request_headers"
description: "Directive nginx proxy_pass_request_headers (ngx_http_proxy_module) — Indique si les champs d'en-tête de la requête d'origine sont transmis au serveur mandaté. nginx location /x-accel-redirect-here/ { proxy_method GET; proxy_pass_request_headers off;…"
tags: [nginx, directive, ngx_http_proxy_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `proxy_pass_request_headers on \| off;` |
| **Valeur par défaut** | `proxy_pass_request_headers on;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_proxy_module\|ngx_http_proxy_module]] |

## Utilisation

Indique si les champs d'en-tête de la requête d'origine sont transmis au serveur mandaté.

```nginx
location /x-accel-redirect-here/ {
    proxy_method GET;
    proxy_pass_request_headers off;
    proxy_pass_request_body off;

    proxy_pass ...
}
```

Voir aussi les directives [[12-directives/proxy-set-header|proxy_set_header]] et [[12-directives/proxy-pass-request-body|proxy_pass_request_body]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
