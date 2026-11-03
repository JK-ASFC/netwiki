---
title: "rewrite_log"
description: "Directive nginx rewrite_log (ngx_http_rewrite_module) — Enables or disables logging of ngx_http_rewrite_module module directives processing results into the error_log at the notice level."
tags: [nginx, directive, ngx_http_rewrite_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `rewrite_log on \| off;` |
| **Valeur par défaut** | `rewrite_log off;` |
| **Contexte** | `http`, `server`, `location`, `if` |
| **Module** | [[11-modules/02-http/ngx_http_rewrite_module\|ngx_http_rewrite_module]] |

## Utilisation

Enables or disables logging of `ngx_http_rewrite_module` module directives processing results into the [[12-directives/error-log|error_log]] at the `notice` level.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
