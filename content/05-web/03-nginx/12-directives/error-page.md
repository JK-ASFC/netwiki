---
title: "error_page"
description: "Directive nginx error_page (ngx_http_core_module) — Defines the URI that will be shown for the specified errors. A uri value can contain variables. Example: nginx error_page 404 /404.html; error_page 500 502 503 504 /50x.html; This causes an internal…"
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `error_page code ... [=[response]] uri;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server`, `location`, `if dans location` |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Defines the URI that will be shown for the specified errors. A *uri* value can contain variables.

Example:

```nginx
error_page 404             /404.html;
error_page 500 502 503 504 /50x.html;
```

This causes an internal redirect to the specified *uri* with the client request method changed to “`GET`” (for all methods other than “`GET`” and “`HEAD`”).

Furthermore, it is possible to change the response code to another using the “`=`*response*” syntax, for example:

```nginx
error_page 404 =200 /empty.gif;
```

If an error response is processed by a proxied server or a FastCGI/uwsgi/SCGI/gRPC server, and the server may return different response codes (e.g., 200, 302, 401 or 404), it is possible to respond with the code it returns:

```nginx
error_page 404 = /404.php;
```

If there is no need to change URI and method during internal redirection it is possible to pass error processing into a named location:

```nginx
location / {
    error_page 404 = @fallback;
}

location @fallback {
    proxy_pass http://backend;
}
```

> [!NOTE]
> If *uri* processing leads to an error, the status code of the last occurred error is returned to the client.

It is also possible to use URL redirects for error processing:

```nginx
error_page 403      http://example.com/forbidden.html;
error_page 404 =301 http://example.com/notfound.html;
```

In this case, by default, the response code 302 is returned to the client. It can only be changed to one of the redirect status codes (301, 302, 303, 307, and 308).

> [!NOTE]
> The code 307 was not treated as a redirect until versions 1.1.16 and 1.0.13.

> [!NOTE]
> The code 308 was not treated as a redirect until version 1.13.0.

These directives are inherited from the previous configuration level if and only if there are no `error_page` directives defined on the current level.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
