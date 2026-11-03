---
title: "sendfile"
description: "Directive nginx sendfile (ngx_http_core_module) — Enables or disables the use of sendfile. Starting from nginx 0.8.12 and FreeBSD 5.2.1, aio can be used to pre-load data for sendfile: nginx location /video/ { sendfile on; tcp_nopush on; aio on; } In…"
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `sendfile on \| off;` |
| **Valeur par défaut** | `sendfile off;` |
| **Contexte** | `http`, `server`, `location`, `if dans location` |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Enables or disables the use of `sendfile`.

Starting from nginx 0.8.12 and FreeBSD 5.2.1, [[12-directives/aio|aio]] can be used to pre-load data for `sendfile`:

```nginx
location /video/ {
    sendfile       on;
    tcp_nopush     on;
    aio            on;
}
```

In this configuration, `sendfile` is called with the `SF_NODISKIO` flag which causes it not to block on disk I/O, but, instead, report back that the data are not in memory. nginx then initiates an asynchronous data load by reading one byte. On the first read, the FreeBSD kernel loads the first 128K bytes of a file into memory, although next reads will only load data in 16K chunks. This can be changed using the [[12-directives/read-ahead|read_ahead]] directive.

> [!NOTE]
> Before version 1.7.11, pre-loading could be enabled with `aio sendfile;`.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
