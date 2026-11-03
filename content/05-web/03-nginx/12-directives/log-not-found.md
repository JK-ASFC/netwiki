---
title: "log_not_found"
description: "Directive nginx log_not_found (ngx_http_core_module) — Enables or disables logging of errors about not found files into error_log."
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `log_not_found on \| off;` |
| **Valeur par défaut** | `log_not_found on;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Enables or disables logging of errors about not found files into [[12-directives/error-log|error_log]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
