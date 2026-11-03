---
title: "scgi_pass_header"
description: "Directive nginx scgi_pass_header (ngx_http_scgi_module) — Autorise la transmission au client de champs d'en-tête du serveur SCGI normalement masqués."
tags: [nginx, directive, ngx_http_scgi_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `scgi_pass_header field;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_scgi_module\|ngx_http_scgi_module]] |

## Utilisation

Autorise la transmission au client de champs d'en-tête du serveur SCGI [[12-directives/scgi-hide-header|normalement masqués]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
