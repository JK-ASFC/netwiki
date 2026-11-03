---
title: "grpc_next_upstream_timeout"
description: "Directive nginx grpc_next_upstream_timeout (ngx_http_grpc_module) — Limite la durée pendant laquelle une requête peut être transmise au serveur suivant. La valeur 0 supprime cette limite."
tags: [nginx, directive, ngx_http_grpc_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `grpc_next_upstream_timeout time;` |
| **Valeur par défaut** | `grpc_next_upstream_timeout 0;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_grpc_module\|ngx_http_grpc_module]] |

## Utilisation

Limite la durée pendant laquelle une requête peut être transmise au [[12-directives/grpc-next-upstream|serveur suivant]]. La valeur `0` supprime cette limite.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
