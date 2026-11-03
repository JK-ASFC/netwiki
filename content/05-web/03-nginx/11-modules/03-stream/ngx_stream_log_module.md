---
title: "ngx_stream_log_module"
description: "Module nginx ngx_stream_log_module — The ngx_stream_log_module module (1.11.4) writes session logs in the specified format."
tags: [nginx, module, ngx_stream_log_module]
icon: puzzle
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

The `ngx_stream_log_module` module (1.11.4) writes session logs in the specified format.

## Example Configuration

```nginx
log_format basic '$remote_addr [$time_local] '
                 '$protocol $status $bytes_sent $bytes_received '
                 '$session_time';

access_log /spool/logs/nginx-access.log basic buffer=32k;
```

## Directives

- [[12-directives/access-log-stream-log|access_log]]
- [[12-directives/log-format-stream-log|log_format]]
- [[12-directives/open-log-file-cache-stream-log|open_log_file_cache]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
