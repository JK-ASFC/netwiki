---
title: "memcached_next_upstream_tries"
description: "Directive nginx memcached_next_upstream_tries (ngx_http_memcached_module) — Limits the number of possible tries for passing a request to the next server. The 0 value turns off this limitation."
tags: [nginx, directive, ngx_http_memcached_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `memcached_next_upstream_tries number;` |
| **Valeur par défaut** | `memcached_next_upstream_tries 0;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.7.5 |
| **Module** | [[11-modules/02-http/ngx_http_memcached_module\|ngx_http_memcached_module]] |

## Utilisation

Limits the number of possible tries for passing a request to the [[12-directives/memcached-next-upstream|next server]]. The `0` value turns off this limitation.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
