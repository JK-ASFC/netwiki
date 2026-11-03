---
title: "fastcgi_next_upstream"
description: "Directive nginx fastcgi_next_upstream (ngx_http_fastcgi_module) — Specifies in which cases a request should be passed to the next server: - error an error occurred while establishing a connection with the server, passing a request to it, or reading the response…"
tags: [nginx, directive, ngx_http_fastcgi_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `fastcgi_next_upstream error \| timeout \| denied \| invalid_header \| http_500 \| http_503 \| http_403 \| http_404 \| http_429 \| non_idempotent \| off ...;` |
| **Valeur par défaut** | `fastcgi_next_upstream error timeout;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_fastcgi_module\|ngx_http_fastcgi_module]] |

## Utilisation

Specifies in which cases a request should be passed to the next server:

- **`error`**

  an error occurred while establishing a connection with the server, passing a request to it, or reading the response header;

- **`timeout`**

  a timeout has occurred while establishing a connection with the server, passing a request to it, or reading the response header;

- **`denied`**

  the server [[12-directives/fastcgi-allow-upstream|denied]] the connection (1.29.3);

  > [!NOTE]
  > Ce paramètre est disponible dans le cadre de notre [abonnement commercial](https://nginx.com/products/).

- **`invalid_header`**

  a server returned an empty or invalid response;

- **`http_500`**

  a server returned a response with the code 500;

- **`http_503`**

  a server returned a response with the code 503;

- **`http_403`**

  a server returned a response with the code 403;

- **`http_404`**

  a server returned a response with the code 404;

- **`http_429`**

  a server returned a response with the code 429 (1.11.13);

- **`non_idempotent`**

  normally, requests with a [non-idempotent](https://datatracker.ietf.org/doc/html/rfc7231#section-4.2.2) method (`POST`, `LOCK`, `PATCH`) are not passed to the next server if a request has been sent to an upstream server (1.9.13); enabling this option explicitly allows retrying such requests;

- **`off`**

  disables passing a request to the next server.

One should bear in mind that passing a request to the next server is only possible if nothing has been sent to a client yet. That is, if an error or timeout occurs in the middle of the transferring of a response, fixing this is impossible.

The directive also defines what is considered an [[11-modules/02-http/ngx_http_upstream_module|unsuccessful attempt]] of communication with a server. The cases of `error`, `timeout`, `denied` and `invalid_header` are always considered unsuccessful attempts, even if they are not specified in the directive. The cases of `http_500`, `http_503`, and `http_429` are considered unsuccessful attempts only if they are specified in the directive. The cases of `http_403` and `http_404` are never considered unsuccessful attempts.

Passing a request to the next server can be limited by [[12-directives/fastcgi-next-upstream-tries|the number of tries]] and by [[12-directives/fastcgi-next-upstream-timeout|time]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
