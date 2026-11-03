---
title: "internal"
description: "Directive nginx internal (ngx_http_core_module) — Specifies that a given location can only be used for internal requests. For external requests, the client error 404 Not Found is returned. Internal requests are the following: - requests redirected…"
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `internal;` |
| **Valeur par défaut** | — |
| **Contexte** | `location` |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Specifies that a given location can only be used for internal requests. For external requests, the client error `404 Not Found` is returned. Internal requests are the following:

- requests redirected by the [[12-directives/error-page|error_page]], [[12-directives/index|index]], [[12-directives/internal-redirect|internal_redirect]], [[12-directives/random-index|random_index]], and [[12-directives/try-files|try_files]] directives;
- requests redirected by the `X-Accel-Redirect` response header field from an upstream server;
- subrequests formed by the “`include virtual`” command of the [[11-modules/02-http/ngx_http_ssi_module|ngx_http_ssi_module]] module, by the [[11-modules/02-http/ngx_http_addition_module|ngx_http_addition_module]] module directives, and by [[12-directives/auth-request|auth_request]] and [[12-directives/mirror|mirror]] directives;
- requests changed by the [[12-directives/rewrite|rewrite]] directive.

Example:

```nginx
error_page 404 /404.html;

location = /404.html {
    internal;
}
```

> [!NOTE]
> There is a limit of 10 internal redirects per request to prevent request processing cycles that can occur in incorrect configurations. If this limit is reached, the error `500 Internal Server Error` is returned. In such cases, the “rewrite or internal redirection cycle” message can be seen in the error log.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
