---
title: "$upstream_http_name"
description: "Variable nginx $upstream_http_name (ngx_http_upstream_module) — keep server response header fields. For example, the Server response header field is available through the $upstream_http_server variable. The rules of converting header field names to variable names…"
tags: [nginx, variable, ngx_http_upstream_module]
icon: dollar-sign
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Variable** | `$upstream_http_name` |
| **Module** | [[11-modules/02-http/ngx_http_upstream_module\|ngx_http_upstream_module]] |

keep server response header fields. For example, the `Server` response header field is available through the `$upstream_http_server` variable. The rules of converting header field names to variable names are the same as for the variables that start with the “[[11-modules/02-http/ngx_http_core_module|$http_]]” prefix. Only the header fields from the response of the last server are saved.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
