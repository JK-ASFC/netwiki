---
title: "gzip_vary"
description: "Directive nginx gzip_vary (ngx_http_gzip_module) — Active ou désactive l'ajout du champ d'en-tête de réponse Vary: Accept-Encoding si l'une des directives gzip, gzip_static ou gunzip est active."
tags: [nginx, directive, ngx_http_gzip_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `gzip_vary on \| off;` |
| **Valeur par défaut** | `gzip_vary off;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_gzip_module\|ngx_http_gzip_module]] |

## Utilisation

Active ou désactive l'ajout du champ d'en-tête de réponse `Vary: Accept-Encoding` si l'une des directives [[12-directives/gzip|gzip]], [[12-directives/gzip-static|gzip_static]] ou [[12-directives/gunzip|gunzip]] est active.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
