---
title: "log_not_found"
description: "Directive nginx log_not_found (ngx_http_core_module) — Active ou désactive la journalisation dans error_log des erreurs de fichiers introuvables."
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `log_not_found on \| off;` |
| **Valeur par défaut** | `log_not_found on;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Active ou désactive la journalisation dans [[12-directives/error-log|error_log]] des erreurs de fichiers introuvables.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
