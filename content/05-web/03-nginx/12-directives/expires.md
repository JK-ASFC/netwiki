---
title: "expires"
description: "Directive nginx expires (ngx_http_headers_module) — Enables or disables adding or modifying the Expires and Cache-Control response header fields provided that the response code equals 200, 201 (1.3.10), 204, 206, 301, 302, 303, 304, 307 (1.1.16,…"
tags: [nginx, directive, ngx_http_headers_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `expires [modified] time;` ou `expires epoch \| max \| off;` |
| **Valeur par défaut** | `expires off;` |
| **Contexte** | `http`, `server`, `location`, `if dans location` |
| **Module** | [[11-modules/02-http/ngx_http_headers_module\|ngx_http_headers_module]] |

## Utilisation

Enables or disables adding or modifying the `Expires` and `Cache-Control` response header fields provided that the response code equals 200, 201 (1.3.10), 204, 206, 301, 302, 303, 304, 307 (1.1.16, 1.0.13), or 308 (1.13.0). The parameter can be a positive or negative [[10-guides/01-introduction/syntax|time]].

The time in the `Expires` field is computed as a sum of the current time and *time* specified in the directive. If the `modified` parameter is used (0.7.0, 0.6.32) then the time is computed as a sum of the file’s modification time and the *time* specified in the directive.

In addition, it is possible to specify a time of day using the “`@`” prefix (0.7.9, 0.6.34):

```nginx
expires @15h30m;
```

The contents of the `Cache-Control` field depends on the sign of the specified time:

- time is negative — `Cache-Control: no-cache`.
- time is positive or zero — `Cache-Control: max-age=t`, where *t* is a time specified in the directive, in seconds.

The `epoch` parameter sets `Expires` to the value “`Thu, 01 Jan 1970 00:00:01 GMT`”, and `Cache-Control` to “`no-cache`”.

The `max` parameter sets `Expires` to the value “`Thu, 31 Dec 2037 23:55:55 GMT`”, and `Cache-Control` to 10 years.

The `off` parameter disables adding or modifying the `Expires` and `Cache-Control` response header fields.

The last parameter value can contain variables (1.7.9):

```nginx
map $sent_http_content_type $expires {
    default         off;
    application/pdf 42d;
    ~image/         max;
}

expires $expires;
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
