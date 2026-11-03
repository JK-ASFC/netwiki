---
title: "grpc_ssl_session_reuse"
description: "Directive nginx grpc_ssl_session_reuse (ngx_http_grpc_module) — Indique si les sessions SSL peuvent être réutilisées avec le serveur gRPC. Si des erreurs « digest check failed » apparaissent dans les journaux, essayez de désactiver la réutilisation des sessions."
tags: [nginx, directive, ngx_http_grpc_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `grpc_ssl_session_reuse on \| off;` |
| **Valeur par défaut** | `grpc_ssl_session_reuse on;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_grpc_module\|ngx_http_grpc_module]] |

## Utilisation

Indique si les sessions SSL peuvent être réutilisées avec le serveur gRPC. Si des erreurs « `digest check failed` » apparaissent dans les journaux, essayez de désactiver la réutilisation des sessions.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
