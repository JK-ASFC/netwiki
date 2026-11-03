---
title: "uwsgi_pass_request_headers"
description: "Directive nginx uwsgi_pass_request_headers (ngx_http_uwsgi_module) — Indicates whether the header fields of the original request are passed to the uwsgi server. See also the uwsgi_pass_request_body directive."
tags: [nginx, directive, ngx_http_uwsgi_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `uwsgi_pass_request_headers on \| off;` |
| **Valeur par défaut** | `uwsgi_pass_request_headers on;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_uwsgi_module\|ngx_http_uwsgi_module]] |

## Utilisation

Indicates whether the header fields of the original request are passed to the uwsgi server. See also the [[12-directives/uwsgi-pass-request-body|uwsgi_pass_request_body]] directive.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
