---
title: "js_var (ngx_stream_js_module)"
description: "Directive nginx js_var (ngx_stream_js_module) — Declares a writable variable. The value can contain text, variables, and their combination. NOTE The directive can be specified on the server level since 0.7.7."
tags: [nginx, directive, ngx_stream_js_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `js_var $variable [value];` |
| **Valeur par défaut** | — |
| **Contexte** | `stream`, `server` |
| **Apparue dans la version** | 0.5.3 |
| **Module** | [[11-modules/03-stream/ngx_stream_js_module\|ngx_stream_js_module]] |

## Utilisation

Declares a [[10-guides/04-njs/reference|writable]] variable. The value can contain text, variables, and their combination.

> [!NOTE]
> The directive can be specified on the `server` level since 0.7.7.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
