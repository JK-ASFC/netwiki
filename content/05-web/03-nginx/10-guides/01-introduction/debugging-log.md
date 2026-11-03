---
title: "A debugging log"
description: "Nginx — A debugging log. To enable a debugging log, nginx needs to be configured to support debugging during the build:"
tags: [nginx, guide]
icon: book-open
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

To enable a debugging log, nginx needs to be configured to support debugging during the build:

```
./configure --with-debug ...
```

Then the `debug` level should be set with the [[12-directives/error-log|error_log]] directive:

```c
error_log /path/to/log debug;
```

To verify that nginx is configured to support debugging, run the `nginx -V` command:

```
configure arguments: --with-debug ...
```

Pre-built Linux packages provide out-of-the-box support for debugging log with the `nginx-debug` binary (1.9.8) which can be run using commands

```
service nginx stop
service nginx-debug start
```

and then set the `debug` level. The nginx binary version for Windows is always built with the debugging log support, so only setting the `debug` level will suffice.

Note that redefining the log without also specifying the `debug` level will disable the debugging log. In the example below, redefining the log on the [[12-directives/server-http-core|server]] level disables the debugging log for this server:

```
error_log /path/to/log debug;

http {
    server {
        error_log /path/to/log;
        ...
```

To avoid this, either the line redefining the log should be commented out, or the `debug` level specification should also be added:

```
error_log /path/to/log debug;

http {
    server {
        error_log /path/to/log debug;
        ...
```

## Debugging log for selected clients

It is also possible to enable the debugging log for [[12-directives/debug-connection|selected client addresses]] only:

```c
error_log /path/to/log;

events {
    debug_connection 192.168.1.1;
    debug_connection 192.168.10.0/24;
}
```

## Logging to a cyclic memory buffer

The debugging log can be written to a cyclic memory buffer:

```c
error_log memory:32m debug;
```

Logging to the memory buffer on the `debug` level does not have significant impact on performance even under high load. In this case, the log can be extracted using a `gdb` script like the following one:

```nginx
set $log = ngx_cycle->log

while $log->writer != ngx_log_memory_writer
    set $log = $log->next
end

set $buf = (ngx_log_memory_buf_t *) $log->wdata
dump binary memory debug_log.txt $buf->start $buf->end
```

Or using an `lldb` script as follows:

```nginx
expr ngx_log_t *$log = ngx_cycle->log
expr while ($log->writer != ngx_log_memory_writer) { $log = $log->next; }
expr ngx_log_memory_buf_t *$buf = (ngx_log_memory_buf_t *) $log->wdata
memory read --force --outfile debug_log.txt --binary $buf->start $buf->end
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
