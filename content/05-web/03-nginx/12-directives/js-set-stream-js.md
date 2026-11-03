---
title: "js_set (ngx_stream_js_module)"
description: "Directive nginx js_set (ngx_stream_js_module) — Sets an njs function for the specified variable. Since 0.4.0, a module function can be referenced. The function is called when the variable is referenced for the first time for a given request. The…"
tags: [nginx, directive, ngx_stream_js_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `js_set $variable module.function [nocache];` |
| **Valeur par défaut** | — |
| **Contexte** | `stream`, `server` |
| **Module** | [[11-modules/03-stream/ngx_stream_js_module\|ngx_stream_js_module]] |

## Utilisation

Sets an njs `function` for the specified `variable`. Since 0.4.0, a module function can be referenced.

The function is called when the variable is referenced for the first time for a given request. The exact moment depends on a [[10-guides/03-stream/stream-processing|phase]] at which the variable is referenced. This can be used to perform some logic not related to variable evaluation. For example, if the variable is referenced only in the [[12-directives/log-format-stream-log|log_format]] directive, its handler will not be executed until the log phase. This handler can be used to do some cleanup right before the request is freed.

Since 0.8.6, when optional argument `nocache` is provided the handler is called every time it is referenced. Due to current limitations of the [[11-modules/03-stream/ngx_stream_set_module|ngx_stream_set_module]] module, when a `nocache` variable is referenced by the [[12-directives/set-stream-set|set]] directive its handler should always return a fixed-length value.

> [!NOTE]
> As the `js_set` handler returns its result immediately, it supports only synchronous callbacks. Thus, asynchronous callbacks such as [[10-guides/04-njs/reference|ngx.fetch()]] or [[10-guides/04-njs/reference|setTimeout()]] are not supported.

> [!NOTE]
> The directive can be specified on the `server` level since 0.7.7.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
