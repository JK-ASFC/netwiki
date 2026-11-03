---
title: "js_preread"
description: "Directive nginx js_preread (ngx_stream_js_module) — Sets an njs function which will be called at the preread phase. Since 0.4.0, a module function can be referenced. The function is called once at the moment when the stream session reaches the preread…"
tags: [nginx, directive, ngx_stream_js_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `js_preread module.function;` |
| **Valeur par défaut** | — |
| **Contexte** | `stream`, `server` |
| **Module** | [[11-modules/03-stream/ngx_stream_js_module\|ngx_stream_js_module]] |

## Utilisation

Sets an njs function which will be called at the [[10-guides/03-stream/stream-processing|preread]] phase. Since 0.4.0, a module function can be referenced.

The function is called once at the moment when the stream session reaches the [[10-guides/03-stream/stream-processing|preread]] phase for the first time. The function is called with the following arguments:

- **`s`**

  the [[10-guides/04-njs/reference|Stream Session]] object

At this phase, it is possible to perform initialization or register a callback with the [[10-guides/04-njs/reference|s.on()]] method for each incoming data chunk until one of the following methods are called: [[10-guides/04-njs/reference|s.allow()]], [[10-guides/04-njs/reference|s.decline()]], [[10-guides/04-njs/reference|s.done()]]. When one of these methods is called, the stream session switches to the [[10-guides/03-stream/stream-processing|next phase]] and all current [[10-guides/04-njs/reference|s.on()]] callbacks are dropped.

> [!NOTE]
> As the `js_preread` handler returns its result immediately, it supports only synchronous callbacks. Thus, asynchronous callbacks such as [[10-guides/04-njs/reference|ngx.fetch()]] or [[10-guides/04-njs/reference|setTimeout()]] are not supported. Nevertheless, asynchronous operations are supported in [[10-guides/04-njs/reference|s.on()]] callbacks in the [[10-guides/03-stream/stream-processing|preread]] phase. See [this example](https://github.com/nginx/njs-examples#authorizing-connections-using-ngx-fetch-as-auth-request-stream-auth-request) for more information.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
