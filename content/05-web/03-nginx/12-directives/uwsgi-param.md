---
title: "uwsgi_param"
description: "Directive nginx uwsgi_param (ngx_http_uwsgi_module) — Sets a parameter that should be passed to the uwsgi server. The value can contain text, variables, and their combination. These directives are inherited from the previous configuration level if and…"
tags: [nginx, directive, ngx_http_uwsgi_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `uwsgi_param parameter value [if_not_empty];` |
| **Valeur par défaut** | `uwsgi_param HTTP_HOST $host$is_request_port$request_port;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_uwsgi_module\|ngx_http_uwsgi_module]] |

## Utilisation

Sets a *parameter* that should be passed to the uwsgi server. The *value* can contain text, variables, and their combination. These directives are inherited from the previous configuration level if and only if there are no `uwsgi_param` directives defined on the current level.

Standard [CGI environment variables](https://datatracker.ietf.org/doc/html/rfc3875#section-4.1) should be provided as uwsgi headers, see the `uwsgi_params` file provided in the distribution:

```nginx
location / {
    include uwsgi_params;
    ...
}
```

If the directive is specified with `if_not_empty` (1.1.11) then such a parameter will be passed to the server only if its value is not empty:

```nginx
uwsgi_param HTTPS $https if_not_empty;
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
