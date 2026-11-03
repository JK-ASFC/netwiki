---
title: "memcached_next_upstream_timeout"
description: "Directive nginx memcached_next_upstream_timeout (ngx_http_memcached_module) — Limits the time during which a request can be passed to the next server. The 0 value turns off this limitation."
tags: [nginx, directive, ngx_http_memcached_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `memcached_next_upstream_timeout time;` |
| **Valeur par défaut** | `memcached_next_upstream_timeout 0;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.7.5 |
| **Module** | [[11-modules/02-http/ngx_http_memcached_module\|ngx_http_memcached_module]] |

## Utilisation

Limits the time during which a request can be passed to the [[12-directives/memcached-next-upstream|next server]]. The `0` value turns off this limitation.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
