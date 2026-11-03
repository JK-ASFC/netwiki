---
title: "proxy_no_cache"
description: "Directive nginx proxy_no_cache (ngx_http_proxy_module) — Définit les conditions dans lesquelles la réponse n'est pas enregistrée dans le cache. Si au moins une des chaînes en paramètre n'est ni vide ni égale à « 0 », la réponse n'est pas enregistrée :…"
tags: [nginx, directive, ngx_http_proxy_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `proxy_no_cache string ...;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_proxy_module\|ngx_http_proxy_module]] |

## Utilisation

Définit les conditions dans lesquelles la réponse n'est pas enregistrée dans le cache. Si au moins une des chaînes en paramètre n'est ni vide ni égale à « 0 », la réponse n'est pas enregistrée :

```nginx
proxy_no_cache $cookie_nocache $arg_nocache$arg_comment;
proxy_no_cache $http_pragma    $http_authorization;
```

Peut s'utiliser avec la directive [[12-directives/proxy-cache-bypass|proxy_cache_bypass]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
