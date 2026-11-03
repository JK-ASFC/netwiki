---
title: "grpc_ssl_verify_depth"
description: "Directive nginx grpc_ssl_verify_depth (ngx_http_grpc_module) — Définit la profondeur de vérification dans la chaîne de certificats du serveur gRPC SSL."
tags: [nginx, directive, ngx_http_grpc_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `grpc_ssl_verify_depth number;` |
| **Valeur par défaut** | `grpc_ssl_verify_depth 1;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_grpc_module\|ngx_http_grpc_module]] |

## Utilisation

Définit la profondeur de vérification dans la chaîne de certificats du serveur gRPC SSL.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
