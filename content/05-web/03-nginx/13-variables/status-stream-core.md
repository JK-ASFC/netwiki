---
title: "$status (ngx_stream_core_module)"
description: "Variable nginx $status (ngx_stream_core_module) — session status (1.11.4), can be one of the following: - 200 session completed successfully - 400 client data could not be parsed, for example, the PROXY protocol header - 403 access forbidden, for…"
tags: [nginx, variable, ngx_stream_core_module]
icon: dollar-sign
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Variable** | `$status` |
| **Module** | [[11-modules/03-stream/ngx_stream_core_module\|ngx_stream_core_module]] |

session status (1.11.4), can be one of the following:

- **`200`**

  session completed successfully

- **`400`**

  client data could not be parsed, for example, the PROXY protocol header

- **`403`**

  access forbidden, for example, when access is limited for [[11-modules/03-stream/ngx_stream_access_module|certain client addresses]]

- **`500`**

  internal server error

- **`502`**

  bad gateway, for example, if an upstream server could not be selected or reached.

- **`503`**

  service unavailable, for example, when access is limited by the [[11-modules/03-stream/ngx_stream_limit_conn_module|number of connections]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
