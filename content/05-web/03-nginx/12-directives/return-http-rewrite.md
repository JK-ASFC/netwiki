---
title: "return (ngx_http_rewrite_module)"
description: "Directive nginx return (ngx_http_rewrite_module) — Stops processing and returns the specified code to a client. The non-standard code 444 closes a connection without sending a response header. Starting from version 0.8.42, it is possible to specify…"
tags: [nginx, directive, ngx_http_rewrite_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `return code [text];` ou `return code URL;` ou `return URL;` |
| **Valeur par défaut** | — |
| **Contexte** | `server`, `location`, `if` |
| **Module** | [[11-modules/02-http/ngx_http_rewrite_module\|ngx_http_rewrite_module]] |

## Utilisation

Stops processing and returns the specified *code* to a client. The non-standard code 444 closes a connection without sending a response header.

Starting from version 0.8.42, it is possible to specify either a redirect URL (for codes 301, 302, 303, 307, and 308) or the response body *text* (for other codes). A response body text and redirect URL can contain variables. As a special case, a redirect URL can be specified as a URI local to this server, in which case the full redirect URL is formed according to the request scheme (`$scheme`) and the [[12-directives/server-name-in-redirect|server_name_in_redirect]] and [[12-directives/port-in-redirect|port_in_redirect]] directives.

In addition, a *URL* for temporary redirect with the code 302 can be specified as the sole parameter. Such a parameter should start with the “`http://`”, “`https://`”, or “`$scheme`” string. A *URL* can contain variables.

> [!NOTE]
> Only the following codes could be returned before version 0.7.51: 204, 400, 402 — 406, 408, 410, 411, 413, 416, and 500 — 504.

> [!NOTE]
> The code 307 was not treated as a redirect until versions 1.1.16 and 1.0.13.

> [!NOTE]
> The code 308 was not treated as a redirect until version 1.13.0.

See also the [[12-directives/error-page|error_page]] directive.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
