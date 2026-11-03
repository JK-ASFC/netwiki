---
title: "log_subrequest"
description: "Directive nginx log_subrequest (ngx_http_core_module) — Enables or disables logging of subrequests into access_log."
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `log_subrequest on \| off;` |
| **Valeur par défaut** | `log_subrequest off;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Enables or disables logging of subrequests into [[12-directives/access-log-http-log|access_log]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
