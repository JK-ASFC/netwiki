---
title: "port_in_redirect"
description: "Directive nginx port_in_redirect (ngx_http_core_module) — Enables or disables specifying the port in absolute redirects issued by nginx. The use of the primary server name in redirects is controlled by the server_name_in_redirect directive."
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `port_in_redirect on \| off;` |
| **Valeur par défaut** | `port_in_redirect on;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Enables or disables specifying the port in [[12-directives/absolute-redirect|absolute]] redirects issued by nginx.

The use of the primary server name in redirects is controlled by the [[12-directives/server-name-in-redirect|server_name_in_redirect]] directive.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
