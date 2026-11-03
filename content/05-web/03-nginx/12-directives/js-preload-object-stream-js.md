---
title: "js_preload_object (ngx_stream_js_module)"
description: "Directive nginx js_preload_object (ngx_stream_js_module) — Preloads an immutable object at configure time. The name is used as a name of the global variable though which the object is available in njs code. If the name is not specified, the file name will be…"
tags: [nginx, directive, ngx_stream_js_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `js_preload_object name.json \| name from file.json;` |
| **Valeur par défaut** | — |
| **Contexte** | `stream`, `server` |
| **Apparue dans la version** | 0.7.8 |
| **Module** | [[11-modules/03-stream/ngx_stream_js_module\|ngx_stream_js_module]] |

## Utilisation

Preloads an [[10-guides/04-njs/preload-objects|immutable object]] at configure time. The `name` is used as a name of the global variable though which the object is available in njs code. If the `name` is not specified, the file name will be used instead.

```nginx
js_preload_object map.json;
```

Here, the `map` is used as a name while accessing the preloaded object.

Several `js_preload_object` directives can be specified.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
