---
title: "listen (ngx_stream_core_module)"
description: "Directive nginx listen (ngx_stream_core_module) — Sets the address and port for the socket on which the server will accept connections. It is possible to specify just the port. The address can also be a hostname, for example: nginx listen…"
tags: [nginx, directive, ngx_stream_core_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `listen address:port [default_server] [ssl] [udp] [proxy_protocol] [setfib=number] [fastopen=number] [backlog=number] [rcvbuf=size] [sndbuf=size] [accept_filter=filter] [deferred] [bind] [ipv6only=on\|off] [reuseport] [multipath] [so_keepalive=on\|off\|[keepidle]:[keepintvl]:[keepcnt]];` |
| **Valeur par défaut** | — |
| **Contexte** | `server` |
| **Module** | [[11-modules/03-stream/ngx_stream_core_module\|ngx_stream_core_module]] |

## Utilisation

Sets the *address* and *port* for the socket on which the server will accept connections. It is possible to specify just the port. The address can also be a hostname, for example:

```nginx
listen 127.0.0.1:12345;
listen *:12345;
listen 12345;     # same as *:12345
listen localhost:12345;
```

IPv6 addresses are specified in square brackets:

```nginx
listen [::1]:12345;
listen [::]:12345;
```

UNIX-domain sockets are specified with the “`unix:`” prefix:

```nginx
listen unix:/var/run/nginx.sock;
```

Port ranges (1.15.10) are specified with the first and last port separated by a hyphen:

```nginx
listen 127.0.0.1:12345-12399;
listen 12345-12399;
```

The `default_server` parameter, if present, will cause the server to become the default server for the specified *address*:*port* pair (1.25.5). If none of the directives have the `default_server` parameter then the first server with the *address*:*port* pair will be the default server for this pair.

The `ssl` parameter allows specifying that all connections accepted on this port should work in SSL mode.

The `udp` parameter configures a listening socket for working with datagrams (1.9.13). In order to handle packets from the same address and port in the same session, the `reuseport` parameter should also be specified.

The `proxy_protocol` parameter (1.11.4) allows specifying that all connections accepted on this port should use the [PROXY protocol](http://www.haproxy.org/download/1.8/doc/proxy-protocol.txt).

> [!NOTE]
> The PROXY protocol version 2 is supported since version 1.13.11.

The `listen` directive can have several additional parameters specific to socket-related system calls. These parameters can be specified in any `listen` directive, but only once for a given *address*:*port* pair.

- **`setfib`=*number***

  this parameter (1.25.5) sets the associated routing table, FIB (the `SO_SETFIB` option) for the listening socket. This currently works only on FreeBSD.

- **`fastopen`=*number***

  enables “[TCP Fast Open](http://en.wikipedia.org/wiki/TCP_Fast_Open)” for the listening socket (1.21.0) and [limits](https://datatracker.ietf.org/doc/html/rfc7413#section-5.1) the maximum length for the queue of connections that have not yet completed the three-way handshake.

  > [!NOTE]
  > Do not enable this feature unless the server can handle receiving the [same SYN packet with data](https://datatracker.ietf.org/doc/html/rfc7413#section-6.1) more than once.

- **`backlog`=*number***

  sets the `backlog` parameter in the `listen` call that limits the maximum length for the queue of pending connections (1.9.2). By default, `backlog` is set to -1 on FreeBSD, DragonFly BSD, and macOS, and to 511 on other platforms.

- **`rcvbuf`=*size***

  sets the receive buffer size (the `SO_RCVBUF` option) for the listening socket (1.11.13).

- **`sndbuf`=*size***

  sets the send buffer size (the `SO_SNDBUF` option) for the listening socket (1.11.13).

- **`accept_filter`=*filter***

  sets the name of accept filter (the `SO_ACCEPTFILTER` option) for the listening socket that filters incoming connections before passing them to `accept` (1.25.5). This works only on FreeBSD and NetBSD 5.0+. Possible values are [dataready](http://man.freebsd.org/accf_data) and [httpready](http://man.freebsd.org/accf_http).

- **`deferred`**

  instructs to use a deferred `accept` (the `TCP_DEFER_ACCEPT` socket option) on Linux (1.25.5).

- **`bind`**

  this parameter instructs to make a separate `bind` call for a given address:port pair. The fact is that if there are several `listen` directives with the same port but different addresses, and one of the `listen` directives listens on all addresses for the given port (`*:`*port*), nginx will `bind` only to `*:`*port*. It should be noted that the `getsockname` system call will be made in this case to determine the address that accepted the connection. If the `setfib`, `fastopen`, `backlog`, `rcvbuf`, `sndbuf`, `accept_filter`, `deferred`, `ipv6only`, `reuseport`, `multipath`, or `so_keepalive` parameters are used then for a given *address*:*port* pair a separate `bind` call will always be made.

- **`ipv6only`=`on`|`off`**

  this parameter determines (via the `IPV6_V6ONLY` socket option) whether an IPv6 socket listening on a wildcard address `[::]` will accept only IPv6 connections or both IPv6 and IPv4 connections. This parameter is turned on by default. It can only be set once on start.

- **`reuseport`**

  this parameter (1.9.1) instructs to create an individual listening socket for each worker process (using the `SO_REUSEPORT` socket option on Linux 3.9+ and DragonFly BSD, or `SO_REUSEPORT_LB` on FreeBSD 12+), allowing a kernel to distribute incoming connections between worker processes. This currently works only on Linux 3.9+, DragonFly BSD, and FreeBSD 12+ (1.15.1).

  > [!NOTE]
  > Inappropriate use of this option may have its security [implications](http://man7.org/linux/man-pages/man7/socket.7.html).

- **`multipath`**

  this parameter (1.29.7) configures the [Multipath TCP](https://datatracker.ietf.org/doc/html/rfc8684) protocol (`IPPROTO_MPTCP`) for the listening socket. This currently works only on Linux 5.6+.

  > [!NOTE]
  > Adding or removing this parameter will also enable the `SO_REUSEPORT` socket option, which may have its security [implications](http://man7.org/linux/man-pages/man7/socket.7.html).

- **`so_keepalive`=`on`|`off`|\[*keepidle*\]:\[*keepintvl*\]:\[*keepcnt*\]**

  this parameter configures the “TCP keepalive” behavior for the listening socket. If this parameter is omitted then the operating system’s settings will be in effect for the socket. If it is set to the value “`on`”, the `SO_KEEPALIVE` option is turned on for the socket. If it is set to the value “`off`”, the `SO_KEEPALIVE` option is turned off for the socket. Some operating systems support setting of TCP keepalive parameters on a per-socket basis using the `TCP_KEEPIDLE`, `TCP_KEEPINTVL`, and `TCP_KEEPCNT` socket options. On such systems (currently, Linux, NetBSD, Dragonfly, FreeBSD, and macOS), they can be configured using the *keepidle*, *keepintvl*, and *keepcnt* parameters. One or two parameters may be omitted, in which case the system default setting for the corresponding socket option will be in effect. For example,

  ```nginx
  so_keepalive=30m::10
  ```

  will set the idle timeout (`TCP_KEEPIDLE`) to 30 minutes, leave the probe interval (`TCP_KEEPINTVL`) at its system default, and set the probes count (`TCP_KEEPCNT`) to 10 probes.

> [!NOTE]
> Before version 1.25.5, different servers must listen on different *address*:*port* pairs.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
