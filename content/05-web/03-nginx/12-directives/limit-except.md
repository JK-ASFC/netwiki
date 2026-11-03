---
title: "limit_except"
description: "Directive nginx limit_except (ngx_http_core_module) — Limite les méthodes HTTP autorisées dans un bloc location. Le paramètre method peut valoir : GET, HEAD, POST, PUT, DELETE, MKCOL, COPY, MOVE, OPTIONS, PROPFIND, PROPPATCH, LOCK, UNLOCK ou PATCH.…"
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `limit_except method ... { ... }` |
| **Valeur par défaut** | — |
| **Contexte** | `location` |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Limite les méthodes HTTP autorisées dans un bloc location. Le paramètre *method* peut valoir : `GET`, `HEAD`, `POST`, `PUT`, `DELETE`, `MKCOL`, `COPY`, `MOVE`, `OPTIONS`, `PROPFIND`, `PROPPATCH`, `LOCK`, `UNLOCK` ou `PATCH`. Autoriser la méthode `GET` autorise aussi `HEAD`. L'accès aux autres méthodes peut être limité avec les directives des modules [[11-modules/02-http/ngx_http_access_module|ngx_http_access_module]], [[11-modules/02-http/ngx_http_auth_basic_module|ngx_http_auth_basic_module]] et [[11-modules/02-http/ngx_http_auth_jwt_module|ngx_http_auth_jwt_module]] (1.13.10) :

```nginx
limit_except GET {
    allow 192.168.1.0/32;
    deny  all;
}
```

Attention : cela limite l'accès à toutes les méthodes *sauf* GET et HEAD.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
