---
title: "ngx_http_upstream_hc_module"
description: "Module nginx ngx_http_upstream_hc_module — The ngx_http_upstream_hc_module module allows enabling periodic health checks of the servers in a group referenced in the surrounding location. The server group must reside in the shared memory."
tags: [nginx, module, ngx_http_upstream_hc_module]
icon: puzzle
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

The `ngx_http_upstream_hc_module` module allows enabling periodic health checks of the servers in a [[12-directives/upstream-http-upstream|group]] referenced in the surrounding location. The server group must reside in the [[12-directives/zone-http-upstream|shared memory]].

If a health check fails, the server will be considered unhealthy. If several health checks are defined for the same group of servers, a single failure of any check will make the corresponding server be considered unhealthy. Client requests are not passed to unhealthy servers and servers in the “checking” state.

> [!NOTE]
> Please note that most of the variables will have empty values when used with health checks.

> [!NOTE]
> This module is available as part of our [abonnement commercial](https://nginx.com/products/).

## Exemple de configuration

```nginx
upstream dynamic {
    zone upstream_dynamic 64k;

    server backend1.example.com      weight=5;
    server backend2.example.com:8080 fail_timeout=5s slow_start=30s;
    server 192.0.2.1                 max_fails=3;

    server backup1.example.com:8080  backup;
    server backup2.example.com:8080  backup;
}

server {
    location / {
        proxy_pass http://dynamic;
        health_check;
    }
}
```

With this configuration, nginx will send “`/`” requests to each server in the `backend` group every five seconds. If any communication error or timeout occurs, or a proxied server responds with the status code other than 2xx or 3xx, the health check will fail, and the server will be considered unhealthy.

Health checks can be configured to test the status code of a response, presence of certain header fields and their values, and the body contents. Tests are configured separately using the [[12-directives/match-http-upstream-hc|match]] directive and referenced in the `match` parameter of the [[12-directives/health-check-http-upstream-hc|health_check]] directive:

```nginx
http {
    server {
    ...
        location / {
            proxy_pass http://backend;
            health_check match=welcome;
        }
    }

    match welcome {
        status 200;
        header Content-Type = text/html;
        body ~ "Welcome to nginx!";
    }
}
```

This configuration shows that in order for a health check to pass, the response to a health check request should succeed, have status 200, and contain “`Welcome to nginx!`” in the body.

## Directives

- [[12-directives/health-check-http-upstream-hc|health_check]]
- [[12-directives/match-http-upstream-hc|match]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
