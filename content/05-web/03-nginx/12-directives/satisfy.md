---
title: "satisfy"
description: "Directive nginx satisfy (ngx_http_core_module) — Autorise l'accès si tous (all) ou au moins un (any) des modules ngx_http_access_module, ngx_http_auth_basic_module, ngx_http_auth_request_module, ngx_http_auth_jwt_module (1.13.10) ou…"
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `satisfy all \| any;` |
| **Valeur par défaut** | `satisfy all;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Autorise l'accès si tous (`all`) ou au moins un (`any`) des modules [[11-modules/02-http/ngx_http_access_module|ngx_http_access_module]], [[11-modules/02-http/ngx_http_auth_basic_module|ngx_http_auth_basic_module]], [[11-modules/02-http/ngx_http_auth_request_module|ngx_http_auth_request_module]], [[11-modules/02-http/ngx_http_auth_jwt_module|ngx_http_auth_jwt_module]] (1.13.10) ou [[11-modules/02-http/ngx_http_auth_jwt_module|ngx_http_auth_oidc_module]] (1.27.4) l'autorisent.

Exemple :

```nginx
location / {
    satisfy any;

    allow 192.168.1.0/32;
    deny  all;

    auth_basic           "closed site";
    auth_basic_user_file conf/htpasswd;
}
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
