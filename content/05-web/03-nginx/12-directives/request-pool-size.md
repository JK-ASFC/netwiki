---
title: "request_pool_size"
description: "Directive nginx request_pool_size (ngx_http_core_module) — Permet un réglage précis des allocations mémoire par requête. Cette directive a un impact minime sur les performances et ne doit généralement pas être utilisée."
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `request_pool_size size;` |
| **Valeur par défaut** | `request_pool_size 4k;` |
| **Contexte** | `http`, `server` |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Permet un réglage précis des allocations mémoire par requête. Cette directive a un impact minime sur les performances et ne doit généralement pas être utilisée.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
