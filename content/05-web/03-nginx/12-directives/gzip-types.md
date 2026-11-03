---
title: "gzip_types"
description: "Directive nginx gzip_types (ngx_http_gzip_module) — Enables gzipping of responses for the specified MIME types in addition to “text/html”. The special value “” matches any MIME type (0.8.29). Responses with the “text/html” type are always compressed."
tags: [nginx, directive, ngx_http_gzip_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `gzip_types mime-type ...;` |
| **Valeur par défaut** | `gzip_types text/html;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_gzip_module\|ngx_http_gzip_module]] |

## Utilisation

Enables gzipping of responses for the specified MIME types in addition to “`text/html`”. The special value “`*`” matches any MIME type (0.8.29). Responses with the “`text/html`” type are always compressed.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
