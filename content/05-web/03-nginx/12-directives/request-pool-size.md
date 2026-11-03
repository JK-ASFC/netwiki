---
title: "request_pool_size"
description: "Directive nginx request_pool_size (ngx_http_core_module) — Allows accurate tuning of per-request memory allocations. This directive has minimal impact on performance and should not generally be used."
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `request_pool_size size;` |
| **Valeur par défaut** | `request_pool_size 4k;` |
| **Contexte** | `http`, `server` |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Allows accurate tuning of per-request memory allocations. This directive has minimal impact on performance and should not generally be used.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
