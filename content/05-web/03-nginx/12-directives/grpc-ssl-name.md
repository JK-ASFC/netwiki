---
title: "grpc_ssl_name"
description: "Directive nginx grpc_ssl_name (ngx_http_grpc_module) — Allows overriding the server name used to verify the certificate of the gRPC SSL server and to be passed through SNI when establishing a connection with the gRPC SSL server. By default, the host part…"
tags: [nginx, directive, ngx_http_grpc_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `grpc_ssl_name name;` |
| **Valeur par défaut** | `grpc_ssl_name host from grpc_pass;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_grpc_module\|ngx_http_grpc_module]] |

## Utilisation

Allows overriding the server name used to [[12-directives/grpc-ssl-verify|verify]] the certificate of the gRPC SSL server and to be [[12-directives/grpc-ssl-server-name|passed through SNI]] when establishing a connection with the gRPC SSL server.

By default, the host part from [[12-directives/grpc-pass|grpc_pass]] is used.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
