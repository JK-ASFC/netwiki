---
title: "js_load_stream_native_module"
description: "Directive nginx js_load_stream_native_module (ngx_stream_js_module) — Loads a native module (shared library) for use in Stream JavaScript code. The directive is QuickJS-only and is not available when using the njs built-in JavaScript engine. The path parameter…"
tags: [nginx, directive, ngx_stream_js_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `js_load_stream_native_module path [as name];` |
| **Valeur par défaut** | — |
| **Contexte** | `main` |
| **Apparue dans la version** | 0.9.5 |
| **Module** | [[11-modules/03-stream/ngx_stream_js_module\|ngx_stream_js_module]] |

## Utilisation

Loads a [[10-guides/04-njs/native-modules|native module]] (shared library) for use in Stream JavaScript code. The directive is [[10-guides/04-njs/engine|QuickJS]]-only and is not available when using the njs built-in JavaScript engine.

The *path* parameter specifies the absolute path to the shared library file. The optional `as` *name* parameter provides an alias name for importing the module in JavaScript code. If not specified, the module can be imported using its filename.

Example:

```nginx
js_load_stream_native_module /path/to/mylib.so;
js_load_stream_native_module /path/to/other.so as myalias;

stream {
    js_import main.js;
    # ... rest of stream configuration
}
```

In JavaScript code:

```nginx
// Import by filename
import * as mylib from 'mylib.so';

// Import by alias
import * as myalias from 'myalias';

// Use exported functions
let result = mylib.add(5, 10);
```

> [!NOTE]
> For security reasons, this directive is only allowed in the `main` configuration context. Native modules run with full process privileges; use absolute paths and ensure proper code review.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
