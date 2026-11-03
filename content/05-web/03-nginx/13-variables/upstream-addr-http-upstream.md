---
title: "$upstream_addr (ngx_http_upstream_module)"
description: "Variable nginx $upstream_addr (ngx_http_upstream_module) — keeps the IP address and port, or the path to the UNIX-domain socket of the upstream server. If several servers were contacted during request processing, their addresses are separated by commas, e.g.…"
tags: [nginx, variable, ngx_http_upstream_module]
icon: dollar-sign
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Variable** | `$upstream_addr` |
| **Module** | [[11-modules/02-http/ngx_http_upstream_module\|ngx_http_upstream_module]] |

keeps the IP address and port, or the path to the UNIX-domain socket of the upstream server. If several servers were contacted during request processing, their addresses are separated by commas, e.g. “`192.168.1.1:80, 192.168.1.2:80, unix:/tmp/sock`”. If an internal redirect from one server group to another happens, initiated by `X-Accel-Redirect` or [[12-directives/error-page|error_page]], then the server addresses from different groups are separated by colons, e.g. “`192.168.1.1:80, 192.168.1.2:80, unix:/tmp/sock : 192.168.10.1:80, 192.168.10.2:80`”. If a server cannot be selected, the variable keeps the name of the server group.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
