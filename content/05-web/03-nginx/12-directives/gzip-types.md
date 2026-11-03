---
title: "gzip_types"
description: "Directive nginx gzip_types (ngx_http_gzip_module) — Active la compression gzip des réponses pour les types MIME indiqués, en plus de « text/html ». La valeur spéciale « » correspond à tous les types MIME (0.8.29). Les réponses de type « text/html »…"
tags: [nginx, directive, ngx_http_gzip_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `gzip_types mime-type ...;` |
| **Valeur par défaut** | `gzip_types text/html;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_gzip_module\|ngx_http_gzip_module]] |

## Utilisation

Active la compression gzip des réponses pour les types MIME indiqués, en plus de « `text/html` ». La valeur spéciale « `*` » correspond à tous les types MIME (0.8.29). Les réponses de type « `text/html` » sont toujours compressées.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
