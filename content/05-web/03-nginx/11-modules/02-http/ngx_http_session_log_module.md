---
title: "ngx_http_session_log_module"
description: "Module nginx ngx_http_session_log_module — The ngx_http_session_log_module module enables logging sessions (that is, aggregates of multiple HTTP requests) instead of individual HTTP requests."
tags: [nginx, module, ngx_http_session_log_module]
icon: puzzle
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

The `ngx_http_session_log_module` module enables logging sessions (that is, aggregates of multiple HTTP requests) instead of individual HTTP requests.

> [!NOTE]
> This module is available as part of our [abonnement commercial](https://nginx.com/products/).

## Example Configuration

The following configuration sets up a session log and maps requests to sessions according to the request client address and `User-Agent` request header field:

```nginx
session_log_zone /path/to/log format=combined
                 zone=one:1m timeout=30s
                 md5=$binary_remote_addr$http_user_agent;

location /media/ {
    session_log one;
}
```

## Directives

- [[12-directives/session-log|session_log]]
- [[12-directives/session-log-format|session_log_format]]
- [[12-directives/session-log-zone|session_log_zone]]

## Variables intégrées

- [[13-variables/session-log-id|$session_log_id]]
- [[13-variables/session-log-binary-id|$session_log_binary_id]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
