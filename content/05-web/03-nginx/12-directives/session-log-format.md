---
title: "session_log_format"
description: "Directive nginx session_log_format (ngx_http_session_log_module) — Indique le format de sortie du journal. La valeur de la variable $body_bytes_sent est cumulée sur toutes les requêtes de la session. Les valeurs de toutes les autres variables disponibles…"
tags: [nginx, directive, ngx_http_session_log_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `session_log_format name string ...;` |
| **Valeur par défaut** | `session_log_format combined "...";` |
| **Contexte** | `http` |
| **Module** | [[11-modules/02-http/ngx_http_session_log_module\|ngx_http_session_log_module]] |

## Utilisation

Indique le format de sortie du journal. La valeur de la variable `$body_bytes_sent` est cumulée sur toutes les requêtes de la session. Les valeurs de toutes les autres variables disponibles correspondent à la première requête de la session.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
