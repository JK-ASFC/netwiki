---
title: "status_format"
description: "Directive nginx status_format (ngx_http_status_module) — By default, status information is output in the JSON format. Alternatively, data may be output as JSONP. The callback parameter specifies the name of a callback function. Parameter value can contain…"
tags: [nginx, directive, ngx_http_status_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `status_format json;` ou `status_format jsonp [callback];` |
| **Valeur par défaut** | `status_format json;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_status_module\|ngx_http_status_module]] |

## Utilisation

By default, status information is output in the JSON format.

Alternatively, data may be output as JSONP. The *callback* parameter specifies the name of a callback function. Parameter value can contain variables. If parameter is omitted, or the computed value is an empty string, then “`ngx_status_jsonp_callback`” is used.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
