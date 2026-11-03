---
title: "fastcgi_pass_request_body"
description: "Directive nginx fastcgi_pass_request_body (ngx_http_fastcgi_module) — Indicates whether the original request body is passed to the FastCGI server. See also the fastcgi_pass_request_headers directive."
tags: [nginx, directive, ngx_http_fastcgi_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `fastcgi_pass_request_body on \| off;` |
| **Valeur par défaut** | `fastcgi_pass_request_body on;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_fastcgi_module\|ngx_http_fastcgi_module]] |

## Utilisation

Indicates whether the original request body is passed to the FastCGI server. See also the [[12-directives/fastcgi-pass-request-headers|fastcgi_pass_request_headers]] directive.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
