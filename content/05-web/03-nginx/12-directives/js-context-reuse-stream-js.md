---
title: "js_context_reuse (ngx_stream_js_module)"
description: "Directive nginx js_context_reuse (ngx_stream_js_module) — Sets a maximum number of JS context to be reused for QuickJS engine. Each context is used for a single stream session. The finished context is put into a pool of reusable contexts. If the pool is…"
tags: [nginx, directive, ngx_stream_js_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `js_context_reuse number;` |
| **Valeur par défaut** | `js_context_reuse 128;` |
| **Contexte** | `stream`, `server` |
| **Apparue dans la version** | 0.8.6 |
| **Module** | [[11-modules/03-stream/ngx_stream_js_module\|ngx_stream_js_module]] |

## Utilisation

Sets a maximum number of JS context to be reused for [[10-guides/04-njs/engine|QuickJS engine]]. Each context is used for a single stream session. The finished context is put into a pool of reusable contexts. If the pool is full, the context is destroyed.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
