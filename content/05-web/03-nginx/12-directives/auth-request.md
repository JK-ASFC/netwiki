---
title: "auth_request"
description: "Directive nginx auth_request (ngx_http_auth_request_module) — Enables authorization based on the result of a subrequest and sets the URI to which the subrequest will be sent."
tags: [nginx, directive, ngx_http_auth_request_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `auth_request uri \| off;` |
| **Valeur par défaut** | `auth_request off;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_auth_request_module\|ngx_http_auth_request_module]] |

## Utilisation

Enables authorization based on the result of a subrequest and sets the URI to which the subrequest will be sent.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
