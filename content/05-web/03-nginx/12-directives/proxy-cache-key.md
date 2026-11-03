---
title: "proxy_cache_key"
description: "Directive nginx proxy_cache_key (ngx_http_proxy_module) — Defines a key for caching, for example nginx proxy_cache_key \"$host$request_uri $cookie_user\"; By default, the directive’s value is close to the string nginx proxy_cache_key…"
tags: [nginx, directive, ngx_http_proxy_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `proxy_cache_key string;` |
| **Valeur par défaut** | `proxy_cache_key $scheme$proxy_host$request_uri;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_proxy_module\|ngx_http_proxy_module]] |

## Utilisation

Defines a key for caching, for example

```nginx
proxy_cache_key "$host$request_uri $cookie_user";
```

By default, the directive’s value is close to the string

```nginx
proxy_cache_key $scheme$proxy_host$uri$is_args$args;
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
