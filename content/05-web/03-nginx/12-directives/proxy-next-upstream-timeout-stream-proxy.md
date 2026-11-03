---
title: "proxy_next_upstream_timeout (ngx_stream_proxy_module)"
description: "Directive nginx proxy_next_upstream_timeout (ngx_stream_proxy_module) — Limite le temps accordé pour passer une connexion au serveur suivant. La valeur 0 supprime cette limite."
tags: [nginx, directive, ngx_stream_proxy_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `proxy_next_upstream_timeout time;` |
| **Valeur par défaut** | `proxy_next_upstream_timeout 0;` |
| **Contexte** | `stream`, `server` |
| **Module** | [[11-modules/03-stream/ngx_stream_proxy_module\|ngx_stream_proxy_module]] |

## Utilisation

Limite le temps accordé pour passer une connexion au [[12-directives/proxy-next-upstream-stream-proxy|serveur suivant]]. La valeur `0` supprime cette limite.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
