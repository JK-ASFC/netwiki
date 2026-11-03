---
title: "js_fetch_keepalive_time (ngx_stream_js_module)"
description: "Directive nginx js_fetch_keepalive_time (ngx_stream_js_module) — Limits the maximum time during which requests can be processed through one keepalive connection with Fetch API. After this time is reached, the connection is closed following the subsequent request…"
tags: [nginx, directive, ngx_stream_js_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `js_fetch_keepalive_time time;` |
| **Valeur par défaut** | `js_fetch_keepalive_time 1h;` |
| **Contexte** | `stream`, `server` |
| **Apparue dans la version** | 0.9.2 |
| **Module** | [[11-modules/03-stream/ngx_stream_js_module\|ngx_stream_js_module]] |

## Utilisation

Limits the maximum time during which requests can be processed through one keepalive connection with [[10-guides/04-njs/reference|Fetch API]]. After this time is reached, the connection is closed following the subsequent request processing.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
