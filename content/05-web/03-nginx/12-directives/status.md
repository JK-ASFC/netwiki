---
title: "status"
description: "Directive nginx status (ngx_http_status_module) — The status information will be accessible from the surrounding location. Access to this location should be limited."
tags: [nginx, directive, ngx_http_status_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `status;` |
| **Valeur par défaut** | — |
| **Contexte** | `location` |
| **Module** | [[11-modules/02-http/ngx_http_status_module\|ngx_http_status_module]] |

## Utilisation

The status information will be accessible from the surrounding location. Access to this location should be [[12-directives/satisfy|limited]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
