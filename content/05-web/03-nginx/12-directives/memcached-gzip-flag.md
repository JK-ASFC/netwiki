---
title: "memcached_gzip_flag"
description: "Directive nginx memcached_gzip_flag (ngx_http_memcached_module) — Active la recherche du drapeau (flag) dans la réponse du serveur memcached et, s'il est présent, règle le champ d'en-tête de réponse « Content-Encoding » sur « gzip »."
tags: [nginx, directive, ngx_http_memcached_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `memcached_gzip_flag flag;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.3.6 |
| **Module** | [[11-modules/02-http/ngx_http_memcached_module\|ngx_http_memcached_module]] |

## Utilisation

Active la recherche du drapeau (*flag*) dans la réponse du serveur memcached et, s'il est présent, règle le champ d'en-tête de réponse « `Content-Encoding` » sur « `gzip` ».

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
