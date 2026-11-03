---
title: "open_file_cache_errors"
description: "Directive nginx open_file_cache_errors (ngx_http_core_module) — Enables or disables caching of file lookup errors by open_file_cache."
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `open_file_cache_errors on \| off;` |
| **Valeur par défaut** | `open_file_cache_errors off;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Enables or disables caching of file lookup errors by [[12-directives/open-file-cache|open_file_cache]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
