---
title: "ngx_stream_core_module"
description: "Module nginx ngx_stream_core_module — The ngx_stream_core_module module is available since version 1.9.0. This module is not built by default, it should be enabled with the --with-stream configuration parameter."
tags: [nginx, module, ngx_stream_core_module]
icon: puzzle
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

The `ngx_stream_core_module` module is available since version 1.9.0. This module is not built by default, it should be enabled with the `--with-stream` configuration parameter.

## Example Configuration

```nginx
worker_processes auto;

error_log /var/log/nginx/error.log info;

events {
    worker_connections  1024;
}

stream {
    upstream backend {
        hash $remote_addr consistent;

        server backend1.example.com:12345 weight=5;
        server 127.0.0.1:12345            max_fails=3 fail_timeout=30s;
        server unix:/tmp/backend3;
    }

    upstream dns {
       server 192.168.0.1:53535;
       server dns.example.com:53;
    }

    server {
        listen 12345;
        proxy_connect_timeout 1s;
        proxy_timeout 3s;
        proxy_pass backend;
    }

    server {
        listen 127.0.0.1:53 udp reuseport;
        proxy_timeout 20s;
        proxy_pass dns;
    }

    server {
        listen [::1]:12345;
        proxy_pass unix:/tmp/stream.socket;
    }
}
```

## Directives

- [[12-directives/listen-stream-core|listen]]
- [[12-directives/preread-buffer-size|preread_buffer_size]]
- [[12-directives/preread-timeout|preread_timeout]]
- [[12-directives/proxy-protocol-timeout|proxy_protocol_timeout]]
- [[12-directives/resolver-stream-core|resolver]]
- [[12-directives/resolver-timeout-stream-core|resolver_timeout]]
- [[12-directives/server-stream-core|server]]
- [[12-directives/server-name-stream-core|server_name]]
- [[12-directives/server-names-hash-bucket-size-stream-core|server_names_hash_bucket_size]]
- [[12-directives/server-names-hash-max-size-stream-core|server_names_hash_max_size]]
- [[12-directives/stream|stream]]
- [[12-directives/tcp-nodelay-stream-core|tcp_nodelay]]
- [[12-directives/variables-hash-bucket-size-stream-core|variables_hash_bucket_size]]
- [[12-directives/variables-hash-max-size-stream-core|variables_hash_max_size]]

## Variables intégrées

- [[13-variables/binary-remote-addr-stream-core|$binary_remote_addr]]
- [[13-variables/bytes-received|$bytes_received]]
- [[13-variables/bytes-sent-stream-core|$bytes_sent]]
- [[13-variables/connection-stream-core|$connection]]
- [[13-variables/hostname-stream-core|$hostname]]
- [[13-variables/msec-stream-core|$msec]]
- [[13-variables/nginx-version-stream-core|$nginx_version]]
- [[13-variables/pid-stream-core|$pid]]
- [[13-variables/protocol|$protocol]]
- [[13-variables/proxy-protocol-addr-stream-core|$proxy_protocol_addr]]
- [[13-variables/proxy-protocol-port-stream-core|$proxy_protocol_port]]
- [[13-variables/proxy-protocol-server-addr-stream-core|$proxy_protocol_server_addr]]
- [[13-variables/proxy-protocol-server-port-stream-core|$proxy_protocol_server_port]]
- [[13-variables/proxy-protocol-tlv-name-stream-core|$proxy_protocol_tlv_name]]
- [[13-variables/remote-addr-stream-core|$remote_addr]]
- [[13-variables/remote-port-stream-core|$remote_port]]
- [[13-variables/server-addr-stream-core|$server_addr]]
- [[13-variables/server-port-stream-core|$server_port]]
- [[13-variables/session-time|$session_time]]
- [[13-variables/status-stream-core|$status]]
- [[13-variables/time-iso8601-stream-core|$time_iso8601]]
- [[13-variables/time-iso8601-ms-stream-core|$time_iso8601_ms]]
- [[13-variables/time-local-stream-core|$time_local]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
