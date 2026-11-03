---
title: "open_file_cache_errors"
description: "Directive nginx open_file_cache_errors (ngx_http_core_module) — Active ou désactive la mise en cache des erreurs de recherche de fichiers par open_file_cache."
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `open_file_cache_errors on \| off;` |
| **Valeur par défaut** | `open_file_cache_errors off;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Active ou désactive la mise en cache des erreurs de recherche de fichiers par [[12-directives/open-file-cache|open_file_cache]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
