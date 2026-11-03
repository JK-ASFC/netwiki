---
title: "http2_chunk_size"
description: "Directive nginx http2_chunk_size (ngx_http_v2_module) — Définit la taille maximale des blocs en lesquels le corps de la réponse est découpé. Une valeur trop faible augmente le surcoût ; une valeur trop élevée nuit à la priorisation à cause du blocage en…"
tags: [nginx, directive, ngx_http_v2_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `http2_chunk_size size;` |
| **Valeur par défaut** | `http2_chunk_size 8k;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_v2_module\|ngx_http_v2_module]] |

## Utilisation

Définit la taille maximale des blocs en lesquels le corps de la réponse est découpé. Une valeur trop faible augmente le surcoût ; une valeur trop élevée nuit à la priorisation à cause du [blocage en tête de file](http://en.wikipedia.org/wiki/Head-of-line_blocking).

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
