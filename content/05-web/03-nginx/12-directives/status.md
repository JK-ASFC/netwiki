---
title: "status"
description: "Directive nginx status (ngx_http_status_module) — Les informations d'état sont accessibles depuis le bloc location englobant, dont l'accès doit être limité."
tags: [nginx, directive, ngx_http_status_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `status;` |
| **Valeur par défaut** | — |
| **Contexte** | `location` |
| **Module** | [[11-modules/02-http/ngx_http_status_module\|ngx_http_status_module]] |

## Utilisation

Les informations d'état sont accessibles depuis le bloc location englobant, dont l'accès doit être [[12-directives/satisfy|limité]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
