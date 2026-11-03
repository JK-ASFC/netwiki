---
title: "auth_jwt_key_request"
description: "Directive nginx auth_jwt_key_request (ngx_http_auth_jwt_module) — Allows retrieving a JSON Web Key Set file from a subrequest for validating JWT signature and sets the URI where the subrequest will be sent to. Parameter value can contain variables. To avoid…"
tags: [nginx, directive, ngx_http_auth_jwt_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `auth_jwt_key_request uri;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server`, `location`, `limit_except` |
| **Apparue dans la version** | 1.15.6 |
| **Module** | [[11-modules/02-http/ngx_http_auth_jwt_module\|ngx_http_auth_jwt_module]] |

## Utilisation

Allows retrieving a [JSON Web Key Set](https://datatracker.ietf.org/doc/html/rfc7517#section-5) file from a subrequest for validating JWT signature and sets the URI where the subrequest will be sent to. Parameter value can contain variables. To avoid validation overhead, it is recommended to cache the key file:

```nginx
proxy_cache_path /data/nginx/cache levels=1 keys_zone=foo:10m;

server {
    ...

    location / {
        auth_jwt             "closed site";
        auth_jwt_key_request /jwks_uri;
    }

    location = /jwks_uri {
        internal;
        proxy_cache foo;
        proxy_pass  http://idp.example.com/keys;
    }
}
```

Several `auth_jwt_key_request` directives can be specified on the same level (1.21.1):

```nginx
auth_jwt_key_request /jwks_uri;
auth_jwt_key_request /jwks2_uri;
```

If at least one of the specified keys cannot be loaded or processed, nginx will return the `500 Internal Server Error` error.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
