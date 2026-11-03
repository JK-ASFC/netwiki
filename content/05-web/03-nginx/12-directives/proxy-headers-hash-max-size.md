---
title: "proxy_headers_hash_max_size"
description: "Directive nginx proxy_headers_hash_max_size (ngx_http_proxy_module) — Sets the maximum size of hash tables used by the proxy_hide_header and proxy_set_header directives. The details of setting up hash tables are provided in a separate document."
tags: [nginx, directive, ngx_http_proxy_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `proxy_headers_hash_max_size size;` |
| **Valeur par défaut** | `proxy_headers_hash_max_size 512;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_proxy_module\|ngx_http_proxy_module]] |

## Utilisation

Sets the maximum *size* of hash tables used by the [[12-directives/proxy-hide-header|proxy_hide_header]] and [[12-directives/proxy-set-header|proxy_set_header]] directives. The details of setting up hash tables are provided in a separate [[10-guides/01-introduction/hash|document]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
