---
title: "memcached_send_timeout"
description: "Directive nginx memcached_send_timeout (ngx_http_memcached_module) — Définit le délai de transmission d'une requête au serveur memcached. Ce délai porte uniquement sur l'intervalle entre deux écritures successives, pas sur la transmission de toute la requête. Si le…"
tags: [nginx, directive, ngx_http_memcached_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `memcached_send_timeout time;` |
| **Valeur par défaut** | `memcached_send_timeout 60s;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_memcached_module\|ngx_http_memcached_module]] |

## Utilisation

Définit le délai de transmission d'une requête au serveur memcached. Ce délai porte uniquement sur l'intervalle entre deux écritures successives, pas sur la transmission de toute la requête. Si le serveur memcached ne reçoit rien pendant ce délai, la connexion est fermée.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
