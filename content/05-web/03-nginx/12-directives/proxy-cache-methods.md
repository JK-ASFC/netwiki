---
title: "proxy_cache_methods"
description: "Directive nginx proxy_cache_methods (ngx_http_proxy_module) — If the client request method is listed in this directive then the response will be cached. “GET” and “HEAD” methods are always added to the list, though it is recommended to specify them explicitly.…"
tags: [nginx, directive, ngx_http_proxy_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `proxy_cache_methods GET \| HEAD \| POST ...;` |
| **Valeur par défaut** | `proxy_cache_methods GET HEAD;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 0.7.59 |
| **Module** | [[11-modules/02-http/ngx_http_proxy_module\|ngx_http_proxy_module]] |

## Utilisation

If the client request method is listed in this directive then the response will be cached. “`GET`” and “`HEAD`” methods are always added to the list, though it is recommended to specify them explicitly. See also the [[12-directives/proxy-no-cache|proxy_no_cache]] directive.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
