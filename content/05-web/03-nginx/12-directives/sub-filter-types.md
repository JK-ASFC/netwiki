---
title: "sub_filter_types"
description: "Directive nginx sub_filter_types (ngx_http_sub_module) — Active le remplacement de chaînes dans les réponses des types MIME indiqués, en plus de « text/html ». La valeur spéciale « » correspond à tous les types MIME (0.8.29)."
tags: [nginx, directive, ngx_http_sub_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `sub_filter_types mime-type ...;` |
| **Valeur par défaut** | `sub_filter_types text/html;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_sub_module\|ngx_http_sub_module]] |

## Utilisation

Active le remplacement de chaînes dans les réponses des types MIME indiqués, en plus de « `text/html` ». La valeur spéciale « `*` » correspond à tous les types MIME (0.8.29).

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
