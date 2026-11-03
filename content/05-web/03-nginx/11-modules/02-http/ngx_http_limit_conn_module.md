---
title: "ngx_http_limit_conn_module"
description: "Module nginx ngx_http_limit_conn_module — The ngx_http_limit_conn_module module is used to limit the number of connections per the defined key, in particular, the number of connections from a single IP address."
tags: [nginx, module, ngx_http_limit_conn_module]
icon: puzzle
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

The `ngx_http_limit_conn_module` module is used to limit the number of connections per the defined key, in particular, the number of connections from a single IP address.

Not all connections are counted. A connection is counted only if it has a request being processed by the server and the whole request header has already been read.

## Example Configuration

```nginx
http {
    limit_conn_zone $binary_remote_addr zone=addr:10m;

    ...

    server {

        ...

        location /download/ {
            limit_conn addr 1;
        }
```

## Directives

- [[12-directives/limit-conn-http-limit-conn|limit_conn]]
- [[12-directives/limit-conn-dry-run-http-limit-conn|limit_conn_dry_run]]
- [[12-directives/limit-conn-log-level-http-limit-conn|limit_conn_log_level]]
- [[12-directives/limit-conn-status|limit_conn_status]]
- [[12-directives/limit-conn-zone-http-limit-conn|limit_conn_zone]]
- [[12-directives/limit-zone|limit_zone]]

## Variables intégrées

- [[13-variables/limit-conn-status-http-limit-conn|$limit_conn_status]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
