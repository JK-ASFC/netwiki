---
title: "grpc_ssl_protocols"
description: "Directive nginx grpc_ssl_protocols (ngx_http_grpc_module) — Active les protocoles indiqués pour les requêtes vers un serveur gRPC SSL. NOTE Le paramètre TLSv1.3 est utilisé par défaut depuis la version 1.23.4."
tags: [nginx, directive, ngx_http_grpc_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `grpc_ssl_protocols [SSLv2] [SSLv3] [TLSv1] [TLSv1.1] [TLSv1.2] [TLSv1.3];` |
| **Valeur par défaut** | `grpc_ssl_protocols TLSv1.2 TLSv1.3;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_grpc_module\|ngx_http_grpc_module]] |

## Utilisation

Active les protocoles indiqués pour les requêtes vers un serveur gRPC SSL.

> [!NOTE]
> Le paramètre `TLSv1.3` est utilisé par défaut depuis la version 1.23.4.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
