---
title: "post_logout_uri"
description: "Directive nginx post_logout_uri (ngx_http_oidc_module) — Defines the path or absolute URI to redirect the user to after the logout. The uri must match the configuration on the Provider's side. If the post logout page is served by NGINX, the OIDC module…"
tags: [nginx, directive, ngx_http_oidc_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `post_logout_uri uri;` |
| **Valeur par défaut** | — |
| **Contexte** | `oidc_provider` |
| **Apparue dans la version** | 1.29.0 |
| **Module** | [[11-modules/02-http/ngx_http_oidc_module\|ngx_http_oidc_module]] |

## Utilisation

Defines the path or absolute URI to redirect the user to after the logout. The *uri* must match the configuration on the Provider's side. If the post logout page is served by NGINX, the OIDC module shouldn't be enabled for this location:

```nginx
http {
    oidc_provider my_idp {
        ...

        logout_uri      /logout;
        post_logout_uri /logged_out_page.html;
    }

    server {
        auth_oidc my_idp;

        location /logged_out_page.html {
            auth_oidc off;
        }
    }
}
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
