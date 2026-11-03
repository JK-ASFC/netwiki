---
title: "gzip_http_version"
description: "Directive nginx gzip_http_version (ngx_http_gzip_module) — Sets the minimum HTTP version of a request required to compress a response."
tags: [nginx, directive, ngx_http_gzip_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `gzip_http_version 1.0 \| 1.1;` |
| **Valeur par défaut** | `gzip_http_version 1.1;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_gzip_module\|ngx_http_gzip_module]] |

## Utilisation

Sets the minimum HTTP version of a request required to compress a response.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
