---
title: "ignore_invalid_headers"
description: "Directive nginx ignore_invalid_headers (ngx_http_core_module) — Indique si les champs d'en-tête dont le nom n'est pas valide doivent être ignorés. Un nom valide se compose de lettres anglaises, de chiffres, de tirets et éventuellement de tirets bas (selon la…"
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `ignore_invalid_headers on \| off;` |
| **Valeur par défaut** | `ignore_invalid_headers on;` |
| **Contexte** | `http`, `server` |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Indique si les champs d'en-tête dont le nom n'est pas valide doivent être ignorés. Un nom valide se compose de lettres anglaises, de chiffres, de tirets et éventuellement de tirets bas (selon la directive [[12-directives/underscores-in-headers|underscores_in_headers]]).

Si la directive est indiquée au niveau [[12-directives/server-http-core|server]], la valeur du serveur par défaut peut être utilisée. Les détails figurent dans la section « [[10-guides/02-http/server-names|Choix du serveur virtuel]] ».

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
