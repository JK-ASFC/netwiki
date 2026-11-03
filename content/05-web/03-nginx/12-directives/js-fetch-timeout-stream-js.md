---
title: "js_fetch_timeout (ngx_stream_js_module)"
description: "Directive nginx js_fetch_timeout (ngx_stream_js_module) — Defines a timeout for reading and writing for Fetch API. The timeout is set only between two successive read/write operations, not for the whole response. If no data is transmitted within this time,…"
tags: [nginx, directive, ngx_stream_js_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `js_fetch_timeout time;` |
| **Valeur par défaut** | `js_fetch_timeout 60s;` |
| **Contexte** | `stream`, `server` |
| **Apparue dans la version** | 0.7.4 |
| **Module** | [[11-modules/03-stream/ngx_stream_js_module\|ngx_stream_js_module]] |

## Utilisation

Defines a timeout for reading and writing for [[10-guides/04-njs/reference|Fetch API]]. The timeout is set only between two successive read/write operations, not for the whole response. If no data is transmitted within this time, the connection is closed.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
