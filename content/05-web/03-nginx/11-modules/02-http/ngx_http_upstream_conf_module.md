---
title: "ngx_http_upstream_conf_module"
description: "Module nginx ngx_http_upstream_conf_module — The ngx_http_upstream_conf_module module allows configuring upstream server groups on-the-fly via a simple HTTP interface without the need of restarting nginx. The http or stream server group must reside in the shared…"
tags: [nginx, module, ngx_http_upstream_conf_module]
icon: puzzle
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

The `ngx_http_upstream_conf_module` module allows configuring upstream server groups on-the-fly via a simple HTTP interface without the need of restarting nginx. The [[12-directives/zone-http-upstream|http]] or [[12-directives/zone-stream-upstream|stream]] server group must reside in the shared memory.

> [!NOTE]
> This module was available as part of our [abonnement commercial](https://nginx.com/products/) until 1.13.10. It was superseded by the [[11-modules/02-http/ngx_http_api_module|ngx_http_api_module]] module in 1.13.3.

## Example Configuration

```nginx
upstream backend {
    zone upstream_backend 64k;

    ...
}

server {
    location /upstream_conf {
        upstream_conf;
        allow 127.0.0.1;
        deny all;
    }
}
```

## Directives

- [[12-directives/upstream-conf|upstream_conf]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
