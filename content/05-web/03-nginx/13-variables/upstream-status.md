---
title: "$upstream_status"
description: "Variable nginx $upstream_status (ngx_http_upstream_module) — keeps status code of the response obtained from the upstream server. Status codes of several responses are separated by commas and colons like addresses in the $upstream_addr variable. If a server…"
tags: [nginx, variable, ngx_http_upstream_module]
icon: dollar-sign
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Variable** | `$upstream_status` |
| **Module** | [[11-modules/02-http/ngx_http_upstream_module\|ngx_http_upstream_module]] |

keeps status code of the response obtained from the upstream server. Status codes of several responses are separated by commas and colons like addresses in the [[13-variables/upstream-addr-http-upstream|$upstream_addr]] variable. If a server cannot be selected, the variable keeps the `502 Bad Gateway` status code.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
