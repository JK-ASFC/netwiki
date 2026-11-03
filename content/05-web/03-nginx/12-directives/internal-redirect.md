---
title: "internal_redirect"
description: "Directive nginx internal_redirect (ngx_http_internal_redirect_module) — Sets the URI for internal redirection of the request. It is also possible to use a named location instead of the URI. The uri value can contain variables. If the uri value is empty, then the redirect…"
tags: [nginx, directive, ngx_http_internal_redirect_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `internal_redirect uri;` |
| **Valeur par défaut** | — |
| **Contexte** | `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_internal_redirect_module\|ngx_http_internal_redirect_module]] |

## Utilisation

Sets the URI for internal redirection of the request. It is also possible to use a [[11-modules/02-http/ngx_http_core_module|named location]] instead of the URI. The *uri* value can contain variables. If the *uri* value is empty, then the redirect will not be made.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
