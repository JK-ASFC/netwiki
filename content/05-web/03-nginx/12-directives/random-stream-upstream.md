---
title: "random (ngx_stream_upstream_module)"
description: "Directive nginx random (ngx_stream_upstream_module) — Specifies that a group should use a load balancing method where a connection is passed to a randomly selected server, taking into account weights of servers. The optional two parameter instructs…"
tags: [nginx, directive, ngx_stream_upstream_module]
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
| **Module** | [[11-modules/03-stream/ngx_stream_upstream_module\|ngx_stream_upstream_module]] |

## Utilisation

Specifies that a group should use a load balancing method where a connection is passed to a randomly selected server, taking into account weights of servers.

The optional `two` parameter instructs nginx to randomly select [two](https://homes.cs.washington.edu/~karlin/papers/balls.pdf) servers and then choose a server using the specified `method`. The default method is `least_conn` which passes a connection to a server with the least number of active connections.

The `least_time` method passes a connection to a server with the least average time and least number of active connections. If `least_time=connect` parameter is specified, time to [[13-variables/upstream-connect-time-stream-upstream|connect]] to the upstream server is used. If `least_time=first_byte` parameter is specified, time to receive the [[13-variables/upstream-first-byte-time|first byte]] of data is used. If `least_time=last_byte` is specified, time to receive the [[13-variables/upstream-session-time|last byte]] of data is used.

> [!NOTE]
> La méthode `least_time` est disponible dans le cadre de notre [abonnement commercial](https://nginx.com/products/).

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
