---
title: "js_fetch_keepalive_timeout (ngx_http_js_module)"
description: "Directive nginx js_fetch_keepalive_timeout (ngx_http_js_module) — Sets a timeout during which an idle keepalive connection to a destination server will stay open with Fetch API."
tags: [nginx, directive, ngx_http_js_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `js_fetch_keepalive_timeout time;` |
| **Valeur par défaut** | `js_fetch_keepalive_timeout 60s;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 0.9.2 |
| **Module** | [[11-modules/02-http/ngx_http_js_module\|ngx_http_js_module]] |

## Utilisation

Sets a timeout during which an idle keepalive connection to a destination server will stay open with [[10-guides/04-njs/reference|Fetch API]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
