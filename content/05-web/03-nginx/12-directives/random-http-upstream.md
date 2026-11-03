---
title: "random (ngx_http_upstream_module)"
description: "Directive nginx random (ngx_http_upstream_module) — Specifies that a group should use a load balancing method where a request is passed to a randomly selected server, taking into account weights of servers. The optional two parameter instructs nginx…"
tags: [nginx, directive, ngx_http_upstream_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `random [two [method]];` |
| **Valeur par défaut** | — |
| **Contexte** | `upstream` |
| **Apparue dans la version** | 1.15.1 |
| **Module** | [[11-modules/02-http/ngx_http_upstream_module\|ngx_http_upstream_module]] |

## Utilisation

Specifies that a group should use a load balancing method where a request is passed to a randomly selected server, taking into account weights of servers.

The optional `two` parameter instructs nginx to randomly select [two](https://homes.cs.washington.edu/~karlin/papers/balls.pdf) servers and then choose a server using the specified `method`. The default method is `least_conn` which passes a request to a server with the least number of active connections.

The `least_time` method passes a request to a server with the least average response time and least number of active connections. If `least_time=header` is specified, the time to receive the [[13-variables/upstream-header-time|response header]] is used. If `least_time=last_byte` is specified, the time to receive the [[13-variables/upstream-response-time|full response]] is used.

> [!NOTE]
> The `least_time` method is available as a part of our [abonnement commercial](https://nginx.com/products/).

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
