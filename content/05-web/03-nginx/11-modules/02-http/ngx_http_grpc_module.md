---
title: "ngx_http_grpc_module"
description: "Module nginx ngx_http_grpc_module — The ngx_http_grpc_module module allows passing requests to a gRPC server (1.13.10). The module requires the ngx_http_v2_module module."
tags: [nginx, module, ngx_http_grpc_module]
icon: puzzle
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

The `ngx_http_grpc_module` module allows passing requests to a gRPC server (1.13.10). The module requires the [[11-modules/02-http/ngx_http_v2_module|ngx_http_v2_module]] module.

## Example Configuration

```nginx
server {
    listen 9000;

    http2 on;

    location / {
        grpc_pass 127.0.0.1:9000;
    }
}
```

## Directives

- [[12-directives/grpc-allow-upstream|grpc_allow_upstream]]
- [[12-directives/grpc-bind|grpc_bind]]
- [[12-directives/grpc-bind-dynamic|grpc_bind_dynamic]]
- [[12-directives/grpc-buffer-size|grpc_buffer_size]]
- [[12-directives/grpc-connect-timeout|grpc_connect_timeout]]
- [[12-directives/grpc-hide-header|grpc_hide_header]]
- [[12-directives/grpc-ignore-headers|grpc_ignore_headers]]
- [[12-directives/grpc-intercept-errors|grpc_intercept_errors]]
- [[12-directives/grpc-next-upstream|grpc_next_upstream]]
- [[12-directives/grpc-next-upstream-timeout|grpc_next_upstream_timeout]]
- [[12-directives/grpc-next-upstream-tries|grpc_next_upstream_tries]]
- [[12-directives/grpc-pass|grpc_pass]]
- [[12-directives/grpc-pass-header|grpc_pass_header]]
- [[12-directives/grpc-read-timeout|grpc_read_timeout]]
- [[12-directives/grpc-request-dynamic|grpc_request_dynamic]]
- [[12-directives/grpc-send-timeout|grpc_send_timeout]]
- [[12-directives/grpc-set-header|grpc_set_header]]
- [[12-directives/grpc-socket-keepalive|grpc_socket_keepalive]]
- [[12-directives/grpc-socket-rcvbuf|grpc_socket_rcvbuf]]
- [[12-directives/grpc-socket-sndbuf|grpc_socket_sndbuf]]
- [[12-directives/grpc-ssl-certificate|grpc_ssl_certificate]]
- [[12-directives/grpc-ssl-certificate-cache|grpc_ssl_certificate_cache]]
- [[12-directives/grpc-ssl-certificate-key|grpc_ssl_certificate_key]]
- [[12-directives/grpc-ssl-ciphers|grpc_ssl_ciphers]]
- [[12-directives/grpc-ssl-conf-command|grpc_ssl_conf_command]]
- [[12-directives/grpc-ssl-crl|grpc_ssl_crl]]
- [[12-directives/grpc-ssl-key-log|grpc_ssl_key_log]]
- [[12-directives/grpc-ssl-name|grpc_ssl_name]]
- [[12-directives/grpc-ssl-password-file|grpc_ssl_password_file]]
- [[12-directives/grpc-ssl-protocols|grpc_ssl_protocols]]
- [[12-directives/grpc-ssl-server-name|grpc_ssl_server_name]]
- [[12-directives/grpc-ssl-session-reuse|grpc_ssl_session_reuse]]
- [[12-directives/grpc-ssl-trusted-certificate|grpc_ssl_trusted_certificate]]
- [[12-directives/grpc-ssl-verify|grpc_ssl_verify]]
- [[12-directives/grpc-ssl-verify-depth|grpc_ssl_verify_depth]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
