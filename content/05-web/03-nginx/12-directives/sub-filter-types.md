---
title: "sub_filter_types"
description: "Directive nginx sub_filter_types (ngx_http_sub_module) — Enables string replacement in responses with the specified MIME types in addition to “text/html”. The special value “” matches any MIME type (0.8.29)."
tags: [nginx, directive, ngx_http_sub_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `sub_filter_types mime-type ...;` |
| **Valeur par défaut** | `sub_filter_types text/html;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_sub_module\|ngx_http_sub_module]] |

## Utilisation

Enables string replacement in responses with the specified MIME types in addition to “`text/html`”. The special value “`*`” matches any MIME type (0.8.29).

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
