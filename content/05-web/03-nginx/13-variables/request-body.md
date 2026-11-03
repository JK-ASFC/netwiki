---
title: "$request_body"
description: "Variable nginx $request_body (ngx_http_core_module) — request body The variable’s value is made available in locations processed by the proxy_pass, fastcgi_pass, uwsgi_pass, and scgi_pass directives when the request body was read to a memory buffer."
tags: [nginx, variable, ngx_http_core_module]
icon: dollar-sign
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Variable** | `$request_body` |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

request body

The variable’s value is made available in locations processed by the [[12-directives/proxy-pass-http-proxy|proxy_pass]], [[12-directives/fastcgi-pass|fastcgi_pass]], [[12-directives/uwsgi-pass|uwsgi_pass]], and [[12-directives/scgi-pass|scgi_pass]] directives when the request body was read to a [[12-directives/client-body-buffer-size|memory buffer]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
