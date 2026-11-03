---
title: "server (ngx_stream_upstream_module)"
description: "Directive nginx server (ngx_stream_upstream_module) — Defines the address and other parameters of a server. The address can be specified as a domain name or IP address with an obligatory port, or as a UNIX-domain socket path specified after the “unix:”…"
tags: [nginx, directive, ngx_stream_upstream_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `server address [parameters];` |
| **Valeur par défaut** | — |
| **Contexte** | `upstream` |
| **Module** | [[11-modules/03-stream/ngx_stream_upstream_module\|ngx_stream_upstream_module]] |

## Utilisation

Defines the *address* and other *parameters* of a server. The address can be specified as a domain name or IP address with an obligatory port, or as a UNIX-domain socket path specified after the “`unix:`” prefix. A domain name that resolves to several IP addresses defines multiple servers at once.

The following parameters can be defined:

- **`weight`=*number***

  sets the weight of the server, by default, 1.

- **`max_conns`=*number***

  limits the maximum *number* of simultaneous connections to the proxied server (1.11.5). Default value is zero, meaning there is no limit. If the server group does not reside in the [[12-directives/zone-stream-upstream|shared memory]], the limitation works per each worker process.

  > [!NOTE]
  > Prior to version 1.11.5, this parameter was available as part of our [abonnement commercial](https://nginx.com/products/).

- **`max_fails`=*number***

  sets the number of unsuccessful attempts to communicate with the server that should happen in the duration set by the `fail_timeout` parameter to consider the server unavailable for a duration also set by the `fail_timeout` parameter. By default, the number of unsuccessful attempts is set to 1. The zero value disables the accounting of attempts. Here, an unsuccessful attempt is an error or timeout while establishing a connection with the server.

- **`fail_timeout`=*time***

  sets

  - the time during which the specified number of unsuccessful attempts to communicate with the server should happen to consider the server unavailable;
  - and the period of time the server will be considered unavailable.

  By default, the parameter is set to 10 seconds.

- **`backup`**

  marks the server as a backup server. Connections to the backup server will be passed when the primary servers are unavailable.

  > [!NOTE]
  > The parameter cannot be used along with the [[12-directives/hash-stream-upstream|hash]] and [[12-directives/random-stream-upstream|random]] load balancing methods.

- **`down`**

  marks the server as permanently unavailable.

- **`resolve`**

  monitors changes of the IP addresses that correspond to a domain name of the server, and automatically modifies the upstream configuration without the need of restarting nginx. The server group must reside in the [[12-directives/zone-stream-upstream|shared memory]].

  In order for this parameter to work, the `resolver` directive must be specified in the [[12-directives/resolver-stream-core|stream]] block or in the corresponding [[12-directives/resolver-stream-upstream|upstream]] block.

  > [!NOTE]
  > Prior to version 1.27.3, this parameter was available only as part of our [abonnement commercial](https://nginx.com/products/).

- **`service`=*name***

  enables resolving of DNS [SRV](https://datatracker.ietf.org/doc/html/rfc2782) records and sets the service *name* (1.9.13). In order for this parameter to work, it is necessary to specify the `resolve` parameter for the server and specify a hostname without a port number.

  If the service name does not contain a dot (“`.`”), then the [RFC](https://datatracker.ietf.org/doc/html/rfc2782)-compliant name is constructed and the TCP protocol is added to the service prefix. For example, to look up the `_http._tcp.backend.example.com` SRV record, it is necessary to specify the directive:

  ```nginx
  server backend.example.com service=http resolve;
  ```

  If the service name contains one or more dots, then the name is constructed by joining the service prefix and the server name. For example, to look up the `_http._tcp.backend.example.com` and `server1.backend.example.com` SRV records, it is necessary to specify the directives:

  ```nginx
  server backend.example.com service=_http._tcp resolve;
  server example.com service=server1.backend resolve;
  ```

  Highest-priority SRV records (records with the same lowest-number priority value) are resolved as primary servers, the rest of SRV records are resolved as backup servers. If the `backup` parameter is specified for the server, high-priority SRV records are resolved as backup servers, the rest of SRV records are ignored.

  > [!NOTE]
  > Prior to version 1.27.3, this parameter was available only as part of our [abonnement commercial](https://nginx.com/products/).

Additionally, the following parameters are available as part of our [abonnement commercial](https://nginx.com/products/):

- **`slow_start`=*time***

  sets the *time* during which the server will recover its weight from zero to a nominal value, when unhealthy server becomes [[12-directives/health-check-stream-upstream-hc|healthy]], or when the server becomes available after a period of time it was considered unavailable. Default value is zero, i.e. slow start is disabled.

  > [!NOTE]
  > The parameter cannot be used along with the [[12-directives/hash-stream-upstream|hash]] and [[12-directives/random-stream-upstream|random]] load balancing methods.

> [!NOTE]
> If there is only a single server in a group, `max_fails`, `fail_timeout` and `slow_start` parameters are ignored, and such a server will never be considered unavailable.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
