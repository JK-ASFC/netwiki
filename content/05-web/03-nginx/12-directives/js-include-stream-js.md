---
title: "js_include (ngx_stream_js_module)"
description: "Directive nginx js_include (ngx_stream_js_module) — Specifies a file that implements server and variable handlers in njs: nginx nginx.conf: js_include stream.js; js_set $js_addr address; server { listen 127.0.0.1:12345; return $js_addr; } stream.js:…"
tags: [nginx, directive, ngx_stream_js_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `js_include file;` |
| **Valeur par défaut** | — |
| **Contexte** | `stream` |
| **Module** | [[11-modules/03-stream/ngx_stream_js_module\|ngx_stream_js_module]] |

## Utilisation

Specifies a file that implements server and variable handlers in njs:

```nginx
nginx.conf:
js_include stream.js;
js_set     $js_addr address;
server {
    listen 127.0.0.1:12345;
    return $js_addr;
}

stream.js:
function address(s) {
    return s.remoteAddress;
}
```

The directive was made obsolete in version 0.4.0 and was removed in version 0.7.1. The [[12-directives/js-import-stream-js|js_import]] directive should be used instead.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
