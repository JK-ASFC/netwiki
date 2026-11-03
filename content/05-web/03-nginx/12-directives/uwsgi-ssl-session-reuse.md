---
title: "uwsgi_ssl_session_reuse"
description: "Directive nginx uwsgi_ssl_session_reuse (ngx_http_uwsgi_module) — Indique si les sessions SSL peuvent être réutilisées avec un serveur uwsgi sécurisé. Si des erreurs « digest check failed » apparaissent dans les journaux, essayez de désactiver la réutilisation des…"
tags: [nginx, directive, ngx_http_uwsgi_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `uwsgi_ssl_session_reuse on \| off;` |
| **Valeur par défaut** | `uwsgi_ssl_session_reuse on;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.5.8 |
| **Module** | [[11-modules/02-http/ngx_http_uwsgi_module\|ngx_http_uwsgi_module]] |

## Utilisation

Indique si les sessions SSL peuvent être réutilisées avec un serveur uwsgi sécurisé. Si des erreurs « `digest check failed` » apparaissent dans les journaux, essayez de désactiver la réutilisation des sessions.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
