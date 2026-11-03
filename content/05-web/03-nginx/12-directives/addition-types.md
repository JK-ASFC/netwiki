---
title: "addition_types"
description: "Directive nginx addition_types (ngx_http_addition_module) — Permet d'ajouter du texte aux réponses des types MIME indiqués, en plus de « text/html ». La valeur spéciale « » correspond à tous les types MIME (0.8.29)."
tags: [nginx, directive, ngx_http_addition_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `addition_types mime-type ...;` |
| **Valeur par défaut** | `addition_types text/html;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 0.7.9 |
| **Module** | [[11-modules/02-http/ngx_http_addition_module\|ngx_http_addition_module]] |

## Utilisation

Permet d'ajouter du texte aux réponses des types MIME indiqués, en plus de « `text/html` ». La valeur spéciale « `*` » correspond à tous les types MIME (0.8.29).

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
