---
title: "listen (ngx_mail_core_module)"
description: "Directive nginx listen (ngx_mail_core_module) — Sets the address and port for the socket on which the server will accept requests. It is possible to specify just the port. The address can also be a hostname, for example: nginx listen…"
tags: [nginx, directive, ngx_mail_core_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `listen address:port [ssl] [proxy_protocol] [backlog=number] [rcvbuf=size] [sndbuf=size] [bind] [ipv6only=on\|off] [multipath] [so_keepalive=on\|off\|[keepidle]:[keepintvl]:[keepcnt]];` |
| **Valeur par défaut** | — |
| **Contexte** | `server` |
| **Module** | [[11-modules/04-mail/ngx_mail_core_module\|ngx_mail_core_module]] |

## Utilisation

Sets the *address* and *port* for the socket on which the server will accept requests. It is possible to specify just the port. The address can also be a hostname, for example:

```nginx
listen 127.0.0.1:110;
listen *:110;
listen 110;     # same as *:110
listen localhost:110;
```

IPv6 addresses (0.7.58) are specified in square brackets:

```nginx
listen [::1]:110;
listen [::]:110;
```

UNIX-domain sockets (1.3.5) are specified with the “`unix:`” prefix:

```nginx
listen unix:/var/run/nginx.sock;
```

Different servers must listen on different *address*:*port* pairs.

The `ssl` parameter allows specifying that all connections accepted on this port should work in SSL mode.

The `proxy_protocol` parameter (1.19.8) allows specifying that all connections accepted on this port should use the [PROXY protocol](http://www.haproxy.org/download/1.8/doc/proxy-protocol.txt). Obtained information is passed to the [[11-modules/04-mail/ngx_mail_auth_http_module|authentication server]] and can be used to [[11-modules/04-mail/ngx_mail_realip_module|change the client address]].

The `listen` directive can have several additional parameters specific to socket-related system calls.

- **`backlog`=*number***

  sets the `backlog` parameter in the `listen` call that limits the maximum length for the queue of pending connections (1.9.2). By default, `backlog` is set to -1 on FreeBSD, DragonFly BSD, and macOS, and to 511 on other platforms.

- **`rcvbuf`=*size***

  sets the receive buffer size (the `SO_RCVBUF` option) for the listening socket (1.11.13).

- **`sndbuf`=*size***

  sets the send buffer size (the `SO_SNDBUF` option) for the listening socket (1.11.13).

- **`bind`**

  this parameter instructs to make a separate `bind` call for a given address:port pair. The fact is that if there are several `listen` directives with the same port but different addresses, and one of the `listen` directives listens on all addresses for the given port (`*:`*port*), nginx will `bind` only to `*:`*port*. It should be noted that the `getsockname` system call will be made in this case to determine the address that accepted the connection. If the `backlog`, `rcvbuf`, `sndbuf`, `ipv6only`, `multipath`, or `so_keepalive` parameters are used then for a given *address*:*port* pair a separate `bind` call will always be made.

- **`ipv6only`=`on`|`off`**

  this parameter determines (via the `IPV6_V6ONLY` socket option) whether an IPv6 socket listening on a wildcard address `[::]` will accept only IPv6 connections or both IPv6 and IPv4 connections. This parameter is turned on by default. It can only be set once on start.

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

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
