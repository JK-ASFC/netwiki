---
title: "js_include (ngx_http_js_module)"
description: "Directive nginx js_include (ngx_http_js_module) — Specifies a file that implements location and variable handlers in njs: nginx nginx.conf: js_include http.js; location /version { js_content version; } http.js: function version(r) { r.return(200,…"
tags: [nginx, directive, ngx_http_js_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `js_include file;` |
| **Valeur par défaut** | — |
| **Contexte** | `http` |
| **Module** | [[11-modules/02-http/ngx_http_js_module\|ngx_http_js_module]] |

## Utilisation

Specifies a file that implements location and variable handlers in njs:

```nginx
nginx.conf:
js_include http.js;
location   /version {
    js_content version;
}

http.js:
function version(r) {
    r.return(200, njs.version);
}
```

The directive was made obsolete in version 0.4.0 and was removed in version 0.7.1. The [[12-directives/js-import-http-js|js_import]] directive should be used instead.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
