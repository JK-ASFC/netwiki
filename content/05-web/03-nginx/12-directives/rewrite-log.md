---
title: "rewrite_log"
description: "Directive nginx rewrite_log (ngx_http_rewrite_module) — Active ou désactive la journalisation, au niveau notice dans error_log, des résultats du traitement des directives du module ngx_http_rewrite_module."
tags: [nginx, directive, ngx_http_rewrite_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `rewrite_log on \| off;` |
| **Valeur par défaut** | `rewrite_log off;` |
| **Contexte** | `http`, `server`, `location`, `if` |
| **Module** | [[11-modules/02-http/ngx_http_rewrite_module\|ngx_http_rewrite_module]] |

## Utilisation

Active ou désactive la journalisation, au niveau `notice` dans [[12-directives/error-log|error_log]], des résultats du traitement des directives du module `ngx_http_rewrite_module`.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
