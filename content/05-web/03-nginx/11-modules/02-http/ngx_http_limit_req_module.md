---
title: "ngx_http_limit_req_module"
description: "Module nginx ngx_http_limit_req_module — The ngx_http_limit_req_module module (0.7.21) is used to limit the request processing rate per a defined key, in particular, the processing rate of requests coming from a single IP address. The limitation is done using…"
tags: [nginx, module, ngx_http_limit_req_module]
icon: puzzle
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

The `ngx_http_limit_req_module` module (0.7.21) is used to limit the request processing rate per a defined key, in particular, the processing rate of requests coming from a single IP address. The limitation is done using the “leaky bucket” method.

## Example Configuration

```nginx
http {
    limit_req_zone $binary_remote_addr zone=one:10m rate=1r/s;

    ...

    server {

        ...

        location /search/ {
            limit_req zone=one burst=5;
        }
```

## Directives

- [[12-directives/limit-req|limit_req]]
- [[12-directives/limit-req-dry-run|limit_req_dry_run]]
- [[12-directives/limit-req-log-level|limit_req_log_level]]
- [[12-directives/limit-req-status|limit_req_status]]
- [[12-directives/limit-req-zone|limit_req_zone]]

## Variables intégrées

- [[13-variables/limit-req-status|$limit_req_status]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
