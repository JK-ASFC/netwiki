---
title: "fastcgi_pass_header"
description: "Directive nginx fastcgi_pass_header (ngx_http_fastcgi_module) — Autorise la transmission au client de champs d'en-tête du serveur FastCGI normalement masqués."
tags: [nginx, directive, ngx_http_fastcgi_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `fastcgi_pass_header field;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_fastcgi_module\|ngx_http_fastcgi_module]] |

## Utilisation

Autorise la transmission au client de champs d'en-tête du serveur FastCGI [[12-directives/fastcgi-hide-header|normalement masqués]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
