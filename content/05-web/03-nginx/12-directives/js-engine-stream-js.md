---
title: "js_engine (ngx_stream_js_module)"
description: "Directive nginx js_engine (ngx_stream_js_module) — Sets a JavaScript engine to be used for njs scripts. The njs parameter sets the njs engine, also used by default. The qjs parameter sets the QuickJS engine. NOTE The njs engine is deprecated since…"
tags: [nginx, directive, ngx_stream_js_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `js_engine njs \| qjs;` |
| **Valeur par défaut** | `js_engine njs;` |
| **Contexte** | `stream`, `server` |
| **Apparue dans la version** | 0.8.6 |
| **Module** | [[11-modules/03-stream/ngx_stream_js_module\|ngx_stream_js_module]] |

## Utilisation

Sets a [[10-guides/04-njs/engine|JavaScript engine]] to be used for njs scripts. The `njs` parameter sets the njs engine, also used by default. The `qjs` parameter sets the QuickJS engine.

> [!NOTE]
> The `njs` engine is deprecated since 1.0.0; new configurations should use the `qjs` ([[10-guides/04-njs/engine|QuickJS]]) engine.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
