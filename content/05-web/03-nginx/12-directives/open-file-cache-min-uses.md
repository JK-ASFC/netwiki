---
title: "open_file_cache_min_uses"
description: "Directive nginx open_file_cache_min_uses (ngx_http_core_module) — Sets the minimum number of file accesses during the period configured by the inactive parameter of the open_file_cache directive, required for a file descriptor to remain open in the cache."
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `open_file_cache_min_uses number;` |
| **Valeur par défaut** | `open_file_cache_min_uses 1;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Sets the minimum *number* of file accesses during the period configured by the `inactive` parameter of the [[12-directives/open-file-cache|open_file_cache]] directive, required for a file descriptor to remain open in the cache.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
