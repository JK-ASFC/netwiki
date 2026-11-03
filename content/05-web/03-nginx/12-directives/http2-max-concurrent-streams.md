---
title: "http2_max_concurrent_streams"
description: "Directive nginx http2_max_concurrent_streams (ngx_http_v2_module) — Définit le nombre maximal de flux HTTP/2 simultanés sur une connexion."
tags: [nginx, directive, ngx_http_v2_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `http2_max_concurrent_streams number;` |
| **Valeur par défaut** | `http2_max_concurrent_streams 128;` |
| **Contexte** | `http`, `server` |
| **Module** | [[11-modules/02-http/ngx_http_v2_module\|ngx_http_v2_module]] |

## Utilisation

Définit le nombre maximal de flux HTTP/2 simultanés sur une connexion.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
