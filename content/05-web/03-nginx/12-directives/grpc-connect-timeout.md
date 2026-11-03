---
title: "grpc_connect_timeout"
description: "Directive nginx grpc_connect_timeout (ngx_http_grpc_module) — Définit le délai d'établissement de la connexion avec un serveur gRPC. Ce délai ne peut généralement pas dépasser 75 secondes."
tags: [nginx, directive, ngx_http_grpc_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `grpc_connect_timeout time;` |
| **Valeur par défaut** | `grpc_connect_timeout 60s;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_grpc_module\|ngx_http_grpc_module]] |

## Utilisation

Définit le délai d'établissement de la connexion avec un serveur gRPC. Ce délai ne peut généralement pas dépasser 75 secondes.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
