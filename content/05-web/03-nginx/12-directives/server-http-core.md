---
title: "server (ngx_http_core_module)"
description: "Directive nginx server (ngx_http_core_module) — Sets configuration for a virtual server. There is no clear separation between IP-based (based on the IP address) and name-based (based on the Host request header field) virtual servers. Instead, the…"
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `server { ... }` |
| **Valeur par défaut** | — |
| **Contexte** | `http` |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Sets configuration for a virtual server. There is no clear separation between IP-based (based on the IP address) and name-based (based on the `Host` request header field) virtual servers. Instead, the [[12-directives/listen-http-core|listen]] directives describe all addresses and ports that should accept connections for the server, and the [[12-directives/server-name-http-core|server_name]] directive lists all server names. Example configurations are provided in the “[[10-guides/02-http/request-processing|How nginx processes a request]]” document.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
