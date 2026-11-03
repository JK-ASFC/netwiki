---
title: "auth_jwt_key_request"
description: "Directive nginx auth_jwt_key_request (ngx_http_auth_jwt_module) — Permet de récupérer un fichier JSON Web Key Set depuis une sous-requête pour valider la signature des JWT, et définit l'URI auquel la sous-requête est envoyée. La valeur du paramètre peut contenir…"
tags: [nginx, directive, ngx_http_auth_jwt_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `auth_jwt_key_request uri;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server`, `location`, `limit_except` |
| **Apparue dans la version** | 1.15.6 |
| **Module** | [[11-modules/02-http/ngx_http_auth_jwt_module\|ngx_http_auth_jwt_module]] |

## Utilisation

Permet de récupérer un fichier [JSON Web Key Set](https://datatracker.ietf.org/doc/html/rfc7517#section-5) depuis une sous-requête pour valider la signature des JWT, et définit l'URI auquel la sous-requête est envoyée. La valeur du paramètre peut contenir des variables. Pour éviter le surcoût de validation, il est recommandé de mettre le fichier de clés en cache :

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

Plusieurs directives `auth_jwt_key_request` peuvent être indiquées au même niveau (1.21.1) :

```nginx
auth_jwt_key_request /jwks_uri;
auth_jwt_key_request /jwks2_uri;
```

Si au moins une des clés indiquées ne peut pas être chargée ou traitée, nginx renvoie l'erreur `500 Internal Server Error`.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
