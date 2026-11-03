---
title: "client_body_early_read"
description: "Directive nginx client_body_early_read (ngx_http_core_module) — Active la lecture du corps de la requête du client dès la réception des en-têtes, avec les réglages de lecture du corps du bloc server. Si au moins une des chaînes en paramètre n'est ni vide ni égale…"
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `client_body_early_read string ...;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server` |
| **Apparue dans la version** | 1.31.5 |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Active la lecture du corps de la requête du client dès la réception des en-têtes, avec les réglages de lecture du corps du bloc `server`. Si au moins une des chaînes en paramètre n'est ni vide ni égale à « 0 », nginx lit le corps de la requête de façon anticipée.

Cette directive est incompatible avec les modules qui traitent le corps de la requête sans tampon, comme [[11-modules/02-http/ngx_http_grpc_module|ngx_http_grpc_module]]. Elle est aussi incompatible avec les modules qui écrivent le corps de la requête dans un fichier, comme [[11-modules/02-http/ngx_http_dav_module|ngx_http_dav_module]].

La directive [[12-directives/client-body-in-file-only|client_body_in_file_only]] est ignorée lorsque le corps de la requête est lu de façon anticipée.

Exemple :

```nginx
map $http_content_type $is_json {
    application/json  1;
}

server {
    listen 8000;

    client_body_early_read $is_json;

    client_max_body_size    256;
    client_body_buffer_size 256;

    return 200 $request_body;
}
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
