---
title: "scgi_intercept_errors"
description: "Directive nginx scgi_intercept_errors (ngx_http_scgi_module) — Indique si les réponses d'un serveur SCGI de code supérieur ou égal à 300 doivent être transmises au client, ou interceptées et confiées à nginx pour être traitées par la directive error_page."
tags: [nginx, directive, ngx_http_scgi_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `scgi_intercept_errors on \| off;` |
| **Valeur par défaut** | `scgi_intercept_errors off;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_scgi_module\|ngx_http_scgi_module]] |

## Utilisation

Indique si les réponses d'un serveur SCGI de code supérieur ou égal à 300 doivent être transmises au client, ou interceptées et confiées à nginx pour être traitées par la directive [[12-directives/error-page|error_page]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
