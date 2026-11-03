---
title: "proxy_next_upstream_tries (ngx_stream_proxy_module)"
description: "Directive nginx proxy_next_upstream_tries (ngx_stream_proxy_module) — Limite le nombre de tentatives possibles pour passer une connexion au serveur suivant. La valeur 0 supprime cette limite."
tags: [nginx, directive, ngx_stream_proxy_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `proxy_next_upstream_tries number;` |
| **Valeur par défaut** | `proxy_next_upstream_tries 0;` |
| **Contexte** | `stream`, `server` |
| **Module** | [[11-modules/03-stream/ngx_stream_proxy_module\|ngx_stream_proxy_module]] |

## Utilisation

Limite le nombre de tentatives possibles pour passer une connexion au [[12-directives/proxy-next-upstream-stream-proxy|serveur suivant]]. La valeur `0` supprime cette limite.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
