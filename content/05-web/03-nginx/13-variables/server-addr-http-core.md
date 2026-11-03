---
title: "$server_addr (ngx_http_core_module)"
description: "Variable nginx $server_addr (ngx_http_core_module) — an address of the server which accepted a request Computing a value of this variable usually requires one system call. To avoid a system call, the listen directives must specify addresses and use the…"
tags: [nginx, variable, ngx_http_core_module]
icon: dollar-sign
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Variable** | `$server_addr` |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

an address of the server which accepted a request

Computing a value of this variable usually requires one system call. To avoid a system call, the [[12-directives/listen-http-core|listen]] directives must specify addresses and use the `bind` parameter.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
