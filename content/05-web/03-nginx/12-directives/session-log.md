---
title: "session_log"
description: "Directive nginx session_log (ngx_http_session_log_module) — Active l'utilisation du journal de sessions indiqué. La valeur spéciale off annule l'effet des directives session_log héritées du niveau de configuration précédent."
tags: [nginx, directive, ngx_http_session_log_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `session_log name \| off;` |
| **Valeur par défaut** | `session_log off;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_session_log_module\|ngx_http_session_log_module]] |

## Utilisation

Active l'utilisation du journal de sessions indiqué. La valeur spéciale `off` annule l'effet des directives `session_log` héritées du niveau de configuration précédent.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
