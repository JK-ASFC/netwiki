---
title: "js_set (ngx_http_js_module)"
description: "Directive nginx js_set (ngx_http_js_module) — Sets an njs function for the specified variable. Since 0.4.0, a module function can be referenced. The function is called when the variable is referenced for the first time for a given request. The…"
tags: [nginx, directive, ngx_http_js_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `js_set $variable module.function [nocache];` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_js_module\|ngx_http_js_module]] |

## Utilisation

Sets an njs `function` for the specified `variable`. Since 0.4.0, a module function can be referenced.

The function is called when the variable is referenced for the first time for a given request. The exact moment depends on a [[10-guides/06-developpement/development-guide|phase]] at which the variable is referenced. This can be used to perform some logic not related to variable evaluation. For example, if the variable is referenced only in the [[12-directives/log-format-http-log|log_format]] directive, its handler will not be executed until the log phase. This handler can be used to do some cleanup right before the request is freed.

Since 0.8.6, if an optional argument `nocache` is specified, the handler is called every time it is referenced. Due to current limitations of the [[11-modules/02-http/ngx_http_rewrite_module|rewrite]] module, when a `nocache` variable is referenced by the [[12-directives/set-http-rewrite|set]] directive its handler should always return a fixed-length value.

> [!NOTE]
> As the `js_set` handler returns its result immediately, it supports only synchronous operations. Thus, asynchronous operations such as [[10-guides/04-njs/reference|r.subrequest()]] or [[10-guides/04-njs/reference|setTimeout()]] are not supported.

> [!NOTE]
> The directive can be specified on the `server` and `location` level since 0.7.7.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
