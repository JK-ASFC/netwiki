---
title: "scgi_pass_request_headers"
description: "Directive nginx scgi_pass_request_headers (ngx_http_scgi_module) — Indicates whether the header fields of the original request are passed to the SCGI server. See also the scgi_pass_request_body directive."
tags: [nginx, directive, ngx_http_scgi_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `scgi_pass_request_headers on \| off;` |
| **Valeur par défaut** | `scgi_pass_request_headers on;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_scgi_module\|ngx_http_scgi_module]] |

## Utilisation

Indicates whether the header fields of the original request are passed to the SCGI server. See also the [[12-directives/scgi-pass-request-body|scgi_pass_request_body]] directive.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
