---
title: "api"
description: "Directive nginx api (ngx_http_api_module) — Turns on the REST API interface in the surrounding location. Access to this location should be limited. The write parameter determines whether the API is read-only or read-write. By default, the API…"
tags: [nginx, directive, ngx_http_api_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `api [write=on\|off];` |
| **Valeur par défaut** | — |
| **Contexte** | `location` |
| **Module** | [[11-modules/02-http/ngx_http_api_module\|ngx_http_api_module]] |

## Utilisation

Turns on the REST API interface in the surrounding location. Access to this location should be [[12-directives/satisfy|limited]].

The `write` parameter determines whether the API is read-only or read-write. By default, the API is read-only.

All API requests should contain a supported API version in the URI. If the request URI equals the location prefix, the list of supported API versions is returned. The current API version is “`10`”.

The optional “`fields`” argument in the request line specifies which fields of the requested objects will be output:

```nginx
http://127.0.0.1/api/10/nginx?fields=version,build
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
