---
title: "proxy_ssl_session_reuse (ngx_http_proxy_module)"
description: "Directive nginx proxy_ssl_session_reuse (ngx_http_proxy_module) — Indique si les sessions SSL peuvent être réutilisées avec le serveur mandaté. Si des erreurs « digest check failed » apparaissent dans les journaux, essayez de désactiver la réutilisation des…"
tags: [nginx, directive, ngx_http_proxy_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `proxy_ssl_session_reuse on \| off;` |
| **Valeur par défaut** | `proxy_ssl_session_reuse on;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_proxy_module\|ngx_http_proxy_module]] |

## Utilisation

Indique si les sessions SSL peuvent être réutilisées avec le serveur mandaté. Si des erreurs « `digest check failed` » apparaissent dans les journaux, essayez de désactiver la réutilisation des sessions.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
