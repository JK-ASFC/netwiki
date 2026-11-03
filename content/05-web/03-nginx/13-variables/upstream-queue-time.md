---
title: "$upstream_queue_time"
description: "Variable nginx $upstream_queue_time (ngx_http_upstream_module) — keeps time the request spent in the upstream queue (1.13.9); the time is kept in seconds with millisecond resolution. Times of several responses are separated by commas and colons like addresses in…"
tags: [nginx, variable, ngx_http_upstream_module]
icon: dollar-sign
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Variable** | `$upstream_queue_time` |
| **Module** | [[11-modules/02-http/ngx_http_upstream_module\|ngx_http_upstream_module]] |

keeps time the request spent in the upstream [[12-directives/queue|queue]] (1.13.9); the time is kept in seconds with millisecond resolution. Times of several responses are separated by commas and colons like addresses in the [[13-variables/upstream-addr-http-upstream|$upstream_addr]] variable.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
