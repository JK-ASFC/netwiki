---
title: "How nginx processes a TCP/UDP session"
description: "Nginx — How nginx processes a TCP/UDP session. A TCP/UDP session from a client is processed in successive steps called phases:"
tags: [nginx, guide]
icon: book-open
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

A TCP/UDP session from a client is processed in successive steps called **phases**:

- **`Post-accept`**

  The first phase after accepting a client connection. The [[11-modules/03-stream/ngx_stream_realip_module|ngx_stream_realip_module]] module is invoked at this phase.

- **`Pre-access`**

  Preliminary check for access. The [[11-modules/03-stream/ngx_stream_limit_conn_module|ngx_stream_limit_conn_module]] and [[11-modules/03-stream/ngx_stream_set_module|ngx_stream_set_module]] modules are invoked at this phase.

- **`Access`**

  Client access limitation before actual data processing. At this phase, the [[11-modules/03-stream/ngx_stream_access_module|ngx_stream_access_module]] module is invoked, for [[10-guides/04-njs/00-index|njs]], the [[12-directives/js-access-stream-js|js_access]] directive is invoked.

- **`SSL`**

  TLS/SSL termination. The [[11-modules/03-stream/ngx_stream_ssl_module|ngx_stream_ssl_module]] module is invoked at this phase.

- **`Preread`**

  Reading initial bytes of data into the [[12-directives/preread-buffer-size|preread buffer]] to allow modules such as [[11-modules/03-stream/ngx_stream_ssl_preread_module|ngx_stream_ssl_preread_module]] analyze the data before its processing. For [[10-guides/04-njs/00-index|njs]], the [[12-directives/js-preread|js_preread]] directive is invoked at this phase.

- **`Content`**

  Mandatory phase where data is actually processed, usually [[11-modules/03-stream/ngx_stream_proxy_module|proxied]] to [[11-modules/03-stream/ngx_stream_upstream_module|upstream]] servers, or a specified value is [[11-modules/03-stream/ngx_stream_return_module|returned]] to a client. For [[10-guides/04-njs/00-index|njs]], the [[12-directives/js-filter|js_filter]] directive is invoked at this phase.

- **`Log`**

  The final phase where the result of a client session processing is recorded. The [[11-modules/03-stream/ngx_stream_log_module|ngx_stream_log_module]] module is invoked at this phase.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
