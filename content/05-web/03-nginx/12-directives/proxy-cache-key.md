---
title: "proxy_cache_key"
description: "Directive nginx proxy_cache_key (ngx_http_proxy_module) — Définit une clé de cache, par exemple nginx proxy_cache_key \"$host$request_uri $cookie_user\"; Par défaut, la valeur de la directive est proche de la chaîne nginx proxy_cache_key…"
tags: [nginx, directive, ngx_http_proxy_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `proxy_cache_key string;` |
| **Valeur par défaut** | `proxy_cache_key $scheme$proxy_host$request_uri;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_proxy_module\|ngx_http_proxy_module]] |

## Utilisation

Définit une clé de cache, par exemple

```nginx
proxy_cache_key "$host$request_uri $cookie_user";
```

Par défaut, la valeur de la directive est proche de la chaîne

```nginx
proxy_cache_key $scheme$proxy_host$uri$is_args$args;
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
