---
title: "uwsgi_cache_lock"
description: "Directive nginx uwsgi_cache_lock (ngx_http_uwsgi_module) — When enabled, only one request at a time will be allowed to populate a new cache element identified according to the uwsgi_cache_key directive by passing a request to a uwsgi server. Other requests…"
tags: [nginx, directive, ngx_http_uwsgi_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `uwsgi_cache_lock on \| off;` |
| **Valeur par défaut** | `uwsgi_cache_lock off;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.1.12 |
| **Module** | [[11-modules/02-http/ngx_http_uwsgi_module\|ngx_http_uwsgi_module]] |

## Utilisation

When enabled, only one request at a time will be allowed to populate a new cache element identified according to the [[12-directives/uwsgi-cache-key|uwsgi_cache_key]] directive by passing a request to a uwsgi server. Other requests of the same cache element will either wait for a response to appear in the cache or the cache lock for this element to be released, up to the time set by the [[12-directives/uwsgi-cache-lock-timeout|uwsgi_cache_lock_timeout]] directive.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
