---
title: "js_import (ngx_http_js_module)"
description: "Directive nginx js_import (ngx_http_js_module) — Imports a module that implements location, variable, and filter handlers in njs. The export_name is used as a namespace to access module functions. If the export_name is not specified, the module…"
tags: [nginx, directive, ngx_http_js_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `js_import module.js \| export_name from module.js;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 0.4.0 |
| **Module** | [[11-modules/02-http/ngx_http_js_module\|ngx_http_js_module]] |

## Utilisation

Imports a module that implements location, variable, and filter handlers in njs. The `export_name` is used as a namespace to access module functions. If the `export_name` is not specified, the module name will be used as a namespace.

```nginx
js_import http.js;
```

Here, the module name `http` is used as a namespace while accessing exports. If the imported module exports `foo()`, `http.foo` is used to refer to it.

Several `js_import` directives can be specified.

When `js_import` is specified inside a [[12-directives/location|location]], the imported modules are visible only if no JavaScript code has been invoked earlier in the request. A single VM is created per request when a [[12-directives/js-set-http-js|js_set]] variable is first accessed or when a [[12-directives/js-content|js_content]], [[12-directives/js-header-filter|js_header_filter]], [[12-directives/js-body-filter|js_body_filter]], or [[12-directives/js-access-http-js|js_access]] handler is first invoked. The VM is cloned from the configuration scope active at that moment, and all subsequent JavaScript invocations within the request reuse it. Thus, if any of the above is referenced before the request is mapped to its final location, for example from a server-level [[12-directives/set-http-rewrite|set]], the VM is bound to the import set of the outer scope, and modules imported in the matched `location` will not be visible. To avoid this, declare such imports in a common parent scope.

> [!NOTE]
> The directive can be specified on the `server` and `location` level since 0.7.7.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
