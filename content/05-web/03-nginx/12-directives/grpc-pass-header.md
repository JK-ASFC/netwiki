---
title: "grpc_pass_header"
description: "Directive nginx grpc_pass_header (ngx_http_grpc_module) — Autorise la transmission au client de champs d'en-tête du serveur gRPC normalement masqués."
tags: [nginx, directive, ngx_http_grpc_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `grpc_pass_header field;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_grpc_module\|ngx_http_grpc_module]] |

## Utilisation

Autorise la transmission au client de champs d'en-tête du serveur gRPC [[12-directives/grpc-hide-header|normalement masqués]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
