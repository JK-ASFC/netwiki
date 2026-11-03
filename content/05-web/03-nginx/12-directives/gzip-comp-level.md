---
title: "gzip_comp_level"
description: "Directive nginx gzip_comp_level (ngx_http_gzip_module) — Définit le niveau (level) de compression gzip d'une réponse. Les valeurs acceptées vont de 1 à 9."
tags: [nginx, directive, ngx_http_gzip_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `gzip_comp_level level;` |
| **Valeur par défaut** | `gzip_comp_level 1;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_gzip_module\|ngx_http_gzip_module]] |

## Utilisation

Définit le niveau (*level*) de compression gzip d'une réponse. Les valeurs acceptées vont de 1 à 9.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
