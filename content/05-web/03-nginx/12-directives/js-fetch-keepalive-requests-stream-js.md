---
title: "js_fetch_keepalive_requests (ngx_stream_js_module)"
description: "Directive nginx js_fetch_keepalive_requests (ngx_stream_js_module) — Sets the maximum number of requests that can be served through one keepalive connection with Fetch API. After the maximum number of requests is made, the connection is closed. Closing connections…"
tags: [nginx, directive, ngx_stream_js_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `js_fetch_keepalive_requests number;` |
| **Valeur par défaut** | `js_fetch_keepalive_requests 1000;` |
| **Contexte** | `stream`, `server` |
| **Apparue dans la version** | 0.9.2 |
| **Module** | [[11-modules/03-stream/ngx_stream_js_module\|ngx_stream_js_module]] |

## Utilisation

Sets the maximum number of requests that can be served through one keepalive connection with [[10-guides/04-njs/reference|Fetch API]]. After the maximum number of requests is made, the connection is closed.

Closing connections periodically is necessary to free per-connection memory allocations. Therefore, using too high maximum number of requests could result in excessive memory usage and not recommended.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
