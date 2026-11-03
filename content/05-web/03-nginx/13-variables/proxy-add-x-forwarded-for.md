---
title: "$proxy_add_x_forwarded_for"
description: "Variable nginx $proxy_add_x_forwarded_for (ngx_http_proxy_module) — the X-Forwarded-For client request header field with the $remote_addr variable appended to it, separated by a comma. If the X-Forwarded-For field is not present in the client request header, the…"
tags: [nginx, variable, ngx_http_proxy_module]
icon: dollar-sign
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Variable** | `$proxy_add_x_forwarded_for` |
| **Module** | [[11-modules/02-http/ngx_http_proxy_module\|ngx_http_proxy_module]] |

the `X-Forwarded-For` client request header field with the `$remote_addr` variable appended to it, separated by a comma. If the `X-Forwarded-For` field is not present in the client request header, the `$proxy_add_x_forwarded_for` variable is equal to the `$remote_addr` variable.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
