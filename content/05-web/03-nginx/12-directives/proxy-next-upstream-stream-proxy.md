---
title: "proxy_next_upstream (ngx_stream_proxy_module)"
description: "Directive nginx proxy_next_upstream (ngx_stream_proxy_module) — Quand une connexion au serveur mandaté ne peut pas être établie, détermine si la connexion client est passée au serveur suivant. Le passage d'une connexion au serveur suivant peut être limité par le…"
tags: [nginx, directive, ngx_stream_proxy_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `proxy_next_upstream on \| off;` |
| **Valeur par défaut** | `proxy_next_upstream on;` |
| **Contexte** | `stream`, `server` |
| **Module** | [[11-modules/03-stream/ngx_stream_proxy_module\|ngx_stream_proxy_module]] |

## Utilisation

Quand une connexion au serveur mandaté ne peut pas être établie, détermine si la connexion client est passée au serveur suivant.

Le passage d'une connexion au serveur suivant peut être limité par [[12-directives/proxy-next-upstream-tries-stream-proxy|le nombre de tentatives]] et par [[12-directives/proxy-next-upstream-timeout-stream-proxy|la durée]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
