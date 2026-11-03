---
title: "add_trailer_inherit"
description: "Directive nginx add_trailer_inherit (ngx_http_headers_module) — Allows altering inheritance rules for the values specified in the add_trailer directives. By default, the standard inheritance model is used. The merge parameter enables appending values from the…"
tags: [nginx, directive, ngx_http_headers_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `add_trailer_inherit on \| off \| merge;` |
| **Valeur par défaut** | `add_trailer_inherit on;` |
| **Contexte** | `http`, `server`, `location`, `if dans location` |
| **Apparue dans la version** | 1.29.3 |
| **Module** | [[11-modules/02-http/ngx_http_headers_module\|ngx_http_headers_module]] |

## Utilisation

Allows altering inheritance rules for the values specified in the [[12-directives/add-trailer|add_trailer]] directives. By default, the standard inheritance model is used.

The `merge` parameter enables appending values from the previous level to the values defined at the current level.

The `off` parameter cancels inheritance of the values from the previous configuration level.

The inheritance rules themselves are inherited in a standard way. For example, `add_trailer_inherit merge;` specified at the top level will be inherited in all nested levels recursively unless redefined later.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
