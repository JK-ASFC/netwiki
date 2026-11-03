---
title: "js_filter"
description: "Directive nginx js_filter (ngx_stream_js_module) — Sets a data filter. Since 0.4.0, a module function can be referenced. The filter function is called once at the moment when the stream session reaches the content phase. The filter function is called…"
tags: [nginx, directive, ngx_stream_js_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `js_filter module.function;` |
| **Valeur par défaut** | — |
| **Contexte** | `stream`, `server` |
| **Module** | [[11-modules/03-stream/ngx_stream_js_module\|ngx_stream_js_module]] |

## Utilisation

Sets a data filter. Since 0.4.0, a module function can be referenced. The filter function is called once at the moment when the stream session reaches the [[10-guides/03-stream/stream-processing|content]] phase.

The filter function is called with the following arguments:

- **`s`**

  the [[10-guides/04-njs/reference|Stream Session]] object

At this phase, it is possible to perform initialization or register a callback with the [[10-guides/04-njs/reference|s.on()]] method for each incoming data chunk. The [[10-guides/04-njs/reference|s.off()]] method may be used to unregister a callback and stop filtering.

> [!NOTE]
> As the `js_filter` handler returns its result immediately, it supports only synchronous operations. Thus, asynchronous operations such as [[10-guides/04-njs/reference|ngx.fetch()]] or [[10-guides/04-njs/reference|setTimeout()]] are not supported.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
