---
title: "memcached_connect_timeout"
description: "Directive nginx memcached_connect_timeout (ngx_http_memcached_module) — Définit le délai d'établissement de la connexion avec un serveur memcached. Ce délai ne peut généralement pas dépasser 75 secondes."
tags: [nginx, directive, ngx_http_memcached_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `memcached_connect_timeout time;` |
| **Valeur par défaut** | `memcached_connect_timeout 60s;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_memcached_module\|ngx_http_memcached_module]] |

## Utilisation

Définit le délai d'établissement de la connexion avec un serveur memcached. Ce délai ne peut généralement pas dépasser 75 secondes.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
