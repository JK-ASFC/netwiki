---
title: "post_logout_uri"
description: "Directive nginx post_logout_uri (ngx_http_oidc_module) — Définit le chemin ou l'URI absolu vers lequel l'utilisateur est redirigé après la déconnexion. L'uri doit correspondre à la configuration côté fournisseur. Si la page d'après déconnexion est servie…"
tags: [nginx, directive, ngx_http_oidc_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `post_logout_uri uri;` |
| **Valeur par défaut** | — |
| **Contexte** | `oidc_provider` |
| **Apparue dans la version** | 1.29.0 |
| **Module** | [[11-modules/02-http/ngx_http_oidc_module\|ngx_http_oidc_module]] |

## Utilisation

Définit le chemin ou l'URI absolu vers lequel l'utilisateur est redirigé après la déconnexion. L'*uri* doit correspondre à la configuration côté fournisseur. Si la page d'après déconnexion est servie par NGINX, le module OIDC ne doit pas être activé pour ce bloc location :

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
