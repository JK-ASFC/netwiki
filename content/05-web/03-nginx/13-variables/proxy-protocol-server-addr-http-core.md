---
title: "$proxy_protocol_server_addr (ngx_http_core_module)"
description: "Variable nginx $proxy_protocol_server_addr (ngx_http_core_module) — server address from the PROXY protocol header (1.17.6) The PROXY protocol must be previously enabled by setting the proxy_protocol parameter in the listen directive."
tags: [nginx, variable, ngx_http_core_module]
icon: dollar-sign
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Variable** | `$proxy_protocol_server_addr` |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

server address from the PROXY protocol header (1.17.6)

The PROXY protocol must be previously enabled by setting the `proxy_protocol` parameter in the [[12-directives/listen-http-core|listen]] directive.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
