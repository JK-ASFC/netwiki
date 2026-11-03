---
title: "db_ssl_session_reuse"
description: "Directive nginx db_ssl_session_reuse (ngx_http_db_module) — Indique si les sessions SSL peuvent être réutilisées avec le serveur de base de données. Si des erreurs « digest check failed » apparaissent dans les journaux, essayez de désactiver la réutilisation…"
tags: [nginx, directive, ngx_http_db_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `db_ssl_session_reuse on \| off;` |
| **Valeur par défaut** | `db_ssl_session_reuse on;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_db_module\|ngx_http_db_module]] |

## Utilisation

Indique si les sessions SSL peuvent être réutilisées avec le serveur de base de données. Si des erreurs « `digest check failed` » apparaissent dans les journaux, essayez de désactiver la réutilisation des sessions.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
