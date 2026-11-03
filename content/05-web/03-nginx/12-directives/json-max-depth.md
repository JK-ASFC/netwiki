---
title: "json_max_depth"
description: "Directive nginx json_max_depth (ngx_http_json_module) — Sets the maximum nesting depth of JSON documents. A document nested deeper is considered invalid. Acceptable values are in the range from 1 to 256."
tags: [nginx, directive, ngx_http_json_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `json_max_depth number;` |
| **Valeur par défaut** | `json_max_depth 32;` |
| **Contexte** | `http` |
| **Module** | [[11-modules/02-http/ngx_http_json_module\|ngx_http_json_module]] |

## Utilisation

Sets the maximum nesting depth of JSON documents. A document nested deeper is considered invalid. Acceptable values are in the range from 1 to 256.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
