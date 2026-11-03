---
title: "uwsgi_pass_request_body"
description: "Directive nginx uwsgi_pass_request_body (ngx_http_uwsgi_module) — Indicates whether the original request body is passed to the uwsgi server. See also the uwsgi_pass_request_headers directive."
tags: [nginx, directive, ngx_http_uwsgi_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `uwsgi_pass_request_body on \| off;` |
| **Valeur par défaut** | `uwsgi_pass_request_body on;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_uwsgi_module\|ngx_http_uwsgi_module]] |

## Utilisation

Indicates whether the original request body is passed to the uwsgi server. See also the [[12-directives/uwsgi-pass-request-headers|uwsgi_pass_request_headers]] directive.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
