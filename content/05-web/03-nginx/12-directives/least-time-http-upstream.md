---
title: "least_time (ngx_http_upstream_module)"
description: "Directive nginx least_time (ngx_http_upstream_module) — Specifies that a group should use a load balancing method where a request is passed to the server with the least average response time and least number of active connections, taking into account…"
tags: [nginx, directive, ngx_http_upstream_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `least_time header \| last_byte [inflight];` |
| **Valeur par défaut** | — |
| **Contexte** | `upstream` |
| **Apparue dans la version** | 1.7.10 |
| **Module** | [[11-modules/02-http/ngx_http_upstream_module\|ngx_http_upstream_module]] |

## Utilisation

Specifies that a group should use a load balancing method where a request is passed to the server with the least average response time and least number of active connections, taking into account weights of servers. If there are several such servers, they are tried in turn using a weighted round-robin balancing method.

If the `header` parameter is specified, time to receive the [[13-variables/upstream-header-time|response header]] is used. If the `last_byte` parameter is specified, time to receive the [[13-variables/upstream-response-time|full response]] is used. If the `inflight` parameter is specified (1.11.6), incomplete requests are also taken into account.

> [!NOTE]
> Prior to version 1.11.6, incomplete requests were taken into account by default.

> [!NOTE]
> Prior to version 1.31.0, this directive was available only as part of our [abonnement commercial](https://nginx.com/products/).

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
