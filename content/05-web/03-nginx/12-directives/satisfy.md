---
title: "satisfy"
description: "Directive nginx satisfy (ngx_http_core_module) — Allows access if all (all) or at least one (any) of the ngx_http_access_module, ngx_http_auth_basic_module, ngx_http_auth_request_module, ngx_http_auth_jwt_module (1.13.10), or…"
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `satisfy all \| any;` |
| **Valeur par défaut** | `satisfy all;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Allows access if all (`all`) or at least one (`any`) of the [[11-modules/02-http/ngx_http_access_module|ngx_http_access_module]], [[11-modules/02-http/ngx_http_auth_basic_module|ngx_http_auth_basic_module]], [[11-modules/02-http/ngx_http_auth_request_module|ngx_http_auth_request_module]], [[11-modules/02-http/ngx_http_auth_jwt_module|ngx_http_auth_jwt_module]] (1.13.10), or [[11-modules/02-http/ngx_http_auth_jwt_module|ngx_http_auth_oidc_module]] (1.27.4) modules allow access.

Example:

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
