---
title: "ngx_http_auth_require_module"
description: "Module nginx ngx_http_auth_require_module — Le module ngx_http_auth_require_module (1.29.0) autorise les clients selon des variables. Il peut aussi utiliser les variables fournies par d'autres modules d'accès comme ngx_http_auth_request_module ou…"
tags: [nginx, module, ngx_http_auth_require_module]
icon: puzzle
---

Le module `ngx_http_auth_require_module` (1.29.0) autorise les clients selon des variables. Il peut aussi utiliser les variables fournies par d'autres modules d'accès comme [[11-modules/02-http/ngx_http_auth_request_module|ngx_http_auth_request_module]] ou [[11-modules/02-http/ngx_http_auth_request_module|ngx_http_auth_oidc_module]].

> [!NOTE]
> Ce module est disponible dans le cadre de notre [abonnement commercial](https://nginx.com/products/).

## Exemple de configuration

```nginx
http {
    oidc_provider my_idp {
        ...
    }

    map $oidc_claim_role $admin_role {
        "admin" 1;
    }

    server {
        auth_oidc my_idp;

        location /admin {
            auth_require $admin_role;
        }
    }
}
```

## Directives

- [[12-directives/auth-require|auth_require]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
