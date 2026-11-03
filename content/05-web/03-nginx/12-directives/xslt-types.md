---
title: "xslt_types"
description: "Directive nginx xslt_types (ngx_http_xslt_module) — Active les transformations dans les réponses des types MIME indiqués, en plus de « text/xml ». La valeur spéciale « » correspond à tous les types MIME (0.8.29). Si le résultat de la transformation…"
tags: [nginx, directive, ngx_http_xslt_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `xslt_types mime-type ...;` |
| **Valeur par défaut** | `xslt_types text/xml;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_xslt_module\|ngx_http_xslt_module]] |

## Utilisation

Active les transformations dans les réponses des types MIME indiqués, en plus de « `text/xml` ». La valeur spéciale « `*` » correspond à tous les types MIME (0.8.29). Si le résultat de la transformation est une réponse HTML, son type MIME devient « `text/html` ».

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
