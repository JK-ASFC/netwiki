---
title: "js_include (ngx_http_js_module)"
description: "Directive nginx js_include (ngx_http_js_module) — Indique un fichier qui met en œuvre des gestionnaires de location et de variables en njs : nginx nginx.conf: js_include http.js; location /version { js_content version; } http.js: function version(r)…"
tags: [nginx, directive, ngx_http_js_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `js_include file;` |
| **Valeur par défaut** | — |
| **Contexte** | `http` |
| **Module** | [[11-modules/02-http/ngx_http_js_module\|ngx_http_js_module]] |

## Utilisation

Indique un fichier qui met en œuvre des gestionnaires de location et de variables en njs :

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

Cette directive est devenue obsolète en version 0.4.0 et a été supprimée en version 0.7.1. Utiliser à la place la directive [[12-directives/js-import-http-js|js_import]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
