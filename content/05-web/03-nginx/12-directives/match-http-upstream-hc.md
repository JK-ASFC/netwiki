---
title: "match (ngx_http_upstream_hc_module)"
description: "Directive nginx match (ngx_http_upstream_hc_module) — Defines the named test set used to verify responses to health check requests. The following items can be tested in a response: - status 200; status is 200 - status 500; status is not 500 - status 200…"
tags: [nginx, directive, ngx_http_upstream_hc_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `match name { ... }` |
| **Valeur par défaut** | — |
| **Contexte** | `http` |
| **Module** | [[11-modules/02-http/ngx_http_upstream_hc_module\|ngx_http_upstream_hc_module]] |

## Utilisation

Defines the named test set used to verify responses to health check requests.

The following items can be tested in a response:

- **`status 200;`**

  status is 200

- **`status ! 500;`**

  status is not 500

- **`status 200 204;`**

  status is 200 or 204

- **`status ! 301 302;`**

  status is neither 301 nor 302

- **`status 200-399;`**

  status is in the range from 200 to 399

- **`status ! 400-599;`**

  status is not in the range from 400 to 599

- **`status 301-303 307;`**

  status is either 301, 302, 303, or 307

- **`header Content-Type = text/html;`**

  header contains `Content-Type` with value `text/html`

- **`header Content-Type != text/html;`**

  header contains `Content-Type` with value other than `text/html`

- **`header Connection ~ close;`**

  header contains `Connection` with value matching regular expression `close`

- **`header Connection !~ close;`**

  header contains `Connection` with value not matching regular expression `close`

- **`header Host;`**

  header contains `Host`

- **`header ! X-Accel-Redirect;`**

  header lacks `X-Accel-Redirect`

- **`body ~ "Welcome to nginx!";`**

  body matches regular expression “`Welcome to nginx!`”

- **`body !~ "Welcome to nginx!";`**

  body does not match regular expression “`Welcome to nginx!`”

- **`require` *$variable* `...;`**

  all specified variables are not empty and not equal to “0” (1.15.9).

If several tests are specified, the response matches only if it matches all tests.

> [!NOTE]
> Only the first 256k of the response body are examined.

Exemples :

```nginx
# status is 200, content type is "text/html",
# and body contains "Welcome to nginx!"
match welcome {
    status 200;
    header Content-Type = text/html;
    body ~ "Welcome to nginx!";
}
```

```nginx
# status is not one of 301, 302, 303, or 307, and header does not have "Refresh:"
match not_redirect {
    status ! 301-303 307;
    header ! Refresh;
}
```

```nginx
# status ok and not in maintenance mode
match server_ok {
    status 200-399;
    body !~ "maintenance mode";
}
```

```nginx
# status is 200 or 204
map $upstream_status $good_status {
    200 1;
    204 1;
}

match server_ok {
    require $good_status;
}
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
