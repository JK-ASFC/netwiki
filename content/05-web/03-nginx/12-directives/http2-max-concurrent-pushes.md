---
title: "http2_max_concurrent_pushes"
description: "Directive nginx http2_max_concurrent_pushes (ngx_http_v2_module) — NOTE Cette directive est obsolète depuis la version 1.25.1. Limite le nombre maximal de requêtes push simultanées sur une connexion."
tags: [nginx, directive, ngx_http_v2_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `http2_max_concurrent_pushes number;` |
| **Valeur par défaut** | `http2_max_concurrent_pushes 10;` |
| **Contexte** | `http`, `server` |
| **Apparue dans la version** | 1.13.9 |
| **Module** | [[11-modules/02-http/ngx_http_v2_module\|ngx_http_v2_module]] |

## Utilisation

> [!NOTE]
> Cette directive est obsolète depuis la version 1.25.1.

Limite le nombre maximal de requêtes [[12-directives/http2-push|push]] simultanées sur une connexion.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
