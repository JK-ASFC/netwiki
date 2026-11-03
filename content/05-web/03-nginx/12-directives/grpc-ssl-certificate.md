---
title: "grpc_ssl_certificate"
description: "Directive nginx grpc_ssl_certificate (ngx_http_grpc_module) — Specifies a file with the certificate in the PEM format used for authentication to a gRPC SSL server. Since version 1.21.0, variables can be used in the file name."
tags: [nginx, directive, ngx_http_grpc_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `grpc_ssl_certificate file;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_grpc_module\|ngx_http_grpc_module]] |

## Utilisation

Specifies a *file* with the certificate in the PEM format used for authentication to a gRPC SSL server.

Since version 1.21.0, variables can be used in the *file* name.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
