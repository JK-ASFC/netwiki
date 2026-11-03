---
title: "client_body_early_read"
description: "Directive nginx client_body_early_read (ngx_http_core_module) — Enables reading of the client request body immediately after the request headers are received, using the request body read settings from the server block. If at least one value of the string…"
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `client_body_early_read string ...;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server` |
| **Apparue dans la version** | 1.31.5 |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Enables reading of the client request body immediately after the request headers are received, using the request body read settings from the `server` block. If at least one value of the string parameters is not empty and is not equal to “0”, then nginx reads the request body early.

The directive is incompatible with modules that use unbuffered request body processing, such as the [[11-modules/02-http/ngx_http_grpc_module|ngx_http_grpc_module]] module. The directive is also incompatible with modules which write the request body to a file, such as [[11-modules/02-http/ngx_http_dav_module|ngx_http_dav_module]] module.

The [[12-directives/client-body-in-file-only|client_body_in_file_only]] directive is ignored when the request body is read early.

Example:

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
