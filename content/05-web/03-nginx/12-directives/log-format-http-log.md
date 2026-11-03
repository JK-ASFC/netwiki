---
title: "log_format (ngx_http_log_module)"
description: "Directive nginx log_format (ngx_http_log_module) — Specifies log format. The escape parameter (1.11.8) allows setting json or default characters escaping in variables, by default, default escaping is used. The none value (1.13.10) disables escaping.…"
tags: [nginx, directive, ngx_http_log_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `log_format name [escape=default\|json\|none] string ...;` |
| **Valeur par défaut** | `log_format combined "...";` |
| **Contexte** | `http` |
| **Module** | [[11-modules/02-http/ngx_http_log_module\|ngx_http_log_module]] |

## Utilisation

Specifies log format.

The `escape` parameter (1.11.8) allows setting `json` or `default` characters escaping in variables, by default, `default` escaping is used. The `none` value (1.13.10) disables escaping.

For `default` escaping, characters “`"`”, “`\`”, and other characters with values less than 32 (0.7.0) or above 126 (1.1.6) are escaped as “`\xXX`”. If the variable value is not found, a hyphen (“`-`”) will be logged.

For `json` escaping, all characters not allowed in JSON [strings](https://datatracker.ietf.org/doc/html/rfc8259#section-7) will be escaped: characters “`"`” and “`\`” are escaped as “`\"`” and “`\\`”, characters with values less than 32 are escaped as “`\n`”, “`\r`”, “`\t`”, “`\b`”, “`\f`”, or “`\u00XX`”.

The log format can contain common variables, and variables that exist only at the time of a log write:

- **`$bytes_sent`**

  the number of bytes sent to a client

- **`$connection`**

  connection serial number

- **`$connection_requests`**

  the current number of requests made through a connection (1.1.18)

- **`$msec`**

  time in seconds with a milliseconds resolution at the time of the log write

- **`$pipe`**

  “`p`” if request was pipelined, “`.`” otherwise

- **`$request_length`**

  request length (including request line, header, and request body)

- **`$request_time`**

  request processing time in seconds with a milliseconds resolution; time elapsed between the first bytes were read from the client and the log write after the last bytes were sent to the client

- **`$status`**

  response status

- **`$time_iso8601`**

  local time in the ISO 8601 standard format

- **`$time_local`**

  local time in the Common Log Format

> [!NOTE]
> In the modern nginx versions variables [[13-variables/status-http-core|$status]] (1.3.2, 1.2.2), [[13-variables/bytes-sent-http-core|$bytes_sent]] (1.3.8, 1.2.5), [[13-variables/connection-http-core|$connection]] (1.3.8, 1.2.5), [[13-variables/connection-requests|$connection_requests]] (1.3.8, 1.2.5), [[13-variables/msec-http-core|$msec]] (1.3.9, 1.2.6), [[13-variables/request-time|$request_time]] (1.3.9, 1.2.6), [[13-variables/pipe|$pipe]] (1.3.12, 1.2.7), [[13-variables/request-length|$request_length]] (1.3.12, 1.2.7), [[13-variables/time-iso8601-http-core|$time_iso8601]] (1.3.12, 1.2.7), and [[13-variables/time-local-http-core|$time_local]] (1.3.12, 1.2.7) are also available as common variables.

Header lines sent to a client have the prefix “`sent_http_`”, for example, `$sent_http_content_range`.

The configuration always includes the predefined “`combined`” format:

```nginx
log_format combined '$remote_addr - $remote_user [$time_local] '
                    '"$request" $status $body_bytes_sent '
                    '"$http_referer" "$http_user_agent"';
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
