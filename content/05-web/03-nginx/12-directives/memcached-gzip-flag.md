---
title: "memcached_gzip_flag"
description: "Directive nginx memcached_gzip_flag (ngx_http_memcached_module) — Enables the test for the flag presence in the memcached server response and sets the “Content-Encoding” response header field to “gzip” if the flag is set."
tags: [nginx, directive, ngx_http_memcached_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `memcached_gzip_flag flag;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.3.6 |
| **Module** | [[11-modules/02-http/ngx_http_memcached_module\|ngx_http_memcached_module]] |

## Utilisation

Enables the test for the *flag* presence in the memcached server response and sets the “`Content-Encoding`” response header field to “`gzip`” if the flag is set.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
