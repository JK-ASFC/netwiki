---
title: "$request_body"
description: "Variable nginx $request_body (ngx_http_core_module) — corps de la requête La valeur de la variable est disponible dans les blocs location traités par les directives proxy_pass, fastcgi_pass, uwsgi_pass et scgi_pass lorsque le corps de la requête a été…"
tags: [nginx, variable, ngx_http_core_module]
icon: dollar-sign
---

| Propriété | Valeur |
| --- | --- |
| **Variable** | `$request_body` |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

corps de la requête

La valeur de la variable est disponible dans les blocs location traités par les directives [[12-directives/proxy-pass-http-proxy|proxy_pass]], [[12-directives/fastcgi-pass|fastcgi_pass]], [[12-directives/uwsgi-pass|uwsgi_pass]] et [[12-directives/scgi-pass|scgi_pass]] lorsque le corps de la requête a été lu dans un [[12-directives/client-body-buffer-size|tampon mémoire]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
