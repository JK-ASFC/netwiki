---
title: "memcached_buffer_size"
description: "Directive nginx memcached_buffer_size (ngx_http_memcached_module) — Définit la taille (size) du tampon utilisé pour lire la réponse reçue du serveur memcached. La réponse est transmise au client de façon synchrone, dès sa réception."
tags: [nginx, directive, ngx_http_memcached_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `memcached_buffer_size size;` |
| **Valeur par défaut** | `memcached_buffer_size 4k\|8k;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_memcached_module\|ngx_http_memcached_module]] |

## Utilisation

Définit la taille (*size*) du tampon utilisé pour lire la réponse reçue du serveur memcached. La réponse est transmise au client de façon synchrone, dès sa réception.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
