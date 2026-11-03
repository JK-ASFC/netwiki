---
title: "grpc_ssl_verify"
description: "Directive nginx grpc_ssl_verify (ngx_http_grpc_module) — Active ou désactive la vérification du certificat du serveur gRPC SSL."
tags: [nginx, directive, ngx_http_grpc_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `grpc_ssl_verify on \| off;` |
| **Valeur par défaut** | `grpc_ssl_verify off;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_grpc_module\|ngx_http_grpc_module]] |

## Utilisation

Active ou désactive la vérification du certificat du serveur gRPC SSL.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
