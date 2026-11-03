---
title: "js_fetch_keepalive (ngx_http_js_module)"
description: "Directive nginx js_fetch_keepalive (ngx_http_js_module) — Activates the cache for connections to destination servers. When the value is greater than 0, enables keepalive connections for Fetch API. The connections parameter sets the maximum number of idle…"
tags: [nginx, directive, ngx_http_js_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `js_fetch_keepalive connections;` |
| **Valeur par défaut** | `js_fetch_keepalive 0;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 0.9.2 |
| **Module** | [[11-modules/02-http/ngx_http_js_module\|ngx_http_js_module]] |

## Utilisation

Activates the cache for connections to destination servers. When the value is greater than `0`, enables keepalive connections for [[10-guides/04-njs/reference|Fetch API]].

The *connections* parameter sets the maximum number of idle keepalive connections to destination servers that are preserved in the cache of each worker process. When this number is exceeded, the least recently used connections are closed.

In HTTP, the cache is maintained separately for each effective location configuration. A value set at the `http` or `server` level is inherited by locations, but each location uses its own cache. Cached connections are reused for requests with the same protocol, host, and port.

When enabled, keepalive assumes that destination servers send valid HTTP responses.

Exemple :

```nginx
location /fetch {
    js_fetch_keepalive 32;
    js_fetch_trusted_certificate /path/to/ISRG_Root_X1.pem;
    js_content main.fetch_handler;
}
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
