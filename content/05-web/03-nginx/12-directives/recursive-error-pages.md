---
title: "recursive_error_pages"
description: "Directive nginx recursive_error_pages (ngx_http_core_module) — Active ou désactive l'enchaînement de plusieurs redirections avec la directive error_page. Le nombre de ces redirections est limité."
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `recursive_error_pages on \| off;` |
| **Valeur par défaut** | `recursive_error_pages off;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Active ou désactive l'enchaînement de plusieurs redirections avec la directive [[12-directives/error-page|error_page]]. Le nombre de ces redirections est [[12-directives/internal|limité]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
