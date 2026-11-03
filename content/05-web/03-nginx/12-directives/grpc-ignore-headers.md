---
title: "grpc_ignore_headers"
description: "Directive nginx grpc_ignore_headers (ngx_http_grpc_module) — Disables processing of certain response header fields from the gRPC server. The following fields can be ignored: X-Accel-Redirect and X-Accel-Charset. If not disabled, processing of these header…"
tags: [nginx, directive, ngx_http_grpc_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `grpc_ignore_headers field ...;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_grpc_module\|ngx_http_grpc_module]] |

## Utilisation

Disables processing of certain response header fields from the gRPC server. The following fields can be ignored: `X-Accel-Redirect` and `X-Accel-Charset`.

If not disabled, processing of these header fields has the following effect:

- `X-Accel-Redirect` performs an [[12-directives/internal|internal redirect]] to the specified URI;

- `X-Accel-Charset` sets the desired [[12-directives/charset|charset]] of a response.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
