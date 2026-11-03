---
title: "ngx_stream_limit_conn_module"
description: "Module nginx ngx_stream_limit_conn_module — The ngx_stream_limit_conn_module module (1.9.3) is used to limit the number of connections per the defined key, in particular, the number of connections from a single IP address."
tags: [nginx, module, ngx_stream_limit_conn_module]
icon: puzzle
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

The `ngx_stream_limit_conn_module` module (1.9.3) is used to limit the number of connections per the defined key, in particular, the number of connections from a single IP address.

## Example Configuration

```nginx
stream {
    limit_conn_zone $binary_remote_addr zone=addr:10m;

    ...

    server {

        ...

        limit_conn           addr 1;
        limit_conn_log_level error;
    }
}
```

## Directives

- [[12-directives/limit-conn-stream-limit-conn|limit_conn]]
- [[12-directives/limit-conn-dry-run-stream-limit-conn|limit_conn_dry_run]]
- [[12-directives/limit-conn-log-level-stream-limit-conn|limit_conn_log_level]]
- [[12-directives/limit-conn-zone-stream-limit-conn|limit_conn_zone]]

## Variables intégrées

- [[13-variables/limit-conn-status-stream-limit-conn|$limit_conn_status]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
