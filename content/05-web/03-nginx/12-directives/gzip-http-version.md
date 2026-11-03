---
title: "gzip_http_version"
description: "Directive nginx gzip_http_version (ngx_http_gzip_module) — Définit la version HTTP minimale d'une requête pour que la réponse soit compressée."
tags: [nginx, directive, ngx_http_gzip_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `gzip_http_version 1.0 \| 1.1;` |
| **Valeur par défaut** | `gzip_http_version 1.1;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_gzip_module\|ngx_http_gzip_module]] |

## Utilisation

Définit la version HTTP minimale d'une requête pour que la réponse soit compressée.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
