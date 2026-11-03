---
title: "underscores_in_headers"
description: "Directive nginx underscores_in_headers (ngx_http_core_module) — Active ou désactive l'utilisation des tirets bas dans les champs d'en-tête des requêtes des clients. Si elle est désactivée, les champs dont le nom contient un tiret bas sont marqués non valides et…"
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `underscores_in_headers on \| off;` |
| **Valeur par défaut** | `underscores_in_headers off;` |
| **Contexte** | `http`, `server` |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Active ou désactive l'utilisation des tirets bas dans les champs d'en-tête des requêtes des clients. Si elle est désactivée, les champs dont le nom contient un tiret bas sont marqués non valides et relèvent de la directive [[12-directives/ignore-invalid-headers|ignore_invalid_headers]].

Si la directive est indiquée au niveau [[12-directives/server-http-core|server]], la valeur du serveur par défaut peut être utilisée. Les détails figurent dans la section « [[10-guides/02-http/server-names|Choix du serveur virtuel]] ».

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
