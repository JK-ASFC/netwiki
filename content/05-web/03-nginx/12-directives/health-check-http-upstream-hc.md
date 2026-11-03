---
title: "health_check (ngx_http_upstream_hc_module)"
description: "Directive nginx health_check (ngx_http_upstream_hc_module) — Enables periodic health checks of the servers in a group referenced in the surrounding location. The following optional parameters are supported: - interval=time sets the interval between two…"
tags: [nginx, directive, ngx_http_upstream_hc_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `health_check [parameters];` |
| **Valeur par défaut** | — |
| **Contexte** | `location` |
| **Module** | [[11-modules/02-http/ngx_http_upstream_hc_module\|ngx_http_upstream_hc_module]] |

## Utilisation

Enables periodic health checks of the servers in a [[12-directives/upstream-http-upstream|group]] referenced in the surrounding location.

The following optional parameters are supported:

- **`interval`=*time***

  sets the interval between two consecutive health checks, by default, 5 seconds.

- **`jitter`=*time***

  sets the time within which each health check will be randomly delayed, by default, there is no delay.

- **`fails`=*number***

  sets the number of consecutive failed health checks of a particular server after which this server will be considered unhealthy, by default, 1.

- **`passes`=*number***

  sets the number of consecutive passed health checks of a particular server after which the server will be considered healthy, by default, 1.

- **`uri`=*uri***

  defines the URI used in health check requests, by default, “`/`”.

- **`mandatory` \[`persistent`\]**

  sets the initial “checking” state for a server until the first health check is completed (1.11.7). Client requests are not passed to servers in the “checking” state. If the parameter is not specified, the server will be initially considered healthy.

  The `persistent` parameter (1.19.7) sets the initial “up” state for a server after reload if the server was considered healthy before reload.

- **`match`=*name***

  specifies the `match` block configuring the tests that a response should pass in order for a health check to pass. By default, the response should have status code 2xx or 3xx.

- **`port`=*number***

  defines the port used when connecting to a server to perform a health check (1.9.7). By default, equals the [[12-directives/server-http-upstream|server]] port.

- **`type`=`grpc` \[`grpc_service`=*name*\] \[`grpc_status`=*code*\]**

  enables periodic [health checks](https://github.com/grpc/grpc/blob/master/doc/health-checking.md#grpc-health-checking-protocol) of a gRPC server or a particular gRPC service specified with the optional `grpc_service` parameter (1.19.5). If the server does not support the gRPC Health Checking Protocol, the optional `grpc_status` parameter can be used to specify non-zero gRPC [status](https://github.com/grpc/grpc/blob/master/doc/statuscodes.md#status-codes-and-their-use-in-grpc) (for example, status code “`12`” / “`UNIMPLEMENTED`”) that will be treated as healthy:

  ```nginx
  health_check mandatory type=grpc grpc_status=12;
  ```

  The `type`=`grpc` parameter must be specified after all other directive parameters, `grpc_service` and `grpc_status` must follow `type`=`grpc`. The parameter is not compatible with `uri` or `match` parameters.

- **`keepalive_time`=*time***

  enables [[12-directives/keepalive|keepalive]] connections for health checks and specifies the time during which requests can be processed through one keepalive connection (1.21.7). By default keepalive connections are disabled.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
