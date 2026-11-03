---
title: "least_time (ngx_stream_upstream_module)"
description: "Directive nginx least_time (ngx_stream_upstream_module) — Specifies that a group should use a load balancing method where a connection is passed to the server with the least average time and least number of active connections, taking into account weights of…"
tags: [nginx, directive, ngx_stream_upstream_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `least_time connect \| first_byte \| last_byte [inflight];` |
| **Valeur par défaut** | — |
| **Contexte** | `upstream` |
| **Apparue dans la version** | 1.7.11 |
| **Module** | [[11-modules/03-stream/ngx_stream_upstream_module\|ngx_stream_upstream_module]] |

## Utilisation

Specifies that a group should use a load balancing method where a connection is passed to the server with the least average time and least number of active connections, taking into account weights of servers. If there are several such servers, they are tried in turn using a weighted round-robin balancing method.

If the `connect` parameter is specified, time to [[13-variables/upstream-connect-time-stream-upstream|connect]] to the upstream server is used. If the `first_byte` parameter is specified, time to receive the [[13-variables/upstream-first-byte-time|first byte]] of data is used. If the `last_byte` is specified, time to receive the [[13-variables/upstream-session-time|last byte]] of data is used. If the `inflight` parameter is specified (1.11.6), incomplete connections are also taken into account.

> [!NOTE]
> Prior to version 1.11.6, incomplete connections were taken into account by default.

> [!NOTE]
> Avant la version 1.31.0, cette directive n'était disponible que dans le cadre de notre [abonnement commercial](https://nginx.com/products/).

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
