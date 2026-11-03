---
title: "fastcgi_cache_key"
description: "Directive nginx fastcgi_cache_key (ngx_http_fastcgi_module) — Defines a key for caching, for example nginx fastcgi_cache_key localhost:9000$request_uri;"
tags: [nginx, directive, ngx_http_fastcgi_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `fastcgi_cache_key string;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_fastcgi_module\|ngx_http_fastcgi_module]] |

## Utilisation

Defines a key for caching, for example

```nginx
fastcgi_cache_key localhost:9000$request_uri;
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
