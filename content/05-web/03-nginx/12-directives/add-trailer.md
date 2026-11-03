---
title: "add_trailer"
description: "Directive nginx add_trailer (ngx_http_headers_module) — Adds the specified field to the end of a response provided that the response code equals 200, 201, 206, 301, 302, 303, 307, or 308. Parameter value can contain variables. There could be several…"
tags: [nginx, directive, ngx_http_headers_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `add_trailer name value [always];` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server`, `location`, `if dans location` |
| **Apparue dans la version** | 1.13.2 |
| **Module** | [[11-modules/02-http/ngx_http_headers_module\|ngx_http_headers_module]] |

## Utilisation

Adds the specified field to the end of a response provided that the response code equals 200, 201, 206, 301, 302, 303, 307, or 308. Parameter value can contain variables.

There could be several `add_trailer` directives. These directives are inherited from the previous configuration level if and only if there are no `add_trailer` directives defined on the current level. Inheritance rules can be redefined with the [[12-directives/add-trailer-inherit|add_trailer_inherit]] directive (1.29.3).

If the `always` parameter is specified the specified field will be added regardless of the response code.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
