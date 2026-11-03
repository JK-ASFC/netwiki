---
title: "status_zone (ngx_http_api_module)"
description: "Directive nginx status_zone (ngx_http_api_module) — Enables collection of virtual http or stream server status information in the specified zone. Several servers may share the same zone. Starting from 1.17.0, status information can be collected per…"
tags: [nginx, directive, ngx_http_api_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `status_zone zone;` |
| **Valeur par défaut** | — |
| **Contexte** | `server`, `location`, `if dans location` |
| **Apparue dans la version** | 1.13.12 |
| **Module** | [[11-modules/02-http/ngx_http_api_module\|ngx_http_api_module]] |

## Utilisation

Enables collection of virtual [[12-directives/server-http-core|http]] or [[12-directives/server-stream-core|stream]] server status information in the specified *zone*. Several servers may share the same zone.

Starting from 1.17.0, status information can be collected per [[12-directives/location|location]]. The special value `off` disables statistics collection in nested location blocks. Note that the statistics is collected in the context of a location where processing ends. It may be different from the original location, if an [[12-directives/internal|internal redirect]] happens during request processing.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
