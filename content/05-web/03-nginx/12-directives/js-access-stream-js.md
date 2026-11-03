---
title: "js_access (ngx_stream_js_module)"
description: "Directive nginx js_access (ngx_stream_js_module) — Sets an njs function which will be called at the access phase. Since 0.4.0, a module function can be referenced. The function is called once at the moment when the stream session reaches the access…"
tags: [nginx, directive, ngx_stream_js_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `js_access module.function;` |
| **Valeur par défaut** | — |
| **Contexte** | `stream`, `server` |
| **Module** | [[11-modules/03-stream/ngx_stream_js_module\|ngx_stream_js_module]] |

## Utilisation

Sets an njs function which will be called at the [[10-guides/03-stream/stream-processing|access]] phase. Since 0.4.0, a module function can be referenced.

The function is called once at the moment when the stream session reaches the [[10-guides/03-stream/stream-processing|access]] phase for the first time. The function is called with the following arguments:

- **`s`**

  the [[10-guides/04-njs/reference|Stream Session]] object

At this phase, it is possible to perform initialization or register a callback with the [[10-guides/04-njs/reference|s.on()]] method for each incoming data chunk until one of the following methods are called: [[10-guides/04-njs/reference|s.allow()]], [[10-guides/04-njs/reference|s.decline()]], [[10-guides/04-njs/reference|s.done()]]. As soon as one of these methods is called, the stream session processing switches to the [[10-guides/03-stream/stream-processing|next phase]] and all current [[10-guides/04-njs/reference|s.on()]] callbacks are dropped.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
