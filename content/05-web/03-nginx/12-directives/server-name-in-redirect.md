---
title: "server_name_in_redirect"
description: "Directive nginx server_name_in_redirect (ngx_http_core_module) — Enables or disables the use of the primary server name, specified by the server_name directive, in absolute redirects issued by nginx. When the use of the primary server name is disabled, the name…"
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `server_name_in_redirect on \| off;` |
| **Valeur par défaut** | `server_name_in_redirect off;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Enables or disables the use of the primary server name, specified by the [[12-directives/server-name-http-core|server_name]] directive, in [[12-directives/absolute-redirect|absolute]] redirects issued by nginx. When the use of the primary server name is disabled, the name from the `Host` request header field is used. If this field is not present, the IP address of the server is used.

The use of a port in redirects is controlled by the [[12-directives/port-in-redirect|port_in_redirect]] directive.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
