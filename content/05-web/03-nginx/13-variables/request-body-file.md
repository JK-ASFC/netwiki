---
title: "$request_body_file"
description: "Variable nginx $request_body_file (ngx_http_core_module) — name of a temporary file with the request body At the end of processing, the file needs to be removed. To always write the request body to a file, client_body_in_file_only needs to be enabled. When…"
tags: [nginx, variable, ngx_http_core_module]
icon: dollar-sign
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Variable** | `$request_body_file` |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

name of a temporary file with the request body

At the end of processing, the file needs to be removed. To always write the request body to a file, [[12-directives/client-body-in-file-only|client_body_in_file_only]] needs to be enabled. When the name of a temporary file is passed in a proxied request or in a request to a FastCGI/uwsgi/SCGI server, passing the request body should be disabled by the [[12-directives/proxy-pass-request-body|proxy_pass_request_body off]], [[12-directives/fastcgi-pass-request-body|fastcgi_pass_request_body off]], [[12-directives/uwsgi-pass-request-body|uwsgi_pass_request_body off]], or [[12-directives/scgi-pass-request-body|scgi_pass_request_body off]] directives, respectively.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
