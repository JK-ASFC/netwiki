---
title: "log_format (ngx_stream_log_module)"
description: "Directive nginx log_format (ngx_stream_log_module) — Specifies the log format, for example: nginx log_format proxy '$remote_addr $time_local ' '$protocol $status $bytes_sent $bytes_received ' '$session_time \"$upstream_addr\" ' '\"$upstream_bytes_sent\"…"
tags: [nginx, directive, ngx_stream_log_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `log_format name [escape=default\|json\|none] string ...;` |
| **Valeur par défaut** | — |
| **Contexte** | `stream` |
| **Module** | [[11-modules/03-stream/ngx_stream_log_module\|ngx_stream_log_module]] |

## Utilisation

Specifies the log format, for example:

```nginx
log_format proxy '$remote_addr [$time_local] '
                 '$protocol $status $bytes_sent $bytes_received '
                 '$session_time "$upstream_addr" '
                 '"$upstream_bytes_sent" "$upstream_bytes_received" "$upstream_connect_time"';
```

The `escape` parameter (1.11.8) allows setting `json` or `default` characters escaping in variables, by default, `default` escaping is used. The `none` parameter (1.13.10) disables escaping.

For `default` escaping, characters “`"`”, “`\`”, and other characters with values less than 32 or above 126 are escaped as “`\xXX`”. If the variable value is not found, a hyphen (“`-`”) will be logged.

For `json` escaping, all characters not allowed in JSON [strings](https://datatracker.ietf.org/doc/html/rfc8259#section-7) will be escaped: characters “`"`” and “`\`” are escaped as “`\"`” and “`\\`”, characters with values less than 32 are escaped as “`\n`”, “`\r`”, “`\t`”, “`\b`”, “`\f`”, or “`\u00XX`”.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
