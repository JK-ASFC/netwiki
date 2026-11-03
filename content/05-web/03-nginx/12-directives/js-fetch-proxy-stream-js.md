---
title: "js_fetch_proxy (ngx_stream_js_module)"
description: "Directive nginx js_fetch_proxy (ngx_stream_js_module) — Configures a forward proxy URL with Fetch API. The url supports the HTTP scheme only and can contain optional user credentials in the format http://user:password@host:port for Basic authentication.…"
tags: [nginx, directive, ngx_stream_js_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `js_fetch_proxy url;` |
| **Valeur par défaut** | — |
| **Contexte** | `stream`, `server` |
| **Apparue dans la version** | 0.9.4 |
| **Module** | [[11-modules/03-stream/ngx_stream_js_module\|ngx_stream_js_module]] |

## Utilisation

Configures a forward proxy URL with [[10-guides/04-njs/reference|Fetch API]]. The *url* supports the HTTP scheme only and can contain optional user credentials in the format `http://[user:password@]host:port` for Basic authentication. Supports both HTTP and HTTPS connections to destination servers. If the *url* is empty, proxy routing is disabled. The parameter value can contain variables.

Example:

```nginx
server {
    listen 12345;
    js_fetch_proxy http://user:pass@proxy.example.com:3128;
    js_preread main.fetch_handler;
}
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
