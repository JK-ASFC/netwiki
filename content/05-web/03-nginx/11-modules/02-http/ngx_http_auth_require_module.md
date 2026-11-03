---
title: "ngx_http_auth_require_module"
description: "Module nginx ngx_http_auth_require_module — The ngx_http_auth_require_module module (1.29.0) implements variable-based client authorization. It can also use variables provided by other access modules such as ngx_http_auth_request_module or…"
tags: [nginx, module, ngx_http_auth_require_module]
icon: puzzle
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

The `ngx_http_auth_require_module` module (1.29.0) implements variable-based client authorization. It can also use variables provided by other access modules such as [[11-modules/02-http/ngx_http_auth_request_module|ngx_http_auth_request_module]] or [[11-modules/02-http/ngx_http_auth_request_module|ngx_http_auth_oidc_module]].

> [!NOTE]
> This module is available as part of our [abonnement commercial](https://nginx.com/products/).

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
