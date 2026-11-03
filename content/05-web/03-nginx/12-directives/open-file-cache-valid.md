---
title: "open_file_cache_valid"
description: "Directive nginx open_file_cache_valid (ngx_http_core_module) — Sets a time after which open_file_cache elements should be validated."
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `open_file_cache_valid time;` |
| **Valeur par défaut** | `open_file_cache_valid 60s;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Sets a time after which [[12-directives/open-file-cache|open_file_cache]] elements should be validated.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
