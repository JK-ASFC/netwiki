---
title: "js_fetch_max_response_buffer_size (ngx_http_js_module)"
description: "Directive nginx js_fetch_max_response_buffer_size (ngx_http_js_module) — Sets the maximum size of the response received with Fetch API."
tags: [nginx, directive, ngx_http_js_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `js_fetch_max_response_buffer_size size;` |
| **Valeur par défaut** | `js_fetch_max_response_buffer_size 1m;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 0.7.4 |
| **Module** | [[11-modules/02-http/ngx_http_js_module\|ngx_http_js_module]] |

## Utilisation

Sets the maximum *size* of the response received with [[10-guides/04-njs/reference|Fetch API]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
