---
title: "memcached_buffer_size"
description: "Directive nginx memcached_buffer_size (ngx_http_memcached_module) — Sets the size of the buffer used for reading the response received from the memcached server. The response is passed to the client synchronously, as soon as it is received."
tags: [nginx, directive, ngx_http_memcached_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `memcached_buffer_size size;` |
| **Valeur par défaut** | `memcached_buffer_size 4k\|8k;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_memcached_module\|ngx_http_memcached_module]] |

## Utilisation

Sets the *size* of the buffer used for reading the response received from the memcached server. The response is passed to the client synchronously, as soon as it is received.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
