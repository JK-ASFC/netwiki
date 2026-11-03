---
title: "health_check (ngx_stream_upstream_hc_module)"
description: "Directive nginx health_check (ngx_stream_upstream_hc_module) — Enables periodic health checks of the servers in a group. The following optional parameters are supported: - interval=time sets the interval between two consecutive health checks, by default, 5…"
tags: [nginx, directive, ngx_stream_upstream_hc_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `health_check [parameters];` |
| **Valeur par défaut** | — |
| **Contexte** | `server` |
| **Module** | [[11-modules/03-stream/ngx_stream_upstream_hc_module\|ngx_stream_upstream_hc_module]] |

## Utilisation

Enables periodic health checks of the servers in a [[12-directives/upstream-stream-upstream|group]].

The following optional parameters are supported:

- **`interval`=*time***

  sets the interval between two consecutive health checks, by default, 5 seconds.

- **`jitter`=*time***

  sets the time within which each health check will be randomly delayed, by default, there is no delay.

- **`fails`=*number***

  sets the number of consecutive failed health checks of a particular server after which this server will be considered unhealthy, by default, 1.

- **`passes`=*number***

  sets the number of consecutive passed health checks of a particular server after which the server will be considered healthy, by default, 1.

- **`mandatory` \[`persistent`\]**

  sets the initial “checking” state for a server until the first health check is completed (1.11.7). Client connections are not passed to servers in the “checking” state. If the parameter is not specified, the server will be initially considered healthy.

  The `persistent` parameter (1.21.1) sets the initial “up” state for a server after reload if the server was considered healthy before reload.

- **`match`=*name***

  specifies the `match` block configuring the tests that a successful connection should pass in order for a health check to pass. By default, for TCP, only the ability to establish a TCP connection with the server is checked. For UDP, the absence of ICMP “`Destination Unreachable`” message is expected in reply to the sent string “`nginx health check`”.

  > [!NOTE]
  > Prior to version 1.11.7, by default, UDP health check required a match block with the send and expect parameters.

- **`port`=*number***

  defines the port used when connecting to a server to perform a health check (1.9.7). By default, equals the [[12-directives/server-stream-upstream|server]] port.

- **`udp`**

  specifies that the `UDP` protocol should be used for health checks instead of the default `TCP` protocol (1.9.13).

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
