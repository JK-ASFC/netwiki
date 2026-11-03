---
title: "http2_recv_timeout"
description: "Directive nginx http2_recv_timeout (ngx_http_v2_module) — NOTE Cette directive est obsolète depuis la version 1.19.7. Utiliser à la place la directive client_header_timeout. Définit le délai d'attente de nouvelles données du client, au-delà duquel la…"
tags: [nginx, directive, ngx_http_v2_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `http2_recv_timeout time;` |
| **Valeur par défaut** | `http2_recv_timeout 30s;` |
| **Contexte** | `http`, `server` |
| **Module** | [[11-modules/02-http/ngx_http_v2_module\|ngx_http_v2_module]] |

## Utilisation

> [!NOTE]
> Cette directive est obsolète depuis la version 1.19.7. Utiliser à la place la directive [[12-directives/client-header-timeout|client_header_timeout]].

Définit le délai d'attente de nouvelles données du client, au-delà duquel la connexion est fermée.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
