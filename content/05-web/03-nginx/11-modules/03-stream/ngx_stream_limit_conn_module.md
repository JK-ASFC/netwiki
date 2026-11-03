---
title: "ngx_stream_limit_conn_module"
description: "Module nginx ngx_stream_limit_conn_module — Le module ngx_stream_limit_conn_module (1.9.3) sert à limiter le nombre de connexions par clé définie, en particulier le nombre de connexions depuis une même adresse IP."
tags: [nginx, module, ngx_stream_limit_conn_module]
icon: puzzle
---

Le module `ngx_stream_limit_conn_module` (1.9.3) sert à limiter le nombre de connexions par clé définie, en particulier le nombre de connexions depuis une même adresse IP.

## Exemple de configuration

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
