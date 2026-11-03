---
title: "ngx_http_log_module"
description: "Module nginx ngx_http_log_module — The ngx_http_log_module module writes request logs in the specified format."
tags: [nginx, module, ngx_http_log_module]
icon: puzzle
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

The `ngx_http_log_module` module writes request logs in the specified format.

Requests are logged in the context of a location where processing ends. It may be different from the original location, if an [[12-directives/internal|internal redirect]] happens during request processing.

## Example Configuration

```nginx
log_format compression '$remote_addr - $remote_user [$time_local] '
                       '"$request" $status $bytes_sent '
                       '"$http_referer" "$http_user_agent" "$gzip_ratio"';

access_log /spool/logs/nginx-access.log compression buffer=32k;
```

## Directives

- [[12-directives/access-log-http-log|access_log]]
- [[12-directives/log-format-http-log|log_format]]
- [[12-directives/open-log-file-cache-http-log|open_log_file_cache]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
