---
title: "js_header_filter"
description: "Directive nginx js_header_filter (ngx_http_js_module) — Sets an njs function as a response header filter. The directive allows changing arbitrary header fields of a response header. NOTE As the js_header_filter handler returns its result immediately, it…"
tags: [nginx, directive, ngx_http_js_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `js_header_filter module.function;` |
| **Valeur par défaut** | — |
| **Contexte** | `location`, `if dans location`, `limit_except` |
| **Apparue dans la version** | 0.5.1 |
| **Module** | [[11-modules/02-http/ngx_http_js_module\|ngx_http_js_module]] |

## Utilisation

Sets an njs function as a response header filter. The directive allows changing arbitrary header fields of a response header.

> [!NOTE]
> As the `js_header_filter` handler returns its result immediately, it supports only synchronous operations. Thus, asynchronous operations such as [[10-guides/04-njs/reference|r.subrequest()]] or [[10-guides/04-njs/reference|setTimeout()]] are not supported.

> [!NOTE]
> The directive can be specified inside the [[12-directives/if|if]] block since 0.7.7.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
