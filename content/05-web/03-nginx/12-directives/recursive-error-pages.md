---
title: "recursive_error_pages"
description: "Directive nginx recursive_error_pages (ngx_http_core_module) — Enables or disables doing several redirects using the error_page directive. The number of such redirects is limited."
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `recursive_error_pages on \| off;` |
| **Valeur par défaut** | `recursive_error_pages off;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Enables or disables doing several redirects using the [[12-directives/error-page|error_page]] directive. The number of such redirects is [[12-directives/internal|limited]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
