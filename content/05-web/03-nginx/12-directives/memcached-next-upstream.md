---
title: "memcached_next_upstream"
description: "Directive nginx memcached_next_upstream (ngx_http_memcached_module) — Specifies in which cases a request should be passed to the next server: - error an error occurred while establishing a connection with the server, passing a request to it, or reading the response…"
tags: [nginx, directive, ngx_http_memcached_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `memcached_next_upstream error \| timeout \| denied \| invalid_response \| not_found \| off ...;` |
| **Valeur par défaut** | `memcached_next_upstream error timeout;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_memcached_module\|ngx_http_memcached_module]] |

## Utilisation

Specifies in which cases a request should be passed to the next server:

- **`error`**

  an error occurred while establishing a connection with the server, passing a request to it, or reading the response header;

- **`timeout`**

  a timeout has occurred while establishing a connection with the server, passing a request to it, or reading the response header;

- **`denied`**

  the server [[12-directives/memcached-allow-upstream|denied]] the connection (1.29.3);

  > [!NOTE]
  > This parameter is available as part of our [abonnement commercial](https://nginx.com/products/).

- **`invalid_response`**

  a server returned an empty or invalid response;

- **`not_found`**

  a response was not found on the server;

- **`off`**

  disables passing a request to the next server.

One should bear in mind that passing a request to the next server is only possible if nothing has been sent to a client yet. That is, if an error or timeout occurs in the middle of the transferring of a response, fixing this is impossible.

The directive also defines what is considered an [[11-modules/02-http/ngx_http_upstream_module|unsuccessful attempt]] of communication with a server. The cases of `error`, `timeout`, `denied` and `invalid_response` are always considered unsuccessful attempts, even if they are not specified in the directive. The case of `not_found` is never considered an unsuccessful attempt.

Passing a request to the next server can be limited by [[12-directives/memcached-next-upstream-tries|the number of tries]] and by [[12-directives/memcached-next-upstream-timeout|time]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
