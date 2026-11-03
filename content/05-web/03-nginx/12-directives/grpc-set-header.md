---
title: "grpc_set_header"
description: "Directive nginx grpc_set_header (ngx_http_grpc_module) — Allows redefining or appending fields to the request header passed to the gRPC server. The value can contain text, variables, and their combinations. These directives are inherited from the previous…"
tags: [nginx, directive, ngx_http_grpc_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `grpc_set_header field value;` |
| **Valeur par défaut** | `grpc_set_header Content-Length $content_length;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_grpc_module\|ngx_http_grpc_module]] |

## Utilisation

Allows redefining or appending fields to the request header passed to the gRPC server. The *value* can contain text, variables, and their combinations. These directives are inherited from the previous configuration level if and only if there are no `grpc_set_header` directives defined on the current level.

If the value of a header field is an empty string then this field will not be passed to a gRPC server:

```nginx
grpc_set_header Accept-Encoding "";
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
