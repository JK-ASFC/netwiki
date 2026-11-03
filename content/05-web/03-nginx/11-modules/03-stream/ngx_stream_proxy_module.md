---
title: "ngx_stream_proxy_module"
description: "Module nginx ngx_stream_proxy_module — Le module ngx_stream_proxy_module (1.9.0) permet de mandater des flux de données sur TCP, UDP (1.9.13) et sockets de domaine UNIX."
tags: [nginx, module, ngx_stream_proxy_module]
icon: puzzle
---

Le module `ngx_stream_proxy_module` (1.9.0) permet de mandater des flux de données sur TCP, UDP (1.9.13) et sockets de domaine UNIX.

## Exemple de configuration

```nginx
server {
    listen 127.0.0.1:12345;
    proxy_pass 127.0.0.1:8080;
}

server {
    listen 12345;
    proxy_connect_timeout 1s;
    proxy_timeout 1m;
    proxy_pass example.com:12345;
}

server {
    listen 53 udp reuseport;
    proxy_timeout 20s;
    proxy_pass dns.example.com:53;
}

server {
    listen [::1]:12345;
    proxy_pass unix:/tmp/stream.socket;
}
```

## Directives

- [[12-directives/proxy-bind-stream-proxy|proxy_bind]]
- [[12-directives/proxy-bind-dynamic-stream-proxy|proxy_bind_dynamic]]
- [[12-directives/proxy-buffer-size-stream-proxy|proxy_buffer_size]]
- [[12-directives/proxy-connect-timeout-stream-proxy|proxy_connect_timeout]]
- [[12-directives/proxy-download-rate|proxy_download_rate]]
- [[12-directives/proxy-half-close|proxy_half_close]]
- [[12-directives/proxy-next-upstream-stream-proxy|proxy_next_upstream]]
- [[12-directives/proxy-next-upstream-timeout-stream-proxy|proxy_next_upstream_timeout]]
- [[12-directives/proxy-next-upstream-tries-stream-proxy|proxy_next_upstream_tries]]
- [[12-directives/proxy-pass-stream-proxy|proxy_pass]]
- [[12-directives/proxy-protocol-stream-proxy|proxy_protocol]]
- [[12-directives/proxy-requests|proxy_requests]]
- [[12-directives/proxy-responses|proxy_responses]]
- [[12-directives/proxy-session-drop|proxy_session_drop]]
- [[12-directives/proxy-socket-keepalive-stream-proxy|proxy_socket_keepalive]]
- [[12-directives/proxy-socket-rcvbuf-stream-proxy|proxy_socket_rcvbuf]]
- [[12-directives/proxy-socket-sndbuf-stream-proxy|proxy_socket_sndbuf]]
- [[12-directives/proxy-ssl|proxy_ssl]]
- [[12-directives/proxy-ssl-alpn|proxy_ssl_alpn]]
- [[12-directives/proxy-ssl-certificate-stream-proxy|proxy_ssl_certificate]]
- [[12-directives/proxy-ssl-certificate-cache-stream-proxy|proxy_ssl_certificate_cache]]
- [[12-directives/proxy-ssl-certificate-key-stream-proxy|proxy_ssl_certificate_key]]
- [[12-directives/proxy-ssl-ciphers-stream-proxy|proxy_ssl_ciphers]]
- [[12-directives/proxy-ssl-conf-command-stream-proxy|proxy_ssl_conf_command]]
- [[12-directives/proxy-ssl-crl-stream-proxy|proxy_ssl_crl]]
- [[12-directives/proxy-ssl-key-log-stream-proxy|proxy_ssl_key_log]]
- [[12-directives/proxy-ssl-name-stream-proxy|proxy_ssl_name]]
- [[12-directives/proxy-ssl-password-file-stream-proxy|proxy_ssl_password_file]]
- [[12-directives/proxy-ssl-protocols-stream-proxy|proxy_ssl_protocols]]
- [[12-directives/proxy-ssl-server-name-stream-proxy|proxy_ssl_server_name]]
- [[12-directives/proxy-ssl-session-reuse-stream-proxy|proxy_ssl_session_reuse]]
- [[12-directives/proxy-ssl-trusted-certificate-stream-proxy|proxy_ssl_trusted_certificate]]
- [[12-directives/proxy-ssl-verify-stream-proxy|proxy_ssl_verify]]
- [[12-directives/proxy-ssl-verify-depth-stream-proxy|proxy_ssl_verify_depth]]
- [[12-directives/proxy-timeout-stream-proxy|proxy_timeout]]
- [[12-directives/proxy-upload-rate|proxy_upload_rate]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
