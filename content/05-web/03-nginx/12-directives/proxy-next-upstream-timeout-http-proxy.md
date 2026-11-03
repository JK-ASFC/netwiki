---
title: "proxy_next_upstream_timeout (ngx_http_proxy_module)"
description: "Directive nginx proxy_next_upstream_timeout (ngx_http_proxy_module) — Limite la durée pendant laquelle une requête peut être transmise au serveur suivant. La valeur 0 supprime cette limite."
tags: [nginx, directive, ngx_http_proxy_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `proxy_next_upstream_timeout time;` |
| **Valeur par défaut** | `proxy_next_upstream_timeout 0;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.7.5 |
| **Module** | [[11-modules/02-http/ngx_http_proxy_module\|ngx_http_proxy_module]] |

## Utilisation

Limite la durée pendant laquelle une requête peut être transmise au [[12-directives/proxy-next-upstream-http-proxy|serveur suivant]]. La valeur `0` supprime cette limite.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
