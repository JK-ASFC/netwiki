---
title: "access_log (ngx_stream_log_module)"
description: "Directive nginx access_log (ngx_stream_log_module) — Sets the path, format, and configuration for a buffered log write. Several logs can be specified on the same configuration level. Logging to syslog can be configured by specifying the “syslog:”…"
tags: [nginx, directive, ngx_stream_log_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `access_log path format [buffer=size] [gzip[=level]] [flush=time] [if=condition];` ou `access_log off;` |
| **Valeur par défaut** | `access_log off;` |
| **Contexte** | `stream`, `server` |
| **Module** | [[11-modules/03-stream/ngx_stream_log_module\|ngx_stream_log_module]] |

## Utilisation

Sets the path, [[12-directives/log-format-stream-log|format]], and configuration for a buffered log write. Several logs can be specified on the same configuration level. Logging to [[10-guides/01-introduction/syslog|syslog]] can be configured by specifying the “`syslog:`” prefix in the first parameter. The special value `off` cancels all `access_log` directives on the current level.

If either the `buffer` or `gzip` parameter is used, writes to log will be buffered.

> [!NOTE]
> The buffer size must not exceed the size of an atomic write to a disk file. For FreeBSD this size is unlimited.

When buffering is enabled, the data will be written to the file:

- if the next log line does not fit into the buffer;
- if the buffered data is older than specified by the `flush` parameter;
- when a worker process is [[10-guides/01-introduction/control|re-opening]] log files or is shutting down.

If the `gzip` parameter is used, then the buffered data will be compressed before writing to the file. The compression level can be set between 1 (fastest, less compression) and 9 (slowest, best compression). By default, the buffer size is equal to 64K bytes, and the compression level is set to 1. Since the data is compressed in atomic blocks, the log file can be decompressed or read by “`zcat`” at any time.

Example:

```nginx
access_log /path/to/log.gz basic gzip flush=5m;
```

> [!NOTE]
> For gzip compression to work, nginx must be built with the zlib library.

The file path can contain variables, but such logs have some constraints:

- the [[12-directives/user|user]] whose credentials are used by worker processes should have permissions to create files in a directory with such logs;
- buffered writes do not work;
- the file is opened and closed for each log write. However, since the descriptors of frequently used files can be stored in a [[12-directives/open-log-file-cache-stream-log|cache]], writing to the old file can continue during the time specified by the [[12-directives/open-log-file-cache-stream-log|open_log_file_cache]] directive’s `valid` parameter

The `if` parameter enables conditional logging. A session will not be logged if the *condition* evaluates to “0” or an empty string.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
