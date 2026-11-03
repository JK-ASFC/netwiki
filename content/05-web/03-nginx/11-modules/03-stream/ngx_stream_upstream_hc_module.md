---
title: "ngx_stream_upstream_hc_module"
description: "Module nginx ngx_stream_upstream_hc_module — The ngx_stream_upstream_hc_module module (1.9.0) allows enabling periodic health checks of the servers in a group. The server group must reside in the shared memory."
tags: [nginx, module, ngx_stream_upstream_hc_module]
icon: puzzle
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

The `ngx_stream_upstream_hc_module` module (1.9.0) allows enabling periodic health checks of the servers in a [[12-directives/upstream-stream-upstream|group]]. The server group must reside in the [[12-directives/zone-stream-upstream|shared memory]].

If a health check fails, the server will be considered unhealthy. If several health checks are defined for the same group of servers, a single failure of any check will make the corresponding server be considered unhealthy. Client connections are not passed to unhealthy servers and servers in the “checking” state.

> [!NOTE]
> This module is available as part of our [abonnement commercial](https://nginx.com/products/).

## Example Configuration

```nginx
upstream tcp {
    zone upstream_tcp 64k;

    server backend1.example.com:12345 weight=5;
    server backend2.example.com:12345 fail_timeout=5s slow_start=30s;
    server 192.0.2.1:12345            max_fails=3;

    server backup1.example.com:12345  backup;
    server backup2.example.com:12345  backup;
}

server {
    listen     12346;
    proxy_pass tcp;
    health_check;
}
```

With this configuration, nginx will check the ability to establish a TCP connection to each server in the `tcp` group every five seconds. When a connection to the server cannot be established, the health check will fail, and the server will be considered unhealthy.

Health checks can be configured for the UDP protocol:

```nginx
upstream dns_upstream {

    zone   dns_zone 64k;

    server dns1.example.com:53;
    server dns2.example.com:53;
    server dns3.example.com:53;
}

server {
    listen       53 udp;
    proxy_pass   dns_upstream;
    health_check udp;
}
```

In this case, the absence of ICMP “`Destination Unreachable`” message is expected in reply to the sent string “`nginx health check`”.

Health checks can also be configured to test data obtained from the server. Tests are configured separately using the [[12-directives/match-stream-upstream-hc|match]] directive and referenced in the `match` parameter of the [[12-directives/health-check-stream-upstream-hc|health_check]] directive.

## Directives

- [[12-directives/health-check-stream-upstream-hc|health_check]]
- [[12-directives/health-check-timeout|health_check_timeout]]
- [[12-directives/match-stream-upstream-hc|match]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
