---
title: "$upstream_addr (ngx_stream_upstream_module)"
description: "Variable nginx $upstream_addr (ngx_stream_upstream_module) — keeps the IP address and port, or the path to the UNIX-domain socket of the upstream server (1.11.4). If several servers were contacted during proxying, their addresses are separated by commas, e.g.…"
tags: [nginx, variable, ngx_stream_upstream_module]
icon: dollar-sign
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Variable** | `$upstream_addr` |
| **Module** | [[11-modules/03-stream/ngx_stream_upstream_module\|ngx_stream_upstream_module]] |

keeps the IP address and port, or the path to the UNIX-domain socket of the upstream server (1.11.4). If several servers were contacted during proxying, their addresses are separated by commas, e.g. “`192.168.1.1:12345, 192.168.1.2:12345, unix:/tmp/sock`”. If a server cannot be selected, the variable keeps the name of the server group.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
