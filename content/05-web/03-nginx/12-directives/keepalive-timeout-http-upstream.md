---
title: "keepalive_timeout (ngx_http_upstream_module)"
description: "Directive nginx keepalive_timeout (ngx_http_upstream_module) — Sets a timeout during which an idle keepalive connection to an upstream server will stay open."
tags: [nginx, directive, ngx_http_upstream_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `keepalive_timeout timeout;` |
| **Valeur par défaut** | `keepalive_timeout 60s;` |
| **Contexte** | `upstream` |
| **Apparue dans la version** | 1.15.3 |
| **Module** | [[11-modules/02-http/ngx_http_upstream_module\|ngx_http_upstream_module]] |

## Utilisation

Sets a timeout during which an idle keepalive connection to an upstream server will stay open.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
