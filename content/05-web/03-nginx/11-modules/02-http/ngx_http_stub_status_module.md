---
title: "ngx_http_stub_status_module"
description: "Module nginx ngx_http_stub_status_module — The ngx_http_stub_status_module module provides access to basic status information."
tags: [nginx, module, ngx_http_stub_status_module]
icon: puzzle
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

The `ngx_http_stub_status_module` module provides access to basic status information.

This module is not built by default, it should be enabled with the `--with-http_stub_status_module` configuration parameter.

## Exemple de configuration

```nginx
location = /basic_status {
    stub_status;
}
```

This configuration creates a simple web page with basic status data which may look like as follows:

```nginx
Active connections: 291
server accepts handled requests
 16630948 16630948 31070465
Reading: 6 Writing: 179 Waiting: 106
```

## Data

The following status information is provided:

- **`Active connections`**

  The current number of active client connections including `Waiting` connections.

- **`accepts`**

  The total number of accepted client connections.

- **`handled`**

  The total number of handled connections. Generally, the parameter value is the same as `accepts` unless some resource limits have been reached (for example, the [[12-directives/worker-connections|worker_connections]] limit).

- **`requests`**

  The total number of client requests.

- **`Reading`**

  The current number of connections where nginx is reading the request header.

- **`Writing`**

  The current number of connections where nginx is writing the response back to the client.

- **`Waiting`**

  The current number of idle client connections waiting for a request.

## Directives

- [[12-directives/stub-status|stub_status]]

## Variables intégrées

- [[13-variables/connections-active|$connections_active]]
- [[13-variables/connections-reading|$connections_reading]]
- [[13-variables/connections-writing|$connections_writing]]
- [[13-variables/connections-waiting|$connections_waiting]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
