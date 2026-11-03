---
title: "client_body_in_single_buffer"
description: "Directive nginx client_body_in_single_buffer (ngx_http_core_module) — Determines whether nginx should save the entire client request body in a single buffer. The directive is recommended when using the $request_body variable, to save the number of copy operations…"
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `client_body_in_single_buffer on \| off;` |
| **Valeur par défaut** | `client_body_in_single_buffer off;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Determines whether nginx should save the entire client request body in a single buffer. The directive is recommended when using the `$request_body` variable, to save the number of copy operations involved.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
