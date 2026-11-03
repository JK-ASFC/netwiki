---
title: "js_import (ngx_stream_js_module)"
description: "Directive nginx js_import (ngx_stream_js_module) — Imports a module that implements session and variable handlers in njs. The export_name is used as a namespace to access module functions. If the export_name is not specified, the module name will be…"
tags: [nginx, directive, ngx_stream_js_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `js_import module.js \| export_name from module.js;` |
| **Valeur par défaut** | — |
| **Contexte** | `stream`, `server` |
| **Apparue dans la version** | 0.4.0 |
| **Module** | [[11-modules/03-stream/ngx_stream_js_module\|ngx_stream_js_module]] |

## Utilisation

Imports a module that implements session and variable handlers in njs. The `export_name` is used as a namespace to access module functions. If the `export_name` is not specified, the module name will be used as a namespace.

```nginx
js_import stream.js;
```

Here, the module name `stream` is used as a namespace while accessing exports. If the imported module exports `foo()`, `stream.foo` is used to refer to it.

Plusieurs directives `js_import` peuvent être indiquées.

> [!NOTE]
> The directive can be specified on the `server` level since 0.7.7.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
