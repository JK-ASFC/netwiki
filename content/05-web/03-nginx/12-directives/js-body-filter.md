---
title: "js_body_filter"
description: "Directive nginx js_body_filter (ngx_http_js_module) — Sets an njs function as a response body filter. The filter function is called for each data chunk of a response body with the following arguments: - r the HTTP request object - data the incoming data…"
tags: [nginx, directive, ngx_http_js_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `js_body_filter module.function [buffer_type=string \| buffer];` |
| **Valeur par défaut** | — |
| **Contexte** | `location`, `if dans location`, `limit_except` |
| **Apparue dans la version** | 0.5.2 |
| **Module** | [[11-modules/02-http/ngx_http_js_module\|ngx_http_js_module]] |

## Utilisation

Sets an njs function as a response body filter. The filter function is called for each data chunk of a response body with the following arguments:

- **`r`**

  the [[10-guides/04-njs/reference|HTTP request]] object

- **`data`**

  the incoming data chunk, may be a string or Buffer depending on the `buffer_type` value, by default is a string. Since 0.8.5, the `data` value is implicitly converted to a valid UTF-8 string by default. For binary data, the `buffer_type` value should be set to `buffer`.

- **`flags`**

  an object with the following properties:

  - **`last`**

    a boolean value, true if data is a last buffer.

The filter function can pass its own modified version of the input data chunk to the next body filter by calling [[10-guides/04-njs/reference|r.sendBuffer()]]. For example, to transform all the lowercase letters in the response body:

```nginx
function filter(r, data, flags) {
    r.sendBuffer(data.toLowerCase(), flags);
}
```

If the filter function changes the length of the response body, the `Content-Length` response header (if present) should be cleared in [[12-directives/js-header-filter|js_header_filter]] to enforce chunked transfer encoding:

```nginx
example.conf:
 location /foo {
     # proxy_pass http://localhost:8080;

    js_header_filter main.clear_content_length;
    js_body_filter   main.filter;
 }

example.js:
 function clear_content_length(r) {
     delete r.headersOut['Content-Length'];
 }
```

To stop filtering and pass the data chunks to the client without calling `js_body_filter`, [[10-guides/04-njs/reference|r.done()]] can be used. For example, to prepend some data to the response body:

```nginx
function prepend(r, data, flags) {
    r.sendBuffer("XXX");
    r.sendBuffer(data, flags);
    r.done();
}
```

> [!NOTE]
> As the `js_body_filter` handler returns its result immediately, it supports only synchronous operations. Thus, asynchronous operations such as [[10-guides/04-njs/reference|r.subrequest()]] or [[10-guides/04-njs/reference|setTimeout()]] are not supported.

> [!NOTE]
> The directive can be specified inside the [[12-directives/if|if]] block since 0.7.7.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
