---
title: "gzip_comp_level"
description: "Directive nginx gzip_comp_level (ngx_http_gzip_module) — Sets a gzip compression level of a response. Acceptable values are in the range from 1 to 9."
tags: [nginx, directive, ngx_http_gzip_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `gzip_comp_level level;` |
| **Valeur par défaut** | `gzip_comp_level 1;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_gzip_module\|ngx_http_gzip_module]] |

## Utilisation

Sets a gzip compression *level* of a response. Acceptable values are in the range from 1 to 9.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
