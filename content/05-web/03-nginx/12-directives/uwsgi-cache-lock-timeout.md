---
title: "uwsgi_cache_lock_timeout"
description: "Directive nginx uwsgi_cache_lock_timeout (ngx_http_uwsgi_module) — Sets a timeout for uwsgi_cache_lock. When the time expires, the request will be passed to the uwsgi server, however, the response will not be cached. NOTE Before 1.7.8, the response could be cached."
tags: [nginx, directive, ngx_http_uwsgi_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `uwsgi_cache_lock_timeout time;` |
| **Valeur par défaut** | `uwsgi_cache_lock_timeout 5s;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.1.12 |
| **Module** | [[11-modules/02-http/ngx_http_uwsgi_module\|ngx_http_uwsgi_module]] |

## Utilisation

Sets a timeout for [[12-directives/uwsgi-cache-lock|uwsgi_cache_lock]]. When the *time* expires, the request will be passed to the uwsgi server, however, the response will not be cached.

> [!NOTE]
> Before 1.7.8, the response could be cached.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
