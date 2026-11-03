---
title: "access_log (ngx_http_log_module)"
description: "Directive nginx access_log (ngx_http_log_module) — Sets the path, format, and configuration for a buffered log write. Several logs can be specified on the same configuration level. Logging to syslog can be configured by specifying the “syslog:”…"
tags: [nginx, directive, ngx_http_log_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `access_log path [format [buffer=size] [gzip[=level]] [flush=time] [if=condition]];` ou `access_log off;` |
| **Valeur par défaut** | `access_log logs/access.log combined;` |
| **Contexte** | `http`, `server`, `location`, `if dans location`, `limit_except` |
| **Module** | [[11-modules/02-http/ngx_http_log_module\|ngx_http_log_module]] |

## Utilisation

Sets the path, format, and configuration for a buffered log write. Several logs can be specified on the same configuration level. Logging to [[10-guides/01-introduction/syslog|syslog]] can be configured by specifying the “`syslog:`” prefix in the first parameter. The special value `off` cancels all `access_log` directives on the current level. If the format is not specified then the predefined “`combined`” format is used.

If either the `buffer` or `gzip` (1.3.10, 1.2.7) parameter is used, writes to log will be buffered.

> [!NOTE]
> The buffer size must not exceed the size of an atomic write to a disk file. For FreeBSD this size is unlimited.

When buffering is enabled, the data will be written to the file:

- if the next log line does not fit into the buffer;
- if the buffered data is older than specified by the `flush` parameter (1.3.10, 1.2.7);
- when a worker process is [[10-guides/01-introduction/control|re-opening]] log files or is shutting down.

If the `gzip` parameter is used, then the buffered data will be compressed before writing to the file. The compression level can be set between 1 (fastest, less compression) and 9 (slowest, best compression). By default, the buffer size is equal to 64K bytes, and the compression level is set to 1. Since the data is compressed in atomic blocks, the log file can be decompressed or read by “`zcat`” at any time.

Example:

```nginx
access_log /path/to/log.gz combined gzip flush=5m;
```

> [!NOTE]
> For gzip compression to work, nginx must be built with the zlib library.

The file path can contain variables (0.7.6+), but such logs have some constraints:

- the [[12-directives/user|user]] whose credentials are used by worker processes should have permissions to create files in a directory with such logs;
- buffered writes do not work;
- the file is opened and closed for each log write. However, since the descriptors of frequently used files can be stored in a [[12-directives/open-log-file-cache-http-log|cache]], writing to the old file can continue during the time specified by the [[12-directives/open-log-file-cache-http-log|open_log_file_cache]] directive’s `valid` parameter
- during each log write the existence of the request’s [[12-directives/root|root directory]] is checked, and if it does not exist the log is not created. It is thus a good idea to specify both [[12-directives/root|root]] and `access_log` on the same configuration level:

  ```nginx
  server {
      root       /spool/vhost/data/$host;
      access_log /spool/vhost/logs/$host;
      ...
  ```

The `if` parameter (1.7.0) enables conditional logging. A request will not be logged if the *condition* evaluates to “0” or an empty string. In the following example, the requests with response codes 2xx and 3xx will not be logged:

```nginx
map $status $loggable {
    ~^[23]  0;
    default 1;
}

access_log /path/to/access.log combined if=$loggable;
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
